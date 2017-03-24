import bind from 'autobind-decorator'
import { observable, action } from 'mobx'
import axios from 'axios'

@bind
export default class {
  @observable count = 10
  @observable data = []

  @action
  plus () {
    this.count ++
  }

  @action
  fetch () {
    axios.get('https://api.github.com/zen').then(({data}) => {
      this.data.push(data)
    })
  }
}
