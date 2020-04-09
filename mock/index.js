const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const Mock = require('mockjs')
const glob = require('glob')

const resDir = path.join(__dirname, 'routes')

function getRoutes() {
  return glob
    .sync(resDir + '/*.js')
    .reduce((acc, file) => acc.concat(require(file)), [])
}

function registerRoutes(app) {
  let mockLastIndex
  console.log(getRoutes())
  const mocksForServer = getRoutes().map(route => {
    const { url, type, response } = route
    return {
      url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
      type: type || 'get',
      response(req, res) {
        console.log('request invoke:' + req.path)
        res.json(
          Mock.mock(
            response instanceof Function ? response(req, res) : response
          )
        )
      }
    }
  })

  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocksForServer).length
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  }
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(resDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

module.exports = app => {
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  const mockRoutes = registerRoutes(app)

  let { mockRoutesLength, mockStartIndex } = mockRoutes

  chokidar.watch(resDir, { ignoreInitial: true }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        app._router.stack.splice(mockStartIndex, mockRoutesLength)

        unregisterRoutes()

        const mockRoutes = registerRoutes(app)
        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(
          chalk.magentaBright(
            `\n > Mock Server hot reload success! changed  ${path}`
          )
        )
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
