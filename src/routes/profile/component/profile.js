import { h, Component } from 'preact'
import style from './profile.less'
import { observer, inject } from 'mobx-react'
import { route } from 'preact-router'

@inject('countStore') @observer
export default class extends Component {

  jump = () => {
    route('/')
  }

	render () {
    const {countStore} = this.props
    return (
			<div class={style.profile}>
        <div>Profile</div>
        <h1>{countStore.count}</h1>
        <button onClick={countStore.plus}>Jump</button>
      </div>
		)
	}
}
