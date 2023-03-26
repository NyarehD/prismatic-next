import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const { data } = useSession();

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="mb-6 text-4xl">Login</h1>
      <div className="inline-flex items-baseline justify-between w-full mb-2">
        <label htmlFor="name" className="">Name :</label>
        <input type="text" name="name" id="name" className="input w-2/3" placeholder="Insert Your Name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="inline-flex items-baseline justify-between w-full mb-2">
        <label htmlFor="password">Password :</label>
        <input type="password" name="password" id="password" className="input w-2/3" placeholder="Insert Your Password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="button" className="btn btn-primary float-right" onClick={() => signIn("credentials", { username: name, password })}>Sign In</button>
    </div>
  )
}