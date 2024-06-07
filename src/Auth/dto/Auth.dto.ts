export class SuccessResponse {
    constructor(data?: any, message?: string) {
        this.data = data;
        this.statusCode = 200;
        this.message = message;
    }

    data?: any;
    statusCode?: number;
    message?: string;

}


export interface LoginDTO {
    username: string;
    password: string;
}

export interface CreateUserDTO {
    userName: string;
    fullName: string;
    phone: string;
    district: string | any;
    fullAddress: string;
    bloodType: string;
    password: string;
}


export interface AddBloodBankDTO {
    BankName: string;
    Location: string;
    Contact: string;
    District: string;
}

export interface AddBulkBloodDTO {
    BankName: string;
    Location: string;
    Contact: string;
    District: string;
}[]

