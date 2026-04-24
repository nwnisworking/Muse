<?php
namespace nwnisworking\Routers;

use Attribute;

/**
 * The Route is an attribute class used to define routes for handling HTTP requests.
 */
#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class Route{
  /**
   * Route constructor to define a route with path, allowed HTTP methods, and middlewares.
   * @param string $path The URI path for the route, e.g. '/users/{id}'
   * @param array $methods Allowed HTTP methods for this route, e.g. ['GET', 'POST']. Defaults to ['GET'] if not specified.
   * @param array $middlewares List of middleware names to apply to this route, e.g. ['auth', 'log']. Defaults to an empty array if not specified.
   */
  public function __construct(
    public string $path, 
    public array $methods = ['GET'], 
    public array $middlewares = []
  ){}

  /**
   * Combine this route with a child route, concatenating their paths and merging their middlewares.
   * @param Route $child The child route to combine with this route.
   * @return Route A new Route instance with the combined path and middlewares.
   */
  public function join(self $child) : Route{
    // Normalize paths by trimming slashes at the front and back and concatenating them with a single slash
    $basePath = trim($this->path, '/');
    $childPath = trim($child->path, '/');
    $fullPath = "{$basePath}/{$childPath}";

    $middlewares = [...$this->middlewares, ...$child->middlewares];

    return new self(
      $fullPath,
      $child->methods,
      $middlewares
    );
  }
}
