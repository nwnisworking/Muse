<?php
namespace nwnisworking\HTTP;

use function is_array;

final readonly class Request{
  public string $method;

  public string $uri;

  public array $query;

  public array $body;

  public array $headers;

  public array $cookies;

  public function __construct(){
    $this->method = strtoupper($_SERVER['REQUEST_METHOD']);
    $this->uri = $this->parseURI();
    $this->query = $_GET;
    $this->body = $this->parseBody();
    $this->headers = $this->parseHeaders();
    $this->cookies = $_COOKIE;
  }

  private function parseURI() : string{
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = '/' . trim($uri, '/');

    return $uri;
  }

  private function parseBody() : array{
    $content = $_SERVER['CONTENT_TYPE'] ?? '';

    if(str_contains($content,'application/json')){
      $input  = file_get_contents('php://input');
      $decoded = json_decode($input, true);

      return is_array($decoded) ? $decoded : [];
    }

    return $_POST;
  }

  private function parseHeaders() : array{
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