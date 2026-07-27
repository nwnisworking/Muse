export default class Controller{
  static id(){
    throw new Error('Method "id" must be implemented in the subclass')
  }
  
  mount(){
    throw new Error('Method "mount" must be implemented in the subclass')
  }

  unmount(){
    throw new Error('Method "unmount" must be implemented in the subclass')
  }
}