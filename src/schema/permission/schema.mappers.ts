import { CallingMapper } from "../calling/schema.mappers";
import { Permission } from "../types.generated";

export interface PermissionMapper extends Omit<Permission, "callings"> {
    callings: CallingMapper[];
}
