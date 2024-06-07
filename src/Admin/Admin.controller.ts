import { Body, Controller, Get, Put, Query, UseGuards } from "@nestjs/common";
import { AdminGaurd } from "src/gaurds/Auth.gaurd";
import { AdminService } from "./Admin.service";
import { MysqlPoolService } from "src/Utils/mysq.service";
import { AddBloodBankDTO, AddBulkBloodDTO } from "src/Auth/dto/Auth.dto";

@Controller("Admin")
export class AdminController {


    constructor(
        private readonly adminService: AdminService,
    ) { }


    @UseGuards(AdminGaurd)
    @Get("dashboard")
    async dashboard() {

        return this.adminService.dashboard()
    }


    @UseGuards(AdminGaurd)
    @Get("GetAllUsers")
    async getUsers() {
        return this.adminService.getAllUsers()
    }


    @UseGuards(AdminGaurd)
    @Get("GetAllRequests")
    async getAllRequest() {
        return this.adminService.getBloodRequest()
    }


    @UseGuards(AdminGaurd)
    @Get("GetAllBloodBanks")
    async getAllBloodBanks() {
        return this.adminService.getBloodBanks()
    }


    @UseGuards(AdminGaurd)
    @Put("AddBloodBank")
    async addBloodBank(
        @Query("mode") mode: "single" | "bulk",
        @Body() bloodBankDTO: AddBloodBankDTO,
        @Body() bulk: AddBulkBloodDTO[]

    ) {
        return this.adminService.addBloodBank(bloodBankDTO, mode, bulk)
    }


}