<?php

spl_autoload_register(fn($class) => require_once str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php');

use nwnisworking\App;
use nwnisworking\View;
use nwnisworking\Routers\RouteCache;

$app = App::getInstance();
$app->bootable(RouteCache::class);
$app->singleton('view', View::class);
$app->run();