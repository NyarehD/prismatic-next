import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import prisma from "../../../prisma/prisma";
interface Props {
  users: User[]
}
export default function Users({ users }: Props) {
  return (
    <>
      <h1 className="mb-3 text-3xl font-semibold">Users List</h1>
      <div className="overflow-x-auto">
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