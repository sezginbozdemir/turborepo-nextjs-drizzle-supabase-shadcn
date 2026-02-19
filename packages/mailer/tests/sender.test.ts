import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createSender } from "src/email.sender.js";
import { createTestAccount } from "nodemailer";
import { BulkEmailResult, EmailConfig, EmailResult } from "src/types.js";
import { EmailService } from "src/email.service.js";

describe("email sender", () => {
  let sender: EmailService;

  beforeAll(async () => {
    const account = await createTestAccount();
    const config: EmailConfig = {
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
      from: "Test <test@example.com>",
    };

    sender = await createSender(config);
  });

  afterAll(() => {
    sender.close();
  });

  it("lists available templates", () => {
    const templates = sender.listAvailableTemplates();
    expect(templates).toContain("newsletter");
  });

  it("load templates manually or from available templates", () => {
    sender.loadTemplate(
      "test",
      `
        <h1>Hello {{name}}!</h1>
        <p>This is a test email sent on {{formatDate date}}.</p>
        <p>You have {{messageCount}} messages.</p>
        {{#if isPremium}}
          <p style="color: gold;">⭐ Premium User ⭐</p>
        {{/if}}
        `,
    );

    sender.loadTemplate("newsletter");

    const loaded = sender.listLoadedTemplates();

    expect(loaded).toContain("test");
    expect(loaded).toContain("newsletter");
  });

  it("sends single email", async () => {
    const singleResult: EmailResult = await sender.send({
      to: "recipient@test.com",
      subject: "Weekly Product Newsletter",
      template: "newsletter",
      data: {
        name: "john doe",
        subject: "Weekly Product Newsletter",
        date: new Date(),
        title: "Your Weekly Product Digest",
        subtitle: "New features, tips, and updates from our team",
        intro:
          "Here's a quick overview of what's new and what you might have missed this week.",
        articles: [
          {
            title: "Introducing Advanced Analytics",
            excerpt:
              "Track engagement, conversion, and retention with our new analytics dashboard. Get deeper insights into how users interact with your product.",
            url: "https://example.com/blog/advanced-analytics",
          },
          {
            title: "5 Tips to Improve Onboarding",
            excerpt:
              "A smooth onboarding experience can dramatically improve activation and retention. Here are 5 practical tips to optimize your flow.",
            url: "https://example.com/blog/onboarding-tips",
          },
          {
            title: "Security Best Practices for Your Team",
            excerpt:
              "Learn how to keep your data and your customers safe with these essential security best practices.",
            url: "https://example.com/blog/security-best-practices",
          },
        ],
        hasUpdates: true,
        updates: [
          "New: Team members can now be assigned different roles and permissions.",
          "Improved: Faster load times on the dashboard and reports pages.",
          "Fixed: Occasional logout issues when switching between multiple accounts.",
        ],
        dashboardUrl: "https://app.example.com/dashboard",
        unsubscribeUrl: "https://app.example.com/unsubscribe?user=123",
        preferencesUrl: "https://app.example.com/preferences?user=123",
      },
    });
    const status = Number(singleResult.response.slice(0, 3));
    expect(singleResult).toBeTruthy();
    expect(singleResult.messageId).toBeTruthy();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
  });

  it("sends bulk emails", async () => {
    const bulkEmails = [
      {
        to: "user1@test.com",
        subject: "Bulk Test 1",
        template: "test",
        data: {
          name: "User 1",
          date: new Date(),
          messageCount: 3,
          isPremium: false,
        },
      },
      {
        to: "user2@test.com",
        subject: "Bulk Test 2",
        template: "test",
        data: {
          name: "User 2",
          date: new Date(),
          messageCount: 8,
          isPremium: true,
        },
      },
      {
        to: "user3@test.com, user3@test.com, user5@test.com, user4@test.com",
        subject: "Bulk Test 3",
        html: "<h1>Direct HTML Email</h1><p>No template used here.</p>",
      },
    ];

    const bulkResult: BulkEmailResult = await sender.sendBulk(bulkEmails);

    expect(bulkResult).toBeTruthy();
    expect(bulkResult.failed).toBe(0);
  });
});
