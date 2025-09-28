import { calendar_v3 } from "googleapis";
import { GoogleAuth } from "google-auth-library"
import { DateTime } from "luxon";
import { AppointmentDetails, AppointmentPayload, BishopricMember, TimeSlot } from "../schema/types.generated";
import { AvailabilityBlockMapper } from "../schema/calendarEvent/schema.mappers";

export type AvailabilityBlockTitle = "Bishop" | "Komatsu" | "Naidu";
export type PotentiallyAvailableTimeSlot = { start: DateTime, end: DateTime } | null;
export type CreateAppointmentDetails = Omit<AppointmentDetails, 'type'> & { type: string };

export class CalendarDataSource {
    private readonly availabilityCalendarId = '5d1585f3525e10a937b9acf88a75b88312ffeabf3c7b61cf57e91619e5c9b6e7@group.calendar.google.com';
    private readonly mainCalendarId = '4b68e59284f8946ded045174edfdb457c7c71624573deb307ba24192852c68aa@group.calendar.google.com';
    private readonly now = DateTime.now();
    private readonly availabilityPeriod = this.now.plus({ days: 21 });
    private readonly bishopricMemberMap: Record<BishopricMember, AvailabilityBlockTitle> = {
        BISHOP: "Bishop",
        FIRST_COUNSELOR: "Naidu",
        SECOND_COUNSELOR: "Komatsu"
    };

    constructor(
        private calendar: calendar_v3.Calendar,
        private auth: GoogleAuth
    ) { }

    async getAllAvailabilityBlocks(): Promise<AvailabilityBlockMapper[]> {
        const bishopricMembers = Object.values(this.bishopricMemberMap);

        try {
            const availabilityResponse = await this.calendar.events.list({
                calendarId: this.availabilityCalendarId,
                auth: this.auth,
                timeMin: this.now.toISO(),
                timeMax: this.availabilityPeriod.toISO(),
                orderBy: 'startTime',
                singleEvents: true
            });
            
            return availabilityResponse.data.items?.reduce((blocks: AvailabilityBlockMapper[], event) => {
                if (!bishopricMembers.some(member => event.summary?.toLowerCase().startsWith(member.toLowerCase()))) return blocks;
                blocks.push({
                    start: event.start?.dateTime || null,
                    end: event.end?.dateTime || null,
                    bishopricMember: Object.entries(this.bishopricMemberMap).find(([_, title]) => event.summary?.toLowerCase().startsWith(title.toLowerCase()))?.[0] as BishopricMember,
                    priorityDirection: event.description?.toLowerCase().includes("end") ? "DESC" : "ASC"
                });
                return blocks;
            }, []) || [];
        }
        catch (error) {
            console.error('Error fetching availability blocks:', error);
            return [];
        }
    }

    async getAvailabilityBlocks(bishopricMember: BishopricMember): Promise<AvailabilityBlockMapper[]> {
        try {
            const availabilityResponse = await this.calendar.events.list({
                calendarId: this.availabilityCalendarId,
                auth: this.auth,
                timeMin: this.now.toISO(),
                timeMax: this.availabilityPeriod.toISO(),
                orderBy: 'startTime',
                q: this.bishopricMemberMap[bishopricMember],
                singleEvents: true
            });
            return availabilityResponse.data.items?.reduce((blocks: AvailabilityBlockMapper[], block) => {
                if (!block.summary?.toLowerCase().startsWith(this.bishopricMemberMap[bishopricMember].toLowerCase())) return blocks;
                blocks.push({
                    start: block.start?.dateTime || null,
                    end: block.end?.dateTime || null,
                    bishopricMember: bishopricMember,
                    priorityDirection: block.description?.toLowerCase().includes("end") ? "DESC" : "ASC"
                });
                return blocks;
            }, []) || [];
        }
        catch (error) {
            console.error('Error fetching availability blocks:', error);
            return [];
        }
    }

