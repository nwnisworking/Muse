<?php
namespace nwnisworking\Middlewares;

use nwnisworking\HTTP\Request;
use nwnisworking\HTTP\Response;
use nwnisworking\HTTP\Session;

final class AuthenticationMiddleware implements Middleware{
  public function __construct(Private Session $session){}

  public function handle(Request $request, Response $response, callable $next) : string{
    if($this->session->has('user')){
      $response->set('location', '/');
      return $response->text();
    }

    return $next($request, $response);
  }
}