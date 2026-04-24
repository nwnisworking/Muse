<?php
namespace nwnisworking\Utils;

use function sprintf;

/**
 * Logger class provides a simple logging mechanism to log messages. 
 * It supports three log levels: INFO, ERROR, and WARNING.
 * Logs are written to a specified log file with timestamps and log levels for traceability.
 */
final class Logger{
  /**
   * Log level for informational messages. This indicates general information about the application's operation, such as startup, shutdown, or routine events.
   * @var string
   */
  public const string INFO = 'INFO';

  /**
   * Log level for error messages. This indicates critical issues that may cause the application to malfunction or crash, such as exceptions, failed operations, or system errors.
   * @var string
   */
  public const string ERROR = 'ERROR';

  /**
   * Log level for warning messages. This indicates potential issues that are not critical but may require attention, such as deprecated features, performance issues, or unexpected behavior.
   * @var string
   */
  public const string WARNING = 'WARNING';

  /**
   * The file path where logs will be written.
   * @var string
   */
  private string $logFile;

  /**
   * Constructor to initialize the logger with a specified log file.
   * @param string $logFile The path to the log file where messages will be written.
   */
  public function __construct(string $logFile = 'logs/app.log'){
    $this->logFile = $logFile;
  }

  /**
   * Logs a message to the log file with a specified log level.
   * @param string $message The message to be logged.
   * @param string $level The log level for the message (INFO, ERROR, WARNING). Defaults to INFO if not specified.
   */
  public function log(string $message, string $level = self::INFO) : void{
    file_put_contents($this->logFile, sprintf("[%s] %s: %s\n", date('Y-m-d H:i:s'), $level, $message), FILE_APPEND);
  }

  /**
   * Clears the log file.
   * @return void
   */
  public function clear() : void{
    file_put_contents($this->logFile, '');
  }
}