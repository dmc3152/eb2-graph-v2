
import type { QueryResolvers } from './../../../types.generated';
export const user: NonNullable<QueryResolvers['user']> = async (_parent, _arg, _ctx) => {
  const events = await _ctx.calendarDataSource.searchEvents();
  console.log('Fetched events in user resolver:', events);
  return { id: '001', firstName: 'Bart', lastName: 'Simpson', isAdmin: 'YES' }
};