import { h, Component } from 'preact'
import { Link } from 'preact-router'
import style from './style'

export default class extends Component {
	render() {
		return (
			<header class={style.header}>
				<h1>Preact App</h1>
				<nav>
					<Link activeClassName='active' href="/">Home66666</Link>
					<Link activeClassName='active' href="/profile">Me</Link>
					<Link activeClassName='active' href="/profile/john">John</Link>
				</nav>
			</header>
		)
	}
}
