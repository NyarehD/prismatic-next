import { Post } from "@prisma/client";
import router from "next/router";
import prisma from "../../prisma/prisma";
interface PostProps {
  posts: Post[]
}
export default function Posts({ posts }: PostProps) {
  const createPost = async () => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ description: "Bwa hahah", userId: 1 }),
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
      <h1>Users</h1>
      <button onClick={createPost}>Add Post</button>
      {posts.map((item, i) => (
        <li key={`${item.id}${i}`}>{item.description}</li>
      ))}
    </>
  )
}
export async function getServerSideProps() {
  const posts = await prisma.post.findMany({
    include: {
      user: true
    }
  })
  return {
    props: {
      posts
    }
  }
}