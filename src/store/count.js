import bind from 'autobind-decorator'
import { observable, action } from 'mobx'

@bind
export default class {
  @observable count = 1

  @action
  plus () {
    this.count ++
  }
}
