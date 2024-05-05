const config = require('./util/config')
const logger = require('./util/logger')
const app = require('./app')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})