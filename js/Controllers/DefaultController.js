import Controller from './Controller.js'

export default class DefaultController extends Controller{
  #context

  constructor({ context }){
    this.#context = context
  }

  mount(){

  }

  static id(){
    return 'default'
  }
}