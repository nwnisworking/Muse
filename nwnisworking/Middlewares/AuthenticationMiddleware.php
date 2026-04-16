<?php
namespace nwnisworking\Middlewares;

use nwnisworking\HTTP\Request;
use nwnisworking\HTTP\Session;

final class AuthenticationMiddleware implements Middleware{
  public function __construct(Private Session $session){}

  public function handle(Request $request, callable $next) : string{
    return $next($request);
  }
}