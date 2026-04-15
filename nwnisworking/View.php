<?php
namespace nwnisworking;

final class View{
  public function render(string $path, array $data = []) : string{
    extract($data);
    unset($data);

    ob_start();
    include "views/$path.phtml";
    return ob_get_clean();
  }
}