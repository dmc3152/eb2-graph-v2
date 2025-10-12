import { TransportOptions } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { Config } from "../config";
import { EmailClient } from "../clients/email";

export class EmailerDataSource {
    constructor(private email: EmailClient, private config: Config) { }

    async sendEmail(mailOptions: Mail.Options & Partial<TransportOptions>) {
        mailOptions.from = `"EB2 Ward" <${this.config.email.user}>`
        try {
            const info = await this.email.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}