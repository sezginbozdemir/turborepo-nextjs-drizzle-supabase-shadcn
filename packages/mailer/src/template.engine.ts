import Handlebars from "handlebars";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, extname, basename } from "path";
import type { TemplateData } from "./types.js";
import { createLogger } from "@repo/shared/logger";

/**
 * TemplateEngine
 *
 * It lists templates available in a directory
 * load tempaltes from directory or from raw html
 * render templates for the sender
 *
 */

const logger = createLogger("template engine");

export class TemplateEngine {
  private templates = new Map<string, HandlebarsTemplateDelegate>();
  private templateDir: string;

  constructor() {
    this.templateDir = join(__dirname, "templates");
    this.registerHelpers();
  }

  private registerHelpers() {
    // Register common Handlebars helpers
    Handlebars.registerHelper("eq", (a, b) => a === b);
    Handlebars.registerHelper("ne", (a, b) => a !== b);
    Handlebars.registerHelper("gt", (a, b) => a > b);
    Handlebars.registerHelper("lt", (a, b) => a < b);
    Handlebars.registerHelper("formatDate", (date) => {
      return new Date(date).toLocaleDateString();
    });
    Handlebars.registerHelper("capitalize", (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    logger.info("Registered common helpers.");
  }

  // List available template names on this.templateDir
  // picks only `.hbs` files and returns their basenames.

  listAvailable(): string[] {
    const files = readdirSync(this.templateDir);
    logger.info(`Listing available templates in ${this.templateDir}...`);
    return files
      .filter((file) => extname(file) === ".hbs")
      .map((file) => basename(file, ".hbs"));
  }

  load(name: string, html?: string): void {
    if (html) {
      // Load template from string
      logger.info(`Loading template from html... Template name: ${name}`);
      try {
        const template = Handlebars.compile(html);
        this.templates.set(name, template);
        logger.info(`Template ${name} loaded succesfully.`);
      } catch (err: any) {
        logger.error(`Failed to load template "${name}"`, err);
        throw new Error(`Failed to load template "${name}": ${err}`);
      }
    } else {
      // Load template from file
      logger.info(`Loading template from directory... Tempalte name: ${name}`);
      try {
        const templatePath = join(this.templateDir, `${name}.hbs`);

        logger.info(`path: ${templatePath}`);

        if (!existsSync(templatePath)) {
          logger.error(`Template file not found at: ${templatePath}`);
          throw new Error(`Template file not found at: ${templatePath}`);
        }
        const templateContent = readFileSync(templatePath, "utf-8");
        const template = Handlebars.compile(templateContent);
        this.templates.set(name, template);
      } catch (err: any) {
        logger.error(`Failed to load template "${name}": ${err}`);
        throw new Error(`Failed to load template "${name}": ${err}`);
      }
    }
  }

  // Render the template for sender

  render(templateName: string, data: TemplateData = {}): string {
    const template = this.templates.get(templateName);
    if (!template) {
      logger.warn(
        `Template "${templateName}" not found. Make sure to load it first.`,
      );
      throw new Error(
        `Template "${templateName}" not found. Make sure to load it first.`,
      );
    }

    return template(data);
  }

  hasTemplate(name: string): boolean {
    return this.templates.has(name);
  }

  removeTemplate(name: string): boolean {
    return this.templates.delete(name);
  }

  listLoaded(): string[] {
    return Array.from(this.templates.keys());
  }
}
