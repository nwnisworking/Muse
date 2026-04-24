<?php
namespace nwnisworking\Routers;

use function count;

use nwnisworking\App;
use nwnisworking\Bootable;
use nwnisworking\Utils\Logger;
use ReflectionClass;

/**
 * The RouteCache class is responsible for caching the routes defined in the controllers.
 */
final class RouteCache implements Bootable{
  /**
   * The path to the log file where route cache operations will be logged.
   * @var string
   */
  private const string LOGGER_FILE = 'logs/route.log';

  /**
   * The path to the cache file where the routes will be stored.
   * @var string
   */
  private const string CACHE_FILE = 'cache/routes.php';

  /**
   * The glob pattern to find all controller files in the application.
   * @var string
   */
  private const string CONTROLLER_FILES = 'nwnisworking/Controllers/*.php';

  /**
   * A flag to indicate whether the route cache has been booted.
   * @var bool
   */
  private static bool $booted = false;

  /**
   * The logger instance for logging route cache operations.
   * @var Logger
   */
  private Logger $logger;

  public function __construct(){
    $this->logger = new Logger(self::LOGGER_FILE);
  }

  /**
   * Boot method to initialize the route cache.
   * @param App $app The application instance to set the routes on.
   */
  public function boot(App $app) : void{
    $this->logger->log('Booting route cache...');

    $cache = self::CACHE_FILE;
    $controllers = glob(self::CONTROLLER_FILES);

    if($this->isCacheValid($controllers)){
      $this->logger->log('Route cache loaded');
      $routes = require_once $cache;

      self::$booted = true;

      $app->setRoutes($routes);
      return;
    }
    else{
      $this->logger->log('Route cache is invalid, rebuilding...');
    }

    $routes = $this->buildCache($controllers);

    $app->setRoutes($routes);

    $this->logger->log('Route cache built with ' . count($routes) . ' routes');
    file_put_contents($cache, '<?php return ' . var_export($routes, true) . ';');
  }

  /**
   * Check if the route cache is valid by comparing the modification time of the cache file with the controller files.
   * @param array $controllers The list of controller files to compare against.
   * @return bool True if the cache is valid, false otherwise.
   */
  private function isCacheValid(array $controllers) : bool{
    $cache = self::CACHE_FILE;

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

  /**
   * Build the route cache by reflecting on the controller classes and their methods.
   * @param array $controllers The list of controller files to process for building the route cache.
   * @return array{controller: array|string, method: string, middlewares: array, path: string[]}
   */
  private function buildCache(array $controllers) : array{
    $routes = [];

    $this->logger->log('Building route cache...');

    foreach($controllers as $controller){
      $controller = str_replace(['.php', '/'], ['', '\\'], $controller);
      $reflection = new ReflectionClass($controller);

      // Can't build abstract class or interface
      if($reflection->isAbstract() || $reflection->isInterface()){
        continue;
      }

      $this->logger->log("Processing controller: $controller");

      $classAttribute = $reflection->getAttributes(Route::class)[0] ?? null;

      if($classAttribute){
        $classRoute = $classAttribute->newInstance();
      }

      foreach($reflection->getMethods() as $method){
        $methodAttributes = $method->getAttributes(Route::class);

        foreach($methodAttributes as $methodAttribute){
          $childRoute = $methodAttribute->newInstance();
          $combineRoute = $classRoute ? $classRoute->join($childRoute) : $childRoute;
          $fullPath = '/' . trim($combineRoute->path, '/');
          $middlewares = $combineRoute->middlewares;

          foreach($combineRoute->methods as $httpMethod){
            $httpMethod = strtoupper($httpMethod);

            $this->logger->log("Generating route: $httpMethod $combineRoute->path with middlewares: " . implode(', ', $combineRoute->middlewares));

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

  public function isBooted() : bool{
    return self::$booted;
  }
}