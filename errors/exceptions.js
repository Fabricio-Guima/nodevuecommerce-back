const InvalidLogin = class UserServiceError extends Error {
  constructor(...args) {
    super(...args)
    console.error(args)
    this.code = 'ERR_INVALID_LOGIN'
    this.name = 'InvalidLogin'
    this.status = args[0]
  }
}

const BlockedUser = class UserServiceError extends Error {
  constructor(...args) {
    super(...args)
    console.error(args)
    this.code = 'ERR_BLOCKED_USER'
    this.name = 'BlockedUser'
    this.status = args[0]
  }
}

const InvalidEmail = class UserServiceError extends Error {
  constructor(...args) {
    super(...args)
    console.error(args)
    this.code = 'ERR_INVALID_EMAIL'
    this.name = 'InvalidEmail'
    this.status = args[0]
  }
}

module.exports = {
  InvalidLogin,
  InvalidEmail,
  BlockedUser,
}
