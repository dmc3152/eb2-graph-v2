import { StringRecordId } from "surrealdb";
import { SurrealUserClient } from "../clients/surrealUser";
import { AppointmentTypeDto } from "../dtos/appointmentType";

export class AppointmentDetailsDataSource {
    constructor(private surreal: SurrealUserClient) { }

    async getAllAppointmentTypes() {
        const [response] = await this.surreal.query<[AppointmentTypeDto[]]>({
            query: `
                SELECT * FROM appointment_type
            `,
        });
        return response;
    }

    async getAppointmentTypeById(id: string) {
        const [response] = await this.surreal.query<[AppointmentTypeDto]>({
            query: `
                SELECT * FROM ONLY $id
            `,
            params: { id: new StringRecordId(id) },
        });
        return response;
    }
}