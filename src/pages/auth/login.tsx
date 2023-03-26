import { GetServerSideProps } from "next";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Login({ provider }) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const { data } = useSession();

  return (
    <>
      <h1 className="mb-3 text-4xl">Users is {data ? "logged in" : "not logged in"}</h1>
      <button className="btn btn-primary" onClick={() => signIn("credentials", { username: name, password })}>Sign In</button>
      <button className="btn btn-primary" onClick={() => signOut()}>Sign out</button>
      <div className="mb-3">
        <h1 className="mb-3 text-4xl">Login</h1>
        <input type="text" name="name" className="input mr-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="password" name="password" className="input mr-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      provider: await getProviders()
    }
  }
}