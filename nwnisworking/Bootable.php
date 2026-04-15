<?php
namespace nwnisworking;

interface Bootable{
  public static function boot(App $app) : void;

  public static function isBooted() : bool;
}