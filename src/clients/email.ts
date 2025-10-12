import { createTransport } from "nodemailer";
import { Config } from "../config";

export class EmailClient {
    private transporter;

    constructor(private config: Config) {
        this.transporter = createTransport({
          host: this.config.email.host,
          port: 465,
          secure: true,
          auth: {
            user: this.config.email.user,
            pass: this.config.email.password
          }
        });
    }

    async sendMail(...args: Parameters<typeof this.transporter.sendMail>) {
        await this.transporter.verify();
        return this.transporter.sendMail(...args);
    }
}