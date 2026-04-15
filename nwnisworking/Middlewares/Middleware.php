<?php
namespace nwnisworking\Middlewares;

interface Middleware{
  public function handle(array $request, callable $next) : array;
}