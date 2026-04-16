<?php

use nwnisworking\Middlewares\AuthenticationMiddleware;


spl_autoload_register(fn($class) => require_once str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php');

use nwnisworking\HTTP\Session;
use nwnisworking\App;
use nwnisworking\View;
use nwnisworking\Routers\RouteCache;

$app = App::getInstance();
$app->bootable(RouteCache::class);
$app->singleton(View::class, fn() => new View);
$app->singleton(Session::class, fn() => new Session);
$app->registerMiddleware('auth', AuthenticationMiddleware::class);
$app->run();