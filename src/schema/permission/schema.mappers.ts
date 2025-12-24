import { CallingMapper } from "../calling/schema.mappers";
import { Permission, PermissionAssociateCallingsPayload, PermissionPayload } from "../types.generated";

export interface PermissionMapper extends Omit<Permission, "callings"> {
    callings: CallingMapper[];
}

export interface PermissionPayloadMapper extends Omit<PermissionPayload, "permission"> {
    permission: PermissionMapper | null;
}

export interface PermissionAssociateCallingsPayloadMapper extends Omit<PermissionAssociateCallingsPayload, "callings"> {
    callings: CallingMapper[];
}