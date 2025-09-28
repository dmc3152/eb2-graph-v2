import { AppointmentCode, AppointmentType } from "../schema/types.generated";

export class AppointmentDetailsDataSource {
    private appointmentTypeDictionary = new Map<AppointmentCode, AppointmentType>([
        ["BAPTISM", {
            code: "BAPTISM",
            name: "Baptism Interview",
            description: "This option is for children who need their baptismal interview with the bishop",
            durationInMinutes: 15,
            interviewers: ["BISHOP"],
        }],
        ["ECCLESIASTICAL_ENDORSEMENT", {
            code: "ECCLESIASTICAL_ENDORSEMENT",
            name: "Ecclesiastical Endorsement",
            description: "This option is for members who need an ecclesiastical endorsement for service missions, employment, or other purposes.",
            durationInMinutes: 30,
            interviewers: ["BISHOP"],
        }],
        ["MISSION", {
            code: "MISSION",
            name: "Mission Interview",
            description: "This option is for members preparing to serve full-time missions and need to meet with the bishop for their mission interview.",
            durationInMinutes: 45,
            interviewers: ["BISHOP"],
        }],
        ["OTHER", {
            code: "OTHER",
            name: "Other Appointment",
            description: "This option is for appointments that do not fit into the predefined categories. Please specify the purpose when scheduling.",
            durationInMinutes: 20,
            interviewers: ["BISHOP", "FIRST_COUNSELOR", "SECOND_COUNSELOR"],
        }],
        ["PATRIARCHAL_BLESSING", {
            code: "PATRIARCHAL_BLESSING",
            name: "Patriarchal Blessing Interview",
            description: "This option is for members who wish to receive a patriarchal blessing and need to meet with the bishop for the interview.",
            durationInMinutes: 30,
            interviewers: ["BISHOP"],
        }],
        ["PERSONAL_MATTER_LONG", {
            code: "PERSONAL_MATTER_LONG",
            name: "Personal Matter (30 Minutes)",
            description: "This option is for personal matters that require a longer discussion with the bishop.",
            durationInMinutes: 30,
            interviewers: ["BISHOP"],
        }],
        ["PERSONAL_MATTER_SHORT", {
            code: "PERSONAL_MATTER_SHORT",
            name: "Personal Matter (15 Minutes)",
            description: "This option is for personal matters that require a short discussion with the bishop.",
            durationInMinutes: 15,
            interviewers: ["BISHOP"],
        }],
        ["TEMPLE_RECOMMEND", {
            code: "TEMPLE_RECOMMEND",
            name: "Temple Recommend Interview",
            description: "This option is for members who need to obtain a temple recommend for the first time or renew if their recommend has been expired for over 1 year.",
            durationInMinutes: 20,
            interviewers: ["BISHOP"],
        }],
        ["TEMPLE_RECOMMEND_RENEWAL", {
            code: "TEMPLE_RECOMMEND_RENEWAL",
            name: "Temple Recommend Renewal Interview",
            description: "This option is for members who need to renew their temple recommend and it has been less than 1 year since their last recommend was issued.",
            durationInMinutes: 15,
            interviewers: ["BISHOP", "FIRST_COUNSELOR", "SECOND_COUNSELOR"],
        }],
        ["TEMPLE_WORKER", {
            code: "TEMPLE_WORKER",
            name: "Temple Worker Interview",
            description: "This option is for members who are applying to serve as temple workers and need to meet with the bishop for the interview.",
            durationInMinutes: 30,
            interviewers: ["BISHOP"],
        }],
        ["TITHING_DECLARATION", {
            code: "TITHING_DECLARATION",
            name: "Tithing Declaration",
            description: "This option is for members to declare their tithing status to the bishop.",
            durationInMinutes: 10,
            interviewers: ["BISHOP"],
        }],
    ]);

    getAllAppointmentTypes() {
        return Array.from(this.appointmentTypeDictionary.values());
    }

    getAppointmentTypeFromCode(type: AppointmentCode) {
        return this.appointmentTypeDictionary.get(type);
    }
}