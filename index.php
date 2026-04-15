<?php
spl_autoload_register(fn($class) => require_once str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php');

use nwnisworking\App;
use nwnisworking\Routers\RouteCache;

$app = App::getInstance();
$app->boot(RouteCache::class);
$app->run();