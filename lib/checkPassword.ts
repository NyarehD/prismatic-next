const bcrypt = require("bcrypt")
export default async function checkPassword(unHashedPassword: string | undefined, hashedPassword: string | null) {
  return bcrypt.compare(unHashedPassword, hashedPassword).then(function (result: Boolean) {
    return result;
  })
}