import { BadRequestException, Injectable } from "@nestjs/common";
import { MysqlPoolService } from "src/Utils/mysq.service";
import { reqDTO, RequestBloodDTO, SearchBloodDTO } from "./dto/Main.dto";
import { SuccessResponse } from "src/Auth/dto/Auth.dto";

@Injectable()
export class MainService {

    constructor(
        private readonly mysqlService: MysqlPoolService
    ) { }


    async RequestBlood(
        rb: RequestBloodDTO,
        req: reqDTO
    ): Promise<SuccessResponse | BadRequestException> {
        try {
            if (!rb.patientName || !rb.bloodGroup || !rb.District || !rb.Hospital || !rb.contactNumber || !rb.details) {
                throw new BadRequestException("Please provide all the required fields")
            }
            await this.mysqlService.execute(`
            INSERT INTO bloodRequests (patientName, bloodGroup, District, Hospital, contactNumber, details, reqestedUser,requestedDate)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
            `, [rb.patientName, rb.bloodGroup, rb.District, rb.Hospital, rb.contactNumber, rb.details, req.id, rb.requestedDate]
            ).catch((error) => {
                throw error
            })
            return new SuccessResponse("Request created successfully")
        } catch (error) {
            throw error
        }
    }

    async getBloodRequests(): Promise<SuccessResponse | BadRequestException> {
        try {
            // sort by requested date
            const requests = await this.mysqlService.execute(`
            SELECT patientName, bloodGroup, District, Hospital, contactNumber, details,requestedDate ,reqID
            FROM bloodRequests
            ORDER BY requestedDate ASC
        `).catch((error) => {
                throw error
            })
            return new SuccessResponse(requests, "Requests fetched successfully")
        } catch (error) {
            throw error
        }
    }

    async SearchBlood(
        sb: SearchBloodDTO
    ): Promise<SuccessResponse | BadRequestException> {
        try {
            if (!sb.bloodType || !sb.district) {
                throw new BadRequestException("Please provide all the required fields")
            }

            const requests = await this.mysqlService.execute(`
            SELECT fullName, phone,bloodType, district, fullAddress
            FROM users
            WHERE bloodType = ? AND district = ?
            `, [sb.bloodType, sb.district])

            if (requests.length === 0) throw new BadRequestException("No donors found")
            return new SuccessResponse(requests, "Donors fetched successfully")
        } catch (error) {
            throw error
        }
    }



}