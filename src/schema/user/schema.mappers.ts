import { CallingMapper } from "../calling/schema.mappers";
import { User } from "../types.generated";

export interface UserMapper extends Omit<User, "callings"> {
    callings: CallingMapper[];
}