<?php
namespace nwnisworking\HTTP;

final class Session{
  private static $started = false;

  public function __construct(){
    $this->start();
  }

  public function set(string $key, mixed $value) : void{
    $this->start();
    $_SESSION[$key] = $value;
  }

  public function get(string $key) : mixed{
    $this->start();
    return $_SESSION[$key] ?? null;
  }

  public function has(string $key) : bool{
    $this->start();
    return isset($_SESSION[$key]);
  }

  public function remove(string $key) : void{
    $this->start();
    unset($_SESSION[$key]);
  }

  public function destroy() : void{
    $this->start();
    session_destroy();
    self::$started = false;
  }

  public function regenerate(bool $deleteOldSession = true) : void{
    $this->start();

    if(!empty($_SESSION['_regenerated'])){
      return;
    }

    $_SESSION['_regenerated'] = time();

    session_regenerate_id($deleteOldSession);

    $_SESSION['_ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
    $_SESSION['_ua'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
  }

  public function start() : void{
    if(self::$started === false){
      session_start([
        'cookie_httponly' => true,
        'cookie_secure' => true,
        'cookie_samesite' => 'Strict'
      ]);

      $_SESSION['_ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
      $_SESSION['_ua'] = $_SERVER['HTTP_USER_AGENT'] ?? '';

      self::$started = true;
    }
  }
}