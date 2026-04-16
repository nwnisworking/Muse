<?php
namespace nwnisworking\Utils;

use function sprintf;

final class Logger{
  public const string LOGFILE = 'logs/app.log';

  public const string INFO = 'INFO';

  public const string ERROR = 'ERROR';

  public const string WARNING = 'WARNING';
  
  public static function log(string $message, string $level = self::INFO) : void{
    file_put_contents(self::LOGFILE, sprintf("[%s] %s: %s\n", date('Y-m-d H:i:s'), $level, $message), FILE_APPEND);
  }

  public static function clear() : void{
    file_put_contents(self::LOGFILE, '');
  }
}