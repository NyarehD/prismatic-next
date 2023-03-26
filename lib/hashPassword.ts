const bcrypt = require("bcrypt")
export default async function hashPassword(password: string) {
  return bcrypt.hash(password, 10).then(function (hash: string) {
    return hash;
  })
}