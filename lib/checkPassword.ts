const bcrypt = require("bcrypt")
export default async function checkPassword(unHashedPassword: string, hashedPassword: string) {
  return bcrypt.compare(unHashedPassword, hashedPassword).then(function (result: Boolean) {
    return result;
  })
}