export default class App{
  #root

  #loadingTemplate

  #controllers

  #controller

  constructor({ loadingTemplate, root, controllerRegistry }){
    this.#root = root
    this.#loadingTemplate = loadingTemplate
    this.#controllers = controllerRegistry
  }

  get root(){
    return this.#root
  }

  load(id = null){
    const controller = this.#controllers.get(id) ?? this.#controllers.get('default')

    if(!controller){
      throw new Error(`Controller with id "${id}" not found`)
    }

    this.#controller = new controller(app)
  }
}