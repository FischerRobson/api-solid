export class CheckInLimitException extends Error {
  constructor() {
    super('CheckIn limit has reached')
  }
}
