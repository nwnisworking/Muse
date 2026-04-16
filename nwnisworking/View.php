<?php
namespace nwnisworking;

final class View{
  public function render(string $path, array $_ = []) : string{
    extract($_, EXTR_SKIP);
    unset($_);

    ob_start();
    include "views/$path.phtml";
    return ob_get_clean();
  }
}