<?php
namespace nwnisworking\Middlewares;

use nwnisworking\HTTP\Request;
use nwnisworking\HTTP\Response;

interface Middleware{
  public function handle(Request $request, Response $response, callable $next) : string;
}