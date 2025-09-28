export interface CalendarEventDto {
    kind: string
    etag: string
    id: string
    status: "confirmed" | "tentative" | "cancelled"
    htmlLink: string
    created: string     // "2025-09-18T03:37:43.559Z"
    updated: string     // "2025-09-18T03:37:43.959Z"
    summary: string
    creator: {
        email: string
    }
    organizer: {
        email: string
        displayName: string
        self: boolean
    }
    start: {
        dateTime: string    // "2025-09-28T12:15:00-10:00"
        timeZone: string    //"Pacific/Honolulu"
    }
    end: {
        dateTime: string    // "2025-09-28T12:45:00-10:00"
        timeZone: string    // "Pacific/Honolulu"
    }
    iCalUID: string
    sequence: number
    reminders: {
        useDefault: boolean
    }
    eventType: "birthday" | "default" | "focusTime" | "fromGmail" | "outOfOffice" | "workingLocation"
}