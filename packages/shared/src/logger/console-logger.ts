import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

import {
  LogContext,
  LogLevel,
  LOG_LEVELS,
  LogEntry,
  LoggerConfig,
  TimerData,
} from "./logger.interface.js";
import { env } from "../env.js";

class ConsoleLogger {
  // A label indicating where this logger is used ( service name, module name, etc. )
  private source: string;
  // Config for logging behavior
  private config: LoggerConfig;
  // Timer for performance measurement
  private timers: Map<string, TimerData>;

  // ANSI escape codes for coloring output by log level

  private readonly colors = {
    debug: "\x1b[36m", // cyan
    info: "\x1b[34m", // blue
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    reset: "\x1b[0m",
  };

  constructor(source: string, config?: Partial<LoggerConfig>) {
    this.source = source;
    this.timers = new Map();

    // Default Config

    const min =
      env.NODE_ENV === "production"
        ? "warn"
        : env.NODE_ENV === "test"
          ? "error"
          : "debug";

    this.config = {
      minLevel: min,
      enableConsole: true,
      enableFile: false,
      logDir: "logs",
      maxSizeMB: 10,
      maxFiles: 30,
      ...config, // allow caller to override
    };
  }

  // Helpers

  private getTime(): string {
    return new Date()
      .toISOString()
      .split("T")[1]!
      .replace("Z", "")
      .replace(/[:.]/g, "-");
  }
  private getDate(): string {
    return new Date().toISOString().split("T")[0]!;
  }
  private sanitizeContext(context: LogContext | undefined): string {
    return context && Object.keys(context).length > 0
      ? ` | ${Object.entries(context)
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")}`
      : "";
  }

  // Core logging method

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // Skip if requested level is below the conif minLevel
    if (LOG_LEVELS[level] < LOG_LEVELS[this.config.minLevel]) {
      return;
    }

    const timestamp = this.getTime();
    const source = this.source.toUpperCase();
    const mergedContext =
      this.config.context || context
        ? { ...(this.config.context ?? {}), ...(context ?? {}) }
        : undefined;
    const entry: LogEntry = {
      timestamp,
      source,
      message,
      context: mergedContext,
    };

    if (this.config.enableConsole) this.writeToConsole(level, entry);
    if (this.config.enableFile) this.writeToFile(entry);
  }

  private writeToConsole(level: LogLevel, entry: LogEntry): void {
    const { timestamp, source, message, context } = entry;
    const color = this.colors[level];
    const reset = this.colors.reset;

    let prefix = `${color} [${timestamp}] [${source}] [${level.toUpperCase()}] ${reset}`;

    let consoleMethod: (...data: any[]) => void;

    switch (level) {
      case "debug":
        consoleMethod = console.debug;
        break;
      case "info":
        consoleMethod = console.info;
        break;
      case "warn":
        consoleMethod = console.warn;
        break;
      case "error":
        consoleMethod = console.error;
        break;
      default:
        consoleMethod = console.log;
    }

    if (context && Object.keys(context).length > 0) {
      consoleMethod(`${prefix} ${message}`, context);
    } else {
      consoleMethod(`${prefix} ${message}`);
    }
  }

  private ensureLogDir(): void {
    if (!fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const date = this.getDate();
    const source = this.source.replace(/\s+/g, "-").toLowerCase();
    return path.join(this.config.logDir!, `${source}-${date}.log`);
  }

  private writeToFile(entry: LogEntry): void {
    const logFile = this.getLogFileName();
    const time = entry.timestamp;
    const context = this.sanitizeContext(entry.context);
    const logLine = `[${time}] [${entry.source.toUpperCase()}] ${entry.message}${context}\n`;

    try {
      this.ensureLogDir();
      // Check if we need to rotate
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        const fileSizeMB = stats.size / (1024 * 1024);

        if (fileSizeMB >= this.config.maxSizeMB) {
          this.rotateLogFile(logFile);
        }
      }

      fs.appendFileSync(logFile, logLine, "utf8");
    } catch (error) {
      console.error("Failed to write log file:", error);
    }
  }

  // Rotate the current log file by renaming it with a timestamp suffix
  // then trigger cleanup older logs

  private rotateLogFile(logFile: string): void {
    const time = this.getTime();
    const rotatedFile = logFile.replace(".log", `-${time}.log`);

    try {
      fs.renameSync(logFile, rotatedFile);
      this.cleanupOldLogs();
    } catch (error) {
      console.error("Failed to rotate log file:", error);
    }
  }
  private cleanupOldLogs(): void {
    try {
      const logFiles = fs
        .readdirSync(this.config.logDir)
        .filter(
          (file) =>
            file.startsWith(this.source.replace(/\s+/g, "-").toLowerCase()) &&
            file.endsWith(".log"),
        )
        .map((file) => ({
          name: file,
          path: path.join(this.config.logDir, file),
          mtime: fs.statSync(path.join(this.config.logDir, file)).mtime,
        }))
        // Newest first
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      if (logFiles.length > this.config.maxFiles) {
        const filesToDelete = logFiles.slice(this.config.maxFiles);
        filesToDelete.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error(`Failed to delete log file ${file.name}:`, error);
          }
        });
      }
    } catch (error) {
      console.error("Failed to cleanup old logs:", { err: error });
    }
  }

  public setContext(context: LogContext): void {
    this.config.context = { ...this.config.context, ...context };
  }
  public clearContext(): void {
    this.config.context = undefined;
  }

  // Log messages depending on level

  public debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }
  public info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }
  public warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }
  public error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  // Start a timer for performance tracking

  public startTimer(label: string): void {
    this.timers.set(label, {
      start: performance.now(),
      label,
    });
    this.debug(`Timer started: ${label}`);
  }

  // End a timer and log the duration

  public endTimer(label: string): number | null {
    const timer = this.timers.get(label);
    if (!timer) {
      this.warn(`Timer not found: ${label}`);
      return null;
    }

    const end = performance.now();
    const duration = end - timer.start;

    this.timers.delete(label);
    this.debug(`Timer ended: ${label} (${duration.toFixed(2)}ms)`);

    return duration;
  }
}

export function createLogger(
  source: string,
  config?: Partial<LoggerConfig>,
): ConsoleLogger {
  return new ConsoleLogger(source, config);
}
