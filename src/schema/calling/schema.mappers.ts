import { Calling } from "../types.generated";

export interface CallingMapper extends Omit<Calling, "assignedTo"> {}