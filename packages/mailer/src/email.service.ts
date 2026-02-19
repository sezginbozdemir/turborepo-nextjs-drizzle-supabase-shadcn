import nodemailer, { Transporter } from "nodemailer";
import { TemplateEngine } from "./template.engine.js";
import type {
  EmailConfig,
  EmailData,
  EmailResult,
  BulkEmailResult,
} from "./types.js";
import { createLogger } from "@repo/shared/logger";

const logger = createLogger("email service");

export class EmailService {
  private transporter: Transporter;
  private templateEngine: TemplateEngine;
  private from: string;
  private rateLimitDelay: number;

  constructor(config: EmailConfig, rateLimitMs = 100) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    this.from = config.from;
    this.templateEngine = new TemplateEngine();
    this.rateLimitDelay = rateLimitMs;
    logger.info(
      `Transporter initialized with host:${config.host} port: ${config.port} secure: ${config.secure}`,
    );
  }

  // List available templates

  listAvailableTemplates(): string[] {
    return this.templateEngine.listAvailable();
  }

  // Load a template from string or file

  loadTemplate(name: string, html?: string): void {
    if (html) {
      this.templateEngine.load(name, html);
    } else {
      this.templateEngine.load(name);
    }
  }

  // Get list of loaded templates

  listLoadedTemplates(): string[] {
    return this.templateEngine.listLoaded();
  }

  // Check if a template is loaded

  hasTemplate(name: string): boolean {
    return this.templateEngine.hasTemplate(name);
  }

  // Remove a loaded template

  removeTemplate(name: string): boolean {
    return this.templateEngine.removeTemplate(name);
  }

  // Verify the email configuration

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info("Email configuration is ok.");
      return true;
    } catch (err: any) {
      logger.error("Email configuration verification failed:", err);
      return false;
    }
  }

  // Send a single mail to one or more recipients in one SMTP transaction

  async send(emailData: EmailData): Promise<EmailResult> {
    const { to, subject, template, html, data = {}, attachments } = emailData;

    // Validate email recipients

    if (!to || (Array.isArray(to) && to.length === 0)) {
      logger.error("No email recipient.");
      throw new Error("No email recipient.");
    }

    let emailHtml = html;

    // If template is specified, render it

    if (template) {
      logger.info(
        `Rendering email using template ${template} with data keys:[${Object.keys(data)}]`,
      );
      emailHtml = this.templateEngine.render(template, data);
    }

    if (!emailHtml) {
      logger.error("Either html content or template must be provided");
      throw new Error("Either html content or template must be provided");
    }

    // Nodemailer accepts a comma seperated string

    const recipients = Array.isArray(to) ? to.join(", ") : to;

    const mailOptions = {
      from: this.from,
      to: recipients,
      subject,
      html: emailHtml,
      attachments,
    };

    try {
      logger.info(`Sending email to: ${recipients}. Subject: ${subject}`);
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(
        `Email sent. accepted: ${info.accepted?.length ?? 0}, rejected: ${info.rejected?.length ?? 0}`,
      );

      return {
        recipients: recipients,
        accepted: info.accepted,
        rejected: info.rejected,
        pending: info.pending,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (err: any) {
      logger.error("Error while sedning mail:", err);
      throw new Error(`Error while sending mail: ${err} `);
    }
  }

  // Send multiple emails with rate limiting

  async sendBulk(emails: EmailData[]): Promise<BulkEmailResult> {
    logger.info(`Sending bulk emails. Count: ${emails.length}`);
    const results: EmailResult[] = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      logger.info(`Sending ${i + 1} / ${emails.length}`);

      try {
        const result = await this.send(email!);

        results.push(result);
        result.rejected.length === 0 ? successful++ : failed++;
      } catch (err: any) {
        failed++;
        logger.error(
          `Bulk email ${i + 1} / ${emails.length} failed while calling send():`,
          err,
        );
      }

      // Add delay between emails to respect rate limits (except for last email)
      if (i < emails.length - 1) {
        await this.delay(this.rateLimitDelay);
      }
    }
    logger.info(
      `Bulk send complete. total:${emails.length}, successful: ${successful}, failed: ${failed}`,
    );

    return {
      total: emails.length,
      successful,
      failed,
      results,
    };
  }

  // Set rate limit delay
  setRateLimit(delayMs: number): void {
    logger.info(`Setting rate limit delay to ${delayMs}ms`);
    this.rateLimitDelay = delayMs;
  }

  // Close the transporter connection
  close(): void {
    logger.info("Closing email transporter connection");
    this.transporter.close();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
