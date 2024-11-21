import { isValidPhoneNumber } from 'libphonenumber-js'
import type { CountryCode } from 'libphonenumber-js'

export const Validator = {
  isEmail: (email: string) => {
    const reg =
      /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
  },
  isPhone: (phone: string, defaultCountry: CountryCode = 'TH') =>
    isValidPhoneNumber(phone, defaultCountry),
  isTimeStampISOString: (date?: string) => {
    if (date) {
      const reg =
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
      return reg.test(date)
    }
    return false
  }
}
