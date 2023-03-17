import { User } from "@prisma/client";
import { GetServerSideProps } from "next"
import { useRouter } from "next/router";
import { useState } from "react"
import prisma from "../../prisma/prisma"
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
    console.log(data)
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
  return (
    <>
      <div className="">
        <h1>Users</h1>
        <button onClick={submitUsers}>Click me</button>
        <div className="">
          <input type="text" value={name} onChange={e => setName(e.target.value)} name="name" />
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} name="email" />
        </div>
        {users.map(user => (
          <div key={user.email}>
            <h1 key={user.email}>Name: {user.name} Email: {user.email}</h1>
            <h3>Profile {user.profile?.userId}</h3>
            <button onClick={() => submitProfile(user.id)}>Add Profile {user.id}</button>
          </div>
        ))}
      </div>
    </>
  )
}
export async function getServerSideProps() {
  const users = await prisma.user.findMany({
    include: {
      profile: true
    }
  });
  return {
    props: {
      users
    }
  }
}