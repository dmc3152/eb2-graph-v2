import { PriorityDirection } from "../types.generated"

export interface AvailabilityBlockMapper {
  start: string | null
  end: string | null
  bishopricMember: string | null
  priorityDirection: PriorityDirection
}