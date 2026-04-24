<?php
namespace nwnisworking\HTTP;

/**
 * The Response class is responsible for managing HTTP responses.
 */
final class Response{
  /**
   * Sets the HTTP status code for the response.
   * @param int $status The HTTP status code to set for the response.
   */
  public function setStatus(int $status) : void{
    http_response_code($status);
  }

  /**
   * Retrieves the current HTTP status code of the response.
   * @return int The current HTTP status code of the response.
   */
  public function getStatus() : int{
    return http_response_code();
  }

  /**
   * Appends a header to the response without replacing any existing headers with the same key.
   * @param string $key The name of the header to append.
   * @param string $value The value of the header to append.
   */
  public function append(string $key, string $value) : void{
    header("$key: $value");
  }

  /**
   * Sets a header for the response, replacing any existing header with the same key.
   * @param string $key The name of the header to set.
   * @param string $value The value of the header to set.
   */
  public function set(string $key, string $value) : void{
    header("$key: $value", true);
  }

  /**
   * Sets a cookie in the response with the specified parameters.
   * @param string $name The name of the cookie to set.
   * @param string $value The value of the cookie to set.
   * @param int $expires The expiration time of the cookie as a Unix timestamp. Default is 0 (session cookie).
   * @param bool $httpOnly Whether the cookie should be accessible only through HTTP(S) and not by JavaScript. Default is true.
   * @param string $path The path on the server where the cookie will be available. Default is '/' (available across the entire domain).
   * @param bool $secure Whether the cookie should only be sent over secure connections (HTTPS). Default is true.
   * @param string|bool $sameSite The SameSite attribute for the cookie, which can be 'Strict', 'Lax', 'None', or false to omit it. Default is 'Strict'.
   */
  public function setCookie(string $name, string $value, int $expires = 0, bool $httpOnly = true, string $path = '/', bool $secure = true, string | bool $sameSite = 'Strict') : void{
    setcookie($name, $value, [
      'expires' => $expires,
      'httponly' => $httpOnly,
      'path' => $path,
      'secure' => $secure,
      'samesite' => $sameSite
    ]);
  }

  /**
   * Converts an array of data to a JSON string and sets the appropriate Content-Type header for the response.
   * @param array $data The data to be converted to JSON and sent in the response.
   * @return string The JSON-encoded string representation of the input data.
   */
  public function json(array $data) : string{
    header('Content-type: application/json');
    return json_encode($data);
  }

  /**
   * Returns a plain text response with the specified content.
   * @param string $text The text content to be included in the response. Default is an empty string.
   * @return string The text content to be sent in the response.
   */
  public function text(string $text = '') : string{
    return $text;
  }

  /**
   * Checks if headers have already been sent for the response.
   * @return bool True if headers have already been sent, false otherwise.
   */
  public function headersSent() : bool{
    return headers_sent();
  }
}