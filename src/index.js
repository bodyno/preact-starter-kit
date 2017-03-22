// import 'promise-polyfill'
// import 'isomorphic-fetch'
import { h, render } from 'preact'
import {Provider} from 'mobx-react'
import store from './store'
import './style'

let root
function init() {
	let App = require('./routes').default
	root = render((
	  <Provider {...store}>
      <App />
    </Provider>
  ), document.body, root)
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV==='production') {
	require('./pwa')
}

// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools')   // turn this on if you want to enable React DevTools!
	module.hot.accept('./routes/index', () => requestAnimationFrame(init) )
}

init()
