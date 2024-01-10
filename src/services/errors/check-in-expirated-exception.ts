export class CheckInExpiratedException extends Error {
  constructor() {
    super('CheckIn validation expirated')
  }
}
