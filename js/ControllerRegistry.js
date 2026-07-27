import Controller from "./Controllers/Controller.js"

export default class ControllerRegistry{
  #controllers = new Map

  /**
   * Register a controller class 
   * @param {typeof Controller} controller 
   */
  register(controller){
    this.#controllers.set(
      controller.id(),
      controller
    )
  }

  /**
   * Get a controller by its ID
   * @param {string} id Name of the controller
   * @returns {typeof Controller | undefined}
   */
  get(id){
    return this.#controllers.get(id) || null
  }

  /**
   * Check if a controller is registered
   * @param {string} id Name of the controller
   * @returns {boolean}
   */
  has(id){
    return this.#controllers.has(id)
  }
}