import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { AddBloodBankDTO, AddBulkBloodDTO, SuccessResponse } from "src/Auth/dto/Auth.dto";
import { MysqlPoolService } from "src/Utils/mysq.service";

@Injectable()
export class AdminService {
    constructor(
        private readonly mysqlService: MysqlPoolService

    ) { }


    async dashboard()
        : Promise<SuccessResponse | BadRequestException> {
        try {
            let recentBloodRequestscount = await this.mysqlService.execute(
                `
                SELECT 
                  (SELECT COUNT(*) FROM campaigns WHERE isFinished = ?) AS campaigns_count,
                  (SELECT COUNT(*) FROM ambulances) AS ambulances_count,
                  (SELECT COUNT(*) FROM bloodRequests) AS bloodRequests_count,
                  (SELECT COUNT(*) FROM bloodbank) AS bloodBank_count,
                    (SELECT COUNT(*) FROM users) AS users_count;
                `,
                ['false']

            ).catch(err => {
                throw new BadRequestException(err);
            });

            let recentBloodRequests = await this.mysqlService.execute(`
            SELECT bloodRequests.*, users.userName
            FROM bloodRequests
            JOIN users ON bloodRequests.reqestedUser = users.userID
            ORDER BY bloodRequests.requestedDate DESC
            LIMIT 20;
            `)


            let recentUsers = await this.mysqlService.execute(`
            SELECT userID, userName, fullName, phone, district, fullAddress, bloodType, role, joinedOn 
            FROM users
            ORDER BY joinedOn DESC
            LIMIT 20;
          `).catch(err => {
                throw new BadRequestException(err);
            });

            let data = {
                recentBloodRequestscount: recentBloodRequestscount[0],
                recentBloodRequests: recentBloodRequests,
                recentUsers: recentUsers
            }

            return new SuccessResponse(data, "Dashboard data fetched successfully")
        } catch (error) {
            throw error
        }
    }


    async getAllUsers(): Promise<SuccessResponse | BadRequestException> {
        try {

            let a = await this.mysqlService.execute(`
            SELECT userID, userName, fullName, phone, district, fullAddress, bloodType, role, joinedOn 
            FROM users
            ORDER BY joinedOn DESC

            `)

            if (a.length == 0) return new SuccessResponse([], "No data");

            return new SuccessResponse(a, "Data fetched !")

        } catch (error) {
            throw error
        }
    }



    async getBloodRequest(): Promise<SuccessResponse | BadRequestException> {
        try {

            let a: [] = await this.mysqlService.execute(`
            SELECT bloodRequests.*, users.userName
            FROM bloodRequests
            JOIN users ON bloodRequests.reqestedUser = users.userID
            ORDER BY bloodRequests.requestedDate DESC
            `)

            if (a.length == 0) return new SuccessResponse([]);

            let arr = a.map((e: any) => {
                let requestedDate = new Date(e.requestedDate);
                let isExpired = requestedDate < new Date();
                return {
                    ...e,
                    isExpired: isExpired
                };
            });

            return new SuccessResponse(arr)
        } catch (error) {

        }
    }


    async getBloodBanks(): Promise<SuccessResponse | BadRequestException> {
        try {

            let a = await this.mysqlService.execute(`
            SELECT * FROM bloodbank
            `)

            return new SuccessResponse(a)
        } catch (error) {

        }
    }

    async addBloodBank(
        dto: AddBloodBankDTO,
        mode: "single" | "bulk",
        bulkdto: AddBulkBloodDTO[]
    ): Promise<SuccessResponse | BadRequestException> {
        try {
            if (mode === 'single') {
                if (!dto.BankName || !dto.Contact || !dto.District || !dto.Location) throw new BadRequestException("Invalid data")
                if (dto.Contact.length < 10 || dto.Contact.length > 10

                ) throw new BadRequestException("Invalid contact number")

                let a = await this.mysqlService.execute(`
                INSERT INTO bloodbank (bankName, bankLoaction, bankContact, bankDistrict) VALUES (?,?,?,?)
                `, [dto.BankName, dto.Location, dto.Contact, dto.District])
                if (a.affectedRows == 0) throw new BadRequestException("Failed to add blood bank")
                return new SuccessResponse("Blood bank added successfully")
            }

            if (mode === "bulk") {
                if (bulkdto.length == 0) throw new BadRequestException("Invalid data");

                bulkdto?.map(e => {
                    if (!e.BankName || !e.Contact || !e.District || !e.Location) throw new BadRequestException("Invalid data")
                    if (e.Contact.length < 10) throw new BadRequestException("Invalid contact number")
                })

                let successinserts = 0;
                let failedinserts = 0;
                for (let i = 0; i < bulkdto.length; i++) {
                    let e = bulkdto[i];
                    let a = await this.mysqlService.execute(`
                    INSERT INTO bloodbank (bankName, bankLoaction, bankContact, bankDistrict) VALUES (?,?,?,?)
                    `, [e.BankName, e.Location, e.Contact, e.District])
                    if (a.affectedRows == 0) failedinserts++
                    else successinserts++
                }

                return new SuccessResponse(`Bulk insert completed, ${successinserts} successfull, ${failedinserts} failed`)
            }

            throw new BadRequestException("Invalid mode")
        } catch (error) {
            if (error.code == "ER_DUP_ENTRY") throw new BadRequestException("Some data already exists in the database")
            throw error
        }
    }


}