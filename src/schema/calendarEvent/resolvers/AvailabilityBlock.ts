import { DateTime } from 'luxon';
import { RequestContext } from '../../../context';
import type { AvailabilityBlockResolvers } from './../../types.generated';

export const AvailabilityBlock: AvailabilityBlockResolvers = {
  availableSlot: async (_parent, _arg, _ctx: RequestContext) => {
    if (!_parent.start || !_parent.end) return null;

    const startTime = DateTime.fromISO(_parent.start);
    const endTime = DateTime.fromISO(_parent.end);
    if (!startTime.isValid || !endTime.isValid) return null;

    const availableTimeSlot = await _ctx.calendarDataSource.getAvailableTimeSlotForBlock(
      _parent.bishopricMember,
      _arg.durationInMinutes,
      startTime,
      endTime,
      _parent.priorityDirection
    );

    return availableTimeSlot;
  },
};