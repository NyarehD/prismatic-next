import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import prisma from "../../prisma/prisma";
interface Props {
  users: User[]
}
export default function Users({ users }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const submitUsers = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: name, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()

    router.replace(router.asPath);
  }
  const submitProfile = async (id: number) => {
    const response = await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({ id: id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    router.replace(router.asPath);

    console.log(data)
  }


  // Auth
  const { data } = useSession();
  return (
    <>
      {/* <div className="">
        <h1 className="text-4xl">users</h1>
        {
          session ? <h1>user is logged in </h1> : <h1>user is not logged in</h1>
        }
        <button onClick={submitUsers} type="button" className="btn btn-primary ">click me</button>
        <div className="">
          <input type="text" value={name} onChange={e => setName(e.target.value)} name="name" />
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} name="email" />
        </div>
      </div> */}
      {/* Form */}
      <div className="mb-3">
        <h1 className="mb-3 text-4xl">Users is {data ? "logged in" : "not logged in"}</h1>
        <form action="/api/users" method="POST">
          <input type="text" name="name" className="input mr-2" placeholder="Name" />
          <input type="text" name="email" className="input mr-2" placeholder="Email" />
          <input type="password" name="password" className="input mr-2" placeholder="Password" />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <div className="mb-3">
        <h1 className="mb-3 text-4xl">Login</h1>
        <form action="/api/auth/login" method="POST">
          <input type="text" name="name" className="input mr-2" placeholder="Name" />
          <input type="password" name="password" className="input mr-2" placeholder="Password" />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <button type="button" className="btn btn-warning" onClick={signOut}>Log Out</button>
      <div className="mx-3 overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>username</th>
              <th>email</th>
              <th>password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr className="hover" key={`${user.id}&${i}`}>
                <th>{user.id}</th>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export async function getServerSideProps() {
  const users = await prisma.user.findMany({
  });
  return {
    props: {
      users
    }
  }
}