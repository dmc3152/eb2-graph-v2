import { RecordId } from "surrealdb"
import { CallingDto } from "./calling"

export type PermissionDto = {
    id: RecordId
    name: string
    callings: CallingDto[]
}