    async getEventsInTimeRange(bishopricMember: BishopricMember, start: DateTime<true>, end: DateTime<true>) {
        try {
            const response = await this.calendar.events.list({
                calendarId: this.mainCalendarId,
                auth: this.auth,
                timeMin: start.toISO(),
                timeMax: end.toISO(),
                orderBy: 'startTime',
                q: this.bishopricMemberMap[bishopricMember],
                singleEvents: true
            });
            return response.data.items?.filter(event => event.summary?.toLowerCase().startsWith(this.bishopricMemberMap[bishopricMember].toLowerCase())) || [];
        }
        catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    async getAvailableTimeSlotForBlock(bishopricMember: BishopricMember, durationInMinutes: number, startTime: DateTime<true>, endTime: DateTime<true>, priorityDirection: "ASC" | "DESC"): Promise<(TimeSlot | null)> {
        const blockEvents = await this.getEventsInTimeRange(bishopricMember, startTime, endTime);

        const startingSlot = priorityDirection === "ASC"
            ? { start: startTime, end: startTime.plus({ minutes: durationInMinutes }) }
            : { start: endTime.minus({ minutes: durationInMinutes }), end: endTime };

        const availableSlot: PotentiallyAvailableTimeSlot = blockEvents
            .sort((a, b) => {
                const aStart = DateTime.fromISO(a.start?.dateTime || '');
                const bStart = DateTime.fromISO(b.start?.dateTime || '');
                return priorityDirection === 'ASC' ? aStart.toMillis() - bStart.toMillis() : bStart.toMillis() - aStart.toMillis();
            })
            .reduce((slot: PotentiallyAvailableTimeSlot, event) => {
                if (slot === null) return slot;
                if (!event.start?.dateTime || !event.end?.dateTime) return slot;

                const eventStart = DateTime.fromISO(event.start.dateTime);
                const eventEnd = DateTime.fromISO(event.end.dateTime);
                if (!eventStart.isValid || !eventEnd.isValid) return slot;

                // Check for overlap
                if (priorityDirection === "ASC") {
                    if (slot.start >= eventStart && slot.start <= eventEnd) {
                        slot.start = eventEnd;
                        slot.end = eventEnd.plus({ minutes: durationInMinutes });
                    }
                    else if (slot.end > eventStart && slot.end <= eventEnd) {
                        slot.start = eventEnd;
                        slot.end = eventEnd.plus({ minutes: durationInMinutes });
                    }
                }
                else {
                    if (slot.end >= eventStart && slot.end <= eventEnd) {
                        slot.end = eventStart;
                        slot.start = eventStart.minus({ minutes: durationInMinutes });
                    }
                    else if (slot.start >= eventStart && slot.start < eventEnd) {
                        slot.end = eventStart;
                        slot.start = eventStart.minus({ minutes: durationInMinutes });
                    }
                }

                if (slot.start >= slot.end || slot.end > endTime || slot.end <= startTime) {
                    return null; // No available slot
                }

                return slot;
            }, startingSlot);

        return availableSlot ? {
            start: availableSlot.start.toISO(),
            end: availableSlot.end.toISO()
        } : null;
    }

    async getAvailableTimeSlots(bishopricMember: BishopricMember, durationInMinutes: number): Promise<(TimeSlot | null)[]> {
        const blocks = await this.getAvailabilityBlocks(bishopricMember);

        const availableSlotsPromises = blocks.map(async (block) => {
            if (!block.start || !block.end) return null;

            const startTime = DateTime.fromISO(block.start);
            const endTime = DateTime.fromISO(block.end);
            if (!startTime.isValid || !endTime.isValid) return null;

            return this.getAvailableTimeSlotForBlock(bishopricMember, durationInMinutes, startTime, endTime, block.priorityDirection);
        });

        const availableSlots = await Promise.allSettled(availableSlotsPromises);
        return availableSlots.map(result => result.status === 'fulfilled' ? result.value : null);
    }

    async checkForConflicts(bishopricMember: BishopricMember, start: DateTime<true>, end: DateTime<true>) {
        const startWithPadding = start.minus({ hours: 2 });
        const endWithPadding = end.plus({ hours: 2 });
        const currentEvents = await this.getEventsInTimeRange(bishopricMember, startWithPadding, endWithPadding);
        if (!currentEvents.length) return false;

        return currentEvents.some(event => {
            if (!event.start?.dateTime || !event.end?.dateTime) return false;
            const eventStart = DateTime.fromISO(event.start.dateTime);
            const eventEnd = DateTime.fromISO(event.end.dateTime);
            const eventStartConflict = eventStart >= start && eventStart < end;
            const eventEndConflict = eventEnd <= end && eventEnd > start;
            return eventStartConflict || eventEndConflict;
        });
    }

    convertDateInputToDateTime = (date: string | Date) => {
        const datetime = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
        return datetime.isValid ? datetime : undefined;
    }

    async createAppointment(input: CreateAppointmentDetails): Promise<AppointmentPayload> {
        const startDateTime = this.convertDateInputToDateTime(input.timeSlot.start);
        const endDateTime = this.convertDateInputToDateTime(input.timeSlot.end);
        if (!startDateTime || !endDateTime) {
            return {
                success: false,
                timeSlot: null,
                bishopricMember: null,
                error: {
                    code: 'INVALID_TIME_SLOT',
                    message: 'The start or end time is invalid'
                }
            }
        }

        const hasConflict = await this.checkForConflicts(input.bishopricMember, startDateTime, endDateTime);
        if (hasConflict) {
            return {
                success: false,
                timeSlot: null,
                bishopricMember: null,
                error: {
                    code: 'APPOINTMENT_CONFLICT',
                    message: 'There is another appointment conflicting with this one. Appointment not set.'
                }
            }
        }

        try {
            const response = await this.calendar.events.insert({
                calendarId: this.mainCalendarId,
                auth: this.auth,
                requestBody: {
                    summary: `${this.bishopricMemberMap[input.bishopricMember]} - ${input.name} (${input.type})`,
                    description: input.description || '',
                    start: { dateTime: input.timeSlot.start, timeZone: 'UTC' },
                    end: { dateTime: input.timeSlot.end, timeZone: 'UTC' }
                }
            } as calendar_v3.Params$Resource$Events$Insert);
            return {
                success: true,
                timeSlot: {
                    start: response.data.start?.dateTime || '',
                    end: response.data.end?.dateTime || ''
                },
                bishopricMember: input.bishopricMember,
                error: null
            }

        }
        catch (error) {
            return {
                success: false,
                timeSlot: null,
                bishopricMember: null,
                error: {
                    code: "UNKNOWN_ERROR",
                    message: error instanceof Error ? error.message : 'Unknown error'
                }
            }
        }
    }
}