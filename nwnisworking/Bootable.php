<?php
namespace nwnisworking;

/**
 * Bootable interface allows classes to define a boot method that will be called during the app's initialization phase.
 */
interface Bootable{
  /**
   * The boot method is called during the app's initialization phase. 
   * @param App $app The app instance is passed to the boot method.
   */
  public function boot(App $app) : void;

  /**
   * Checks if the bootable class has already been booted.
   * @return bool Returns true if the class has been booted, false otherwise.
   */
  public function isBooted() : bool;
}