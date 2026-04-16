<?php
namespace nwnisworking\Middlewares;

use nwnisworking\HTTP\Request;

interface Middleware{
  public function handle(Request $request, callable $next) : string;
}