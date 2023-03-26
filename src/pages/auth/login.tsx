import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [errorStatus, setErrorStatus] = useState(false);

  const { data } = useSession();
  const router = useRouter();
  const callBackURL = (router.query?.callbackUrl as string) ?? "/"

  async function login() {
    const result = await signIn("credentials", {
      username: name, password, redirect: false
    })
    if (result?.error) {
      setErrorStatus(!result?.ok)
    } else {
      router.push(callBackURL);
    }
  }
  return (
    <>
      <Head>
        <title>Login to CMS</title>
      </Head>
      <div className="max-w-lg mx-auto">
        <h1 className="mb-6 text-4xl">Login</h1>
        {
          errorStatus && <div className="alert alert-error mb-2 shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Credentials Do Not Match</span>
            </div>
          </div>
        }
        <div className="inline-flex items-baseline justify-between w-full mb-2">
          <label htmlFor="name" className="">Name :</label>
          <input type="text" name="name" id="name" className="input w-2/3" placeholder="Insert Your Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="inline-flex items-baseline justify-between w-full mb-2">
          <label htmlFor="password">Password :</label>
          <input type="password" name="password" id="password" className="input w-2/3" placeholder="Insert Your Password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary float-right" onClick={login}>Log In</button>
      </div>
    </>
  )
}