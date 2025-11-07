type LogLevel = "log" | "info" | "warn" | "error" | "debug";

class Logger {
  private logs: string[] = [];

  private levelOrder: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    log: 2,
    debug: 3,
  };

  private currentLevel: LogLevel = "info";

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelOrder[level] <= this.levelOrder[this.currentLevel];
  }

  private colorize(level: LogLevel, message: string): string {
    const colors: Record<LogLevel, string> = {
      error: "\x1b[31m", // red
      warn: "\x1b[33m",  // yellow
      info: "\x1b[32m",  // green
      log: "\x1b[37m",   // white
      debug: "\x1b[36m", // cyan
    };
    const reset = "\x1b[0m";
    return `${colors[level]}${message}${reset}`;
  }

  private logMessage(level: LogLevel, message: string, error?: unknown) {
    if (!this.shouldLog(level)) return;

    const timestamp = this.getTimestamp();
    const fullMessage =
      `[${timestamp}] [${level.toUpperCase()}] ${message}` +
      (error instanceof Error ? `\n${error.stack}` : "");

    this.logs.push(fullMessage);
    console.log(this.colorize(level, fullMessage));
  }

  public log(msg: string) {
    this.logMessage("log", msg);
  }

  public info(msg: string) {
    this.logMessage("info", msg);
  }

  public warn(msg: string) {
    this.logMessage("warn", msg);
  }

  public error(msg: string, err?: unknown) {
    this.logMessage("error", msg, err);
  }

  public debug(msg: string) {
    this.logMessage("debug", msg);
  }

  public getLogs(): string[] {
    return this.logs;
  }

  public clear() {
    this.logs = [];
  }
}

export const logger = new Logger();
