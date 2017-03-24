import bind from 'autobind-decorator'
import { observable, action } from 'mobx'
import axios from 'axios'

@bind
export default class {
  @observable count = 10
  @observable data = {
    page: 10
  }

  @action
  plus () {
    this.count ++
  }

  @action
  fetch () {
    this.data = {
      ...this.data,
      count: 100
    }
  }
}
