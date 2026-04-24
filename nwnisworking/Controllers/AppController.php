<?php
namespace nwnisworking\Controllers;

use nwnisworking\HTTP\Request;
use nwnisworking\HTTP\Response;
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
  public function signin(Request $request, Response $response) : string{
    if($request->method === 'GET'){
      return $this->view->render('index', [
        'title' => 'Muse | Sign In',
        'auth' => null,
        'content' => $this->view->render('sign-in')
      ]);
    }

    $email = filter_var($request->body['email'], FILTER_VALIDATE_EMAIL);
    $password = $request->body['password'];

    if($email === '' || $password === '' || $email === false){
      return $this->view->render('index', [
        'title' => 'Muse | Sign In',
        'content' => $this->view->render('sign-in', [
          'error' => 'Enter your email and password to continue.',
          'email' => $email,
          'auth' => null
        ])
      ]);
    }

    $this->session->set('user', [
      'email' => $email,
    ]);

    $this->session->regenerate();
    $response->set('location', '/');

    return '';
  }

  #[Route('/signup', ['POST'], ['auth'])]
  public function signup() : string{
    return '';
  }
}