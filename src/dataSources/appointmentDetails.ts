import { Config } from "../config";
import { AppointmentTypeDto } from "../dtos/appointmentType";
import { SurrealHttpDataSource } from "./surrealHttp";

export class AppointmentDetailsDataSource extends SurrealHttpDataSource {
    constructor(protected config: Config) {
        super(config);
    }

    async getAllAppointmentTypes() {
        const response = await this.query<AppointmentTypeDto[]>({
            query: `
                SELECT * FROM appointment_type
            `,
        });
        return response;
    }

    async getAppointmentTypeById(id: string) {
        console.log("Fetching appointment type by ID:", id);
        const response = await this.query<AppointmentTypeDto>({
            query: `
                SELECT * FROM ONLY $id
            `,
            params: { id }
        });
        return response;
    }
}