import { h, Component } from 'preact'
import {Router} from 'preact-router'
import AsyncRoute from 'preact-async-route'

import Header from 'components/header'
import Loading from 'components/loading'
import Home from 'routes/home'
import Profile from 'routes/profile'

export default class extends Component {

	handleRoute = e => {
		this.currentUrl = e.url
	}

	render () {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<AsyncRoute path="/" component={Home} />
					<AsyncRoute path="/profile/" user="me" component={Profile} />
					<AsyncRoute path="/profile/:user" component={Profile} />
				</Router>
			</div>
		)
	}
}
