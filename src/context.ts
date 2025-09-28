import { calendar_v3 } from "googleapis"
import { CalendarDataSource } from "./dataSources/calendar"
import { GoogleAuth } from "google-auth-library"
import { AppointmentDetailsDataSource } from "./dataSources/appointmentDetails"

export interface RequestContext {
    appointmentDetailsDataSource: AppointmentDetailsDataSource
    calendarDataSource: CalendarDataSource
}

export const buildContext = (calendar: calendar_v3.Calendar, auth: GoogleAuth) => async (): Promise<RequestContext> => {
    return {
        appointmentDetailsDataSource: new AppointmentDetailsDataSource(),
        calendarDataSource: new CalendarDataSource(calendar, auth)
    }
}