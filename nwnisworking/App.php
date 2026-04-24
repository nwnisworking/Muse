<?php
namespace nwnisworking;

use nwnisworking\HTTP\Request;
use nwnisworking\HTTP\Response;
use nwnisworking\Utils\Logger;
use ReflectionClass;
use function call_user_func;
use function in_array;

/**
 * The App class is the core of the application, responsible for managing bootable components, routes, dependency injections, and middlewares.
 */
final class App{
  /**
   * The file path for the application logs. 
   * @var string
   */
  private const string LOGGER_FILE = 'logs/app.log';

  /**
   * The singleton instance of the App class. 
   * @var App
   */
  private static self $instance;

  /**
   * An array to hold the classes that implement the Bootable interface.
   * @var array<Bootable>
   */
  private array $bootables = [];

  /**
   * An array to hold the registered routes, where the key is a combination of HTTP method and URI.
   * @var array
   */
  private array $routes = [];

  /**
   * An array to hold the bindings for dependency injection,where the key is the class/interface name and the value is a factory function that returns an instance of the object.
   * @var array
   */
  private array $bindings = [];

  /**
   * An array to hold the single instances of classes that are regitsered as singletons.
   * @var array
   */
  private array $singletons = [];

  /**
   * An array to hold the registered middlewares, where the key is the middleware name and the value is the corresponding class name.
   * @var array
   */
  private array $middlewares = [];

  /**
   * The logger instance for logging application events and errors.
   * @var Logger
   */
  private Logger $logger;

  /**
   * The constructor for the App class.
   */
  public function __construct(){
    $this->logger = new Logger(self::LOGGER_FILE);
  }

  /**
   * Run the application by booting all registered bootable components and dispatching the incoming HTTP request.
   */
  public function run() : void{
    foreach($this->bootables as $bootable){
      $bootable->boot($this);
    }

    if(php_sapi_name() === 'cli'){
      $this->logger->log("Unable to run app in CLI mode", Logger::ERROR);
      exit(1);
    }

    $this->dispatch();
  }

  public function setRoutes(array $routes) : void{
    $this->routes = $routes;
  }

  /**
   * Register a bootable component to be initialized during the app's boot process.
   * @param Bootable $class The bootable component to register, which must implement the Bootable interface.
   */
  public function bootable(Bootable $class) : void{
    $this->bootables[] = $class;
  }

  public function bind(string $key, callable $factory) : void{
    $this->bindings[$key] = $factory;
  }

  public function singleton(string $key, ?callable $factory = null) : void{
    if($factory === null){
      $factory = fn($app) => new $key;
    }

    // Wraps the factory to ensure only one instance is created, allowing reuse of the same instance across the app.
    $this->bindings[$key] = function($app) use($key, $factory){
      if(!isset($app->singletons[$key])){
        $app->singletons[$key] = $factory($app);
      }

      return $app->singletons[$key];
    };
  }

  public function make(string $key) : mixed{
    if(isset($this->bindings[$key])){
      return $this->bindings[$key]($this);
    }

    $reflection = new ReflectionClass($key);
    $constructor = $reflection->getConstructor();

    if($constructor === null){
      return new $key;
    }

    $dependencies = [];

    foreach($constructor->getParameters() as $param){
      $type = $param->getType();

      if($type === null){
        $this->logger->log("Unable to resolve untyped dependency for $key", Logger::ERROR);
        continue;
      }

      $dependencies[] = $this->make($type->getName());
    }

    return $reflection->newInstanceArgs($dependencies);
  }

  public function registerMiddleware(string $key, string $class): void {
    $this->middlewares[$key] = $class;
  }

  private function dispatch() : void{
    $request = new Request();
    $response = new Response();

    $key = "{$request->method} {$request->uri}";

    if(!isset($this->routes[$key])){
      http_response_code(404);
      
      $view = $this->make(View::class);
      echo $view->render('404');
      return;
    }

    $route = $this->routes[$key];

    $controller = $this->make($route['controller']);
    $method = $route['method'];
    $middlewares = $route['middlewares'] ?? [];

    $pipeline = array_reduce(
      array_reverse($middlewares),
      function($next, $middlewareKey){
        return function($request, $response) use($next, $middlewareKey){
          $middlewareClass = $this->middlewares[$middlewareKey] ?? null;
          if(!$middlewareClass){
            $this->logger->log("Middleware $middlewareKey not found", Logger::ERROR);
            return $next($request, $response);
          }

          $middleware = $this->make($middlewareClass);
          return $middleware->handle($request, $response, $next);
        };
      },
      fn($request, $response) => call_user_func([$controller, $method], $request, $response)
    );

    echo $pipeline($request, $response);
  }

  public static function getInstance() : self{
    if(!isset(self::$instance)){
      self::$instance = new self;
    }

    return self::$instance;
  }
}