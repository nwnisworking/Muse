<?php
namespace nwnisworking\Routers;

use function count;

use nwnisworking\App;
use nwnisworking\Bootable;
use nwnisworking\Logger;
use ReflectionClass;

final class RouteCache implements Bootable{
  private const string CACHE_FILE = 'cache/routes.php';

  private const string CONTROLLER_FILES = 'nwnisworking/Controllers/*.php';

  private static bool $booted = false;

  public static function boot(App $app) : void{
    Logger::log('Booting route cache...');

    $cache = self::CACHE_FILE;
    $controllers = glob(self::CONTROLLER_FILES);

    if(self::isCacheValid($cache, $controllers)){
      Logger::log('Route cache loaded');
      $routes = require_once $cache;

      self::$booted = true;

      $app->setRoutes($routes);
      return;
    }
    else{
      Logger::log('Route cache is invalid, rebuilding...');
    }

    $routes = self::buildCache($controllers);

    $app->setRoutes($routes);

    Logger::log('Route cache built with ' . count($routes) . ' routes');
    file_put_contents($cache, '<?php return ' . var_export($routes, true) . ';');
  }

  private static function isCacheValid(string $cache, array $controllers) : bool{
    if(!file_exists($cache)){
      return false;
    }

    $cacheTime = filemtime($cache);

    foreach($controllers as $controller){
      if(filemtime($controller) > $cacheTime){
        return false;
      }
    }

    return true;
  }

  private static function buildCache(array $controllers) : array{
    $routes = [];

    Logger::log('Building route cache...');

    foreach($controllers as $controller){
      $controller = str_replace(['.php', '/'], ['', '\\'], $controller);
      $reflection = new ReflectionClass($controller);

      // Can't build abstract class or interface
      if($reflection->isAbstract() || $reflection->isInterface()){
        continue;
      }

      Logger::log("Processing controller: $controller");

      $classAttribute = $reflection->getAttributes(Route::class)[0] ?? null;

      if($classAttribute){
        $classRoute = $classAttribute->newInstance();
      }

      foreach($reflection->getMethods() as $method){
        $methodAttributes = $method->getAttributes(Route::class);

        foreach($methodAttributes as $methodAttribute){
          $childRoute = $methodAttribute->newInstance();
          $combineRoute = $classRoute ? $classRoute->combine($childRoute) : $childRoute;
          $fullPath = '/' . trim($combineRoute->path, '/');
          $middlewares = $combineRoute->middlewares;

          foreach($combineRoute->methods as $httpMethod){
            $httpMethod = strtoupper($httpMethod);

            Logger::log("Generating route: $httpMethod $combineRoute->path with middlewares: " . implode(', ', $combineRoute->middlewares));

            $routes["$httpMethod $fullPath"] = [
              'controller' => $controller,
              'method' => $method->getName(),
              'path' => $fullPath,
              'middlewares' => $middlewares
            ];
          }
        }
      }
    }

    return $routes;
  }

  public static function isBooted() : bool{
    return self::$booted;
  }
}