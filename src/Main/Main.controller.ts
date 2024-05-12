import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { MainService } from "./Main.service";
import { reqDTO, RequestBloodDTO, SearchBloodDTO } from "./dto/Main.dto";
import { AuthGuard } from "src/gaurds/Auth.gaurd";

@Controller("Main")
export class MainController {

    constructor(
        private readonly mainService: MainService
    ) { }


    @UseGuards(AuthGuard)
    @Put("RequestBlood")
    public async RequestBlood(
        @Body() rb: RequestBloodDTO,
        @Req() req: reqDTO
    ) {
        return this.mainService.RequestBlood(rb, req)
    }

    @UseGuards(AuthGuard)
    @Get("getBloodRequests")
    public async getBloodRequests(

    ) {
        return this.mainService.getBloodRequests()
    }


    @UseGuards(AuthGuard)
    @Put("SearchBlood")
    public async SearchBlood(
        @Body() sb: SearchBloodDTO
    ) {
        return this.mainService.SearchBlood(sb)
    }
}