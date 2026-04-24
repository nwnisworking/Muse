<?php
namespace nwnisworking\HTTP;

/**
 * The Session class provides a simple interface for managing user sessions.
 */
final class Session{
  /**
   * A static property to track whether the session has been started.
   * @var bool
   */
  private static bool $started = false;

  /**
   * Constructor that initializes the session.
   */
  public function __construct(){
    $this->start();
  }

  /**
   * Set a value in the session.
   * @param string $key The key under which the value will be stored in the session.
   * @param mixed $value The value to be stored in the session.
   */
  public function set(string $key, mixed $value) : void{
    $this->start();
    $_SESSION[$key] = $value;
  }

  /**
   * Get a value from the session.
   * @param string $key The key of the value to retrieve from the session.
   * @return mixed The value associated with the specified key, or null if the key does not exist.
   */
  public function get(string $key) : mixed{
    $this->start();
    return $_SESSION[$key] ?? null;
  }

  /**
   * Check if a key exists in the session.
   * @param string $key The key to check for in the session.
   * @return bool True if the key exists, false otherwise.
   */

  public function has(string $key) : bool{
    $this->start();
    return isset($_SESSION[$key]);
  }

  /**
   * Remove a key from the session.
   * @param string $key The key to remove from the session.
   */
  public function remove(string $key) : void{
    $this->start();
    unset($_SESSION[$key]);
  }

  /**
   * Destroy the session and clear all session data.
   */
  public function destroy() : void{
    $this->start();
    session_destroy();
    self::$started = false;
  }

  /**
   * Regenerate the session ID to prevent session fixation attacks.
   * @param bool $deleteOldSession Whether to delete the old session data. Defaults to true.
   */
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

  /**
   * Start the session if it has not already been started.
   */
  public function start() : void{
    if(self::$started === false){
      $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

      session_start([
        'cookie_httponly' => true,
        'cookie_secure' => $secure,
        'cookie_samesite' => 'Strict'
      ]);

      $_SESSION['_ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
      $_SESSION['_ua'] = $_SERVER['HTTP_USER_AGENT'] ?? '';

      self::$started = true;
    }
  }
}