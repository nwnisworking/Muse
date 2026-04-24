<?php
namespace nwnisworking\HTTP;

use function is_array;

/**
 * The Request class represents an HTTP request.
 */
final readonly class Request{
  /**
   * The HTTP method of the request (e.g., GET, POST, PUT, DELETE).
   * @var string
   */
  public string $method;

  /**
   * The URI path of the request.
   * @var string
   */
  public string $uri;

  /**
   * An associative array of query parameters from the URL.
   * @var array
   */
  public array $query;

  /**
   * An associative array of the request body data.
   * @var array
   */
  public array $body;

  /**
   * An associative array of the request headers.
   * @var array
   */
  public array $headers;

  /**
   * An associative array of cookies sent with the request.
   * @var array
   */
  public array $cookies;

  /**
   * Constructor to initialize the Request object by parsing the incoming HTTP request data.
   */
  public function __construct(){
    $this->method = strtoupper($_SERVER['REQUEST_METHOD']);
    $this->uri = $this->parseURI();
    $this->query = $_GET;
    $this->body = $this->parseBody();
    $this->headers = $this->parseHeaders();
    $this->cookies = $_COOKIE;
  }

  /**
   * Parse the request URI.
   * @return string The normalized URI path, ensuring it starts with a slash and does not have trailing slashes.
   */
  private function parseURI() : string{
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = '/' . trim($uri, '/');

    return $uri;
  }

  /**
   * Parse the request body based on the Content-Type header. Supports JSON and form data.
   * @return array An associative array of the parsed request body data.
   */
  private function parseBody() : array{
    $content = $_SERVER['CONTENT_TYPE'] ?? '';

    if(str_contains($content,'application/json')){
      $input  = file_get_contents('php://input');
      $decoded = json_decode($input, true);

      return is_array($decoded) ? $decoded : [];
    }

    #todo: handle other content types like multipart/form-data for file uploads

    return $_POST;
  }

  /**
   * Parse headers from the request and return them as an associative array.
   * @return array
   */
  private function parseHeaders() : array{
    // getallheaders() is not available in some environments, so we manually parse headers from $_SERVER
    if(function_exists('getallheaders')){
      return getallheaders() ?: [];
    }

    $headers = [];

    foreach($_SERVER as $key => $value){
      if(str_contains($key, 'HTTP_')){
        $name = str_replace('_', '-', strtolower(substr($key, 5)));
        $headers[$name] = $value;
      }
    }

    return $headers;
  }
}