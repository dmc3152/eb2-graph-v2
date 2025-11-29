import { RecordId } from "surrealdb"
import { CallingDto } from "./calling"

export type UserDto = {
    id: RecordId
    email: string
    first_name: string
    last_name: string
    is_email_verified: boolean
    is_site_admin: boolean
    callings: CallingDto[]
}