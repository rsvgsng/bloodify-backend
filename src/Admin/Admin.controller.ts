import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminGaurd } from "src/gaurds/Auth.gaurd";
import { AdminService } from "./Admin.service";
import { MysqlPoolService } from "src/Utils/mysq.service";

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



}