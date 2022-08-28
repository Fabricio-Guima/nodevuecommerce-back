const InvalidLogin = class UserServiceError extends Error {
  constructor(...args) {
    super(...args)
    console.error(args)
    this.code = 'ERR_INVALID_LOGIN'
    this.name = 'InvalidLogin'
    this.status = args[0]
  }
}

module.exports = {
  InvalidLogin,
}
