import { BadRequestException, Injectable } from "@nestjs/common";
import { SuccessResponse } from "src/Auth/dto/Auth.dto";
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


}