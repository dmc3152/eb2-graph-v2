import { BishopricMember, PriorityDirection } from "../types.generated"

export interface AvailabilityBlockMapper {
  start: string | null
  end: string | null
  bishopricMember: BishopricMember
  priorityDirection: PriorityDirection
}