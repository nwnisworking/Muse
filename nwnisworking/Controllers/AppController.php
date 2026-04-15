<?php
namespace nwnisworking\Controllers;

use nwnisworking\View;
use nwnisworking\Routers\Route;

#[Route('/', middlewares: ['app'])]
final class AppController{
  public function __construct(private View $view){}

  #[Route('', ['GET'], middlewares : ['auth'])]
  public function index() : string{
    return $this->view->render('index', ['title' => 'Home Page']);
  }

  #[Route('/signin', ['GET', 'POST'])]
  public function signin() : string{}

  #[Route('/signup')]
  public function signup() : string{}
}