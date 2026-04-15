<?php
namespace nwnisworking\Routers;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class Route{
  public function __construct(public string $path, public array $methods = ['GET'], public array $middlewares = []){}

  public function combine(self $child) : Route{
    $basePath = trim($this->path, '/');
    $childPath = trim($child->path, '/');
    $fullPath = "{$basePath}/{$childPath}";

    $middlewares = array_merge($this->middlewares, $child->middlewares);

    return new self(
      $fullPath,
      $child->methods,
      $middlewares
    );
  }
}
