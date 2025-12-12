/**
 * Structured logging utility
 * Provides consistent logging across the application
 */

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    userId?: string;
    requestId?: string;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    private formatLog(entry: LogEntry): string {
        const { timestamp, level, message, context, userId, requestId } = entry;
        let log = `[${timestamp}] [${level}]`;

        if (requestId) log += ` [${requestId}]`;
        if (userId) log += ` [User: ${userId}]`;
        log += ` ${message}`;

        if (context && Object.keys(context).length > 0) {
            log += ` ${JSON.stringify(context)}`;
        }

        return log;
    }

    private log(level: LogLevel, message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            userId,
            requestId
        };

        const formattedLog = this.formatLog(entry);

        // In production, you might want to send logs to a service like Datadog, Sentry, etc.
        switch (level) {
            case LogLevel.DEBUG:
                if (this.isDevelopment) {
                    console.debug(formattedLog);
                }
                break;
            case LogLevel.INFO:
                console.log(formattedLog);
                break;
            case LogLevel.WARN:
                console.warn(formattedLog);
                break;
            case LogLevel.ERROR:
                console.error(formattedLog);
                break;
        }
    }

    debug(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
        this.log(LogLevel.DEBUG, message, context, userId, requestId);
    }

    info(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
        this.log(LogLevel.INFO, message, context, userId, requestId);
    }

    warn(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
        this.log(LogLevel.WARN, message, context, userId, requestId);
    }

    error(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
        this.log(LogLevel.ERROR, message, context, userId, requestId);
    }

    // API request logging
    apiRequest(method: string, path: string, userId?: string, requestId?: string) {
        this.info(`API Request: ${method} ${path}`, undefined, userId, requestId);
    }

    apiResponse(method: string, path: string, status: number, duration: number, userId?: string, requestId?: string) {
        this.info(`API Response: ${method} ${path} - ${status} (${duration}ms)`, undefined, userId, requestId);
    }

    apiError(method: string, path: string, error: Error, userId?: string, requestId?: string) {
        this.error(`API Error: ${method} ${path}`, { error: error.message, stack: error.stack }, userId, requestId);
    }
}

// Singleton instance
const logger = new Logger();

export default logger;
