export interface AppointmentTypeDto {
    id: string
    name: string
    description: string
    durationInMinutes: number
    interviewers: string[]
}