<?php
namespace nwnisworking;

use nwnisworking\HTTP\Request;
use nwnisworking\Utils\Logger;
use ReflectionClass;
use function call_user_func;
use function is_string;
use function in_array;

final class App{
  private static self $instance;

  private array $bootables = [];

  private array $routes = [];

  private array $bindings = [];

  private array $singletons = [];

  private array $middlewares = [];

  public function run() : void{
    foreach($this->bootables as $bootable){
      $bootable::boot($this);
    }

    if(php_sapi_name() === 'cli'){
      Logger::log("Unable to run app in CLI mode", Logger::ERROR);
      exit(1);
    }

    $this->dispatch();
  }

  public function setRoutes(array $routes) : void{
    $this->routes = $routes;
  }

  public function bootable(string $class) : void{
    $implements = class_implements($class);
    if(!$implements || !in_array(Bootable::class, $implements)){
      Logger::log("Class $class does not implement Bootable interface", Logger::ERROR);
      return;
    }

    $this->bootables[] = $class;
  }

  public function bind(string $key, callable $factory) : void{
    $this->bindings[$key] = $factory;
  }

  public function singleton(string $key, callable $factory) : void{
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
        Logger::log("Unable to resolve untyped dependency for $key", Logger::ERROR);
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
    $key = "{$request->method} {$request->uri}";
    
    if(!isset($this->routes[$key])){
      http_response_code(404);
      
      $view = $this->make('view');
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
        return function($request) use($next, $middlewareKey){
          $middlewareClass = $this->middlewares[$middlewareKey] ?? null;
          if(!$middlewareClass){
            Logger::log("Middleware $middlewareKey not found", Logger::ERROR);
            return $next($request);
          }

          $middleware = $this->make($middlewareClass);
          return $middleware->handle($request, $next);
        };
      },
      function($request) use($controller, $method){
        return call_user_func([$controller, $method], $request);
      });

      $response = $pipeline($request);

      echo $response;
  }

  public static function getInstance() : self{
    if(!isset(self::$instance)){
      self::$instance = new self;
    }

    return self::$instance;
  }
}