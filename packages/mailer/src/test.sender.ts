import { createLogger } from "@repo/shared/logger";
import { createSender } from "./email.sender";

const logger = createLogger("ethereal tester");

async function testSender() {
  const sender = await createSender();

  // Load a test template
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
  sender.listAvailableTemplates();

  // Test single email
  logger.info("Testing single email...");
  const singleResult: any = await sender.send({
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

      // articles list: {{#each articles}} ... {{/each}}
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

      // product updates section: {{#if hasUpdates}} ... {{/if}}
      hasUpdates: true,
      updates: [
        "New: Team members can now be assigned different roles and permissions.",
        "Improved: Faster load times on the dashboard and reports pages.",
        "Fixed: Occasional logout issues when switching between multiple accounts.",
      ],

      // CTA links at bottom
      dashboardUrl: "https://app.example.com/dashboard",
      unsubscribeUrl: "https://app.example.com/unsubscribe?user=123",
      preferencesUrl: "https://app.example.com/preferences?user=123",
    },
  });
  // Test bulk emails
  logger.info("Testing bulk emails...");
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

  const bulkResult: any = await sender.sendBulk(bulkEmails);
  logger.info("All done.");
  logger.info("Single email result:", singleResult);
  logger.info("Bulk email result:", bulkResult);

  sender.close();
}

testSender().catch(console.error);
