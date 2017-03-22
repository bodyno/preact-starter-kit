export default (url, cb) => {
  require.ensure([], function (require) {
    let component = require('./component/profile').default
    cb({component})
  })
}
