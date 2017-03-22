export default (url, cb) => {
  require.ensure([], function (require) {
    let component = require('./component/home').default
    cb({component})
  })
}
