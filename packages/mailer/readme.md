## @repo/mailer

This package provides a flexible and extendable email sending service
with support for: - Nodemailer transport - Templating via Handlebars -
Bulk sending with rate limiting - Template loading and management

### EmailService

- Send single or bulk emails
- Supports HTML templates and inline HTML
- Rate limiting for SMTP providers
- Template loading from file system or string
- Template listing and removal
- Transporter verification

### createSender

Creates and configures an `EmailService` instance using environment
variables.

Required environment variables:

    SMTP_HOST
    SMTP_PORT
    SMTP_SECURE
    SMTP_USER
    SMTP_PASS
    SMTP_FROM

### TemplateEngine

- Loads templates from directory or manually
- Renders Handlebars templates with passed data

### Usage

```ts
import { createSender } from "./email.sender";

async function main() {
  const sender = await createSender("./templates", 200);

  await sender.send({
    to: "someone@example.com",
    subject: "Hello!",
    template: "newsletter",
    data: { name: "John" },
  });
}

main();
```

### Bulk Sending

```ts
await sender.sendBulk([
  { to: "a@example.com", subject: "A", template: "newsletter" },
  { to: "b@example.com, c@example.com", subject: "B", template: "newsletter" },
]);
```

### Notes

- Ensure your SMTP credentials are correct.
- Use rate limiting for providers like Gmail or Outlook.
