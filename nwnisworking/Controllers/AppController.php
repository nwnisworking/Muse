<?php
namespace nwnisworking\Controllers;

use nwnisworking\HTTP\Request;
use nwnisworking\HTTP\Session;
use nwnisworking\View;
use nwnisworking\Routers\Route;

#[Route('/')]
final class AppController{
  public function __construct(private View $view, private Session $session){}

  #[Route('', ['GET'])]
  public function index(Request $request) : string{
    $user = $this->session->get('user');

    return $this->view->render('index', [
      'title' => 'Muse - Peer to Peer Audio Sharing', 
      'auth' => $user,
      'content' => $this->view->render($user ? 'dashboard' : 'welcome')
    ]);
  }

  #[Route('/sign-in', ['GET', 'POST'], ['auth'])]
  public function signin() : string{
    $user = $this->session->get('user');
    var_dump($this->session);
    // return $this->view->render('index', [
    //   'title' => 'Muse | Sign In',
    //   'auth' => $user,
    //   'content' => $this->view->render()
    // ]);

    return '4';
  }

  #[Route('/signup')]
  public function signup() : string{}
}