export class UserAlreadyExistsException extends Error {
  constructor() {
    super('User with this email already exists')
  }
}
