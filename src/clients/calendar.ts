import { calendar_v3, google } from "googleapis";
import { GoogleAuth, AuthClient } from 'google-auth-library';

export class CalendarClient {
    private calendar: calendar_v3.Calendar;
    private auth: GoogleAuth<AuthClient>;

    constructor() {
        this.calendar = google.calendar('v3');
        this.auth = new google.auth.GoogleAuth({
            keyFile: './ewa-beach-2nd-ward-93dea61e9eab.json',
            scopes: [
                'https://www.googleapis.com/auth/calendar'
            ],
        });
    }

    async getEvents(params?: calendar_v3.Params$Resource$Events$List) {
        return this.calendar.events.list({
            ...params,
            auth: this.auth
        });
    }

    async createEvent(params?: calendar_v3.Params$Resource$Events$Insert) {
        return this.calendar.events.insert({
            ...params,
            auth: this.auth,
        });
    }
}