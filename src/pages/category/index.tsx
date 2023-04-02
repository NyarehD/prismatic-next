import ErrorMessage from "@/types/ErrorMessage.type";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Toast from "../../../components/Toast";
import AddIcon from "../../../components/icons/AddIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import prisma from "../../../prisma/prisma";
import PencilIcon from "../../../components/icons/PencilIcon";
interface Props {
  categories: Prisma.CategorySelect[]
}
export default function Categories({ categories }: Props) {
  const [name, setName] = useState("")
  const [errorStatus, setErrorStatus] = useState(false)
  const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);

  const modelButtonRef = useRef<HTMLLabelElement>(null);

  const [isCreateToastShown, setIsCreateToastShown] = useState(false);
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);

  const router = useRouter()

  async function addCategory() {
    const response = await fetch('/api/category', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      setIsCreateToastShown(true)
      modelButtonRef.current?.click();
      router.replace(router.asPath);
      setName("");
    } else if (response.status === 400) {

    }
  }
  async function deleteCategory(id: number) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 200) {
      router.replace(router.asPath);
    } else if (response.status === 404) {
      console.log(response.status);

      setIsErrorToastShown(true)
    }
  }
  return (
    <>
      <div className="flex justify-between mb-3">
        <h1 className="text-3xl font-semibold">Category List</h1>
        <label htmlFor="category-create-model" className="btn btn-success" ref={modelButtonRef}>Add Category<AddIcon /></label>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>Total</th>
              <th>Actions</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {categories.length ? categories.map((category, i) => (
              <tr className="hover" key={`${category.id}&${i}`}>
                <th>{category.id}</th>
                <td>{category.name}</td>
                <td>{category?._count?.item}</td>
                <td>
                  <button className="btn btn-square btn-sm btn-info mr-2" ><PencilIcon /></button>
                  <button className="btn btn-square btn-sm btn-error mr-2" onClick={() => deleteCategory(category.id)}><TrashIcon /></button>
                </td>
                <td>{category.createdAt}</td>
                <td>{category.updatedAt}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={12} className="text-center">No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Model to create category */}
      <input type="checkbox" id="category-create-model" className="modal-toggle" />
      <label htmlFor="category-create-model" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Add a New Category</h3>
          <label htmlFor="category-create-model" className="btn btn-sm btn-square right-5 top-5 absolute">✕</label>
          <input type="text" name="name" id="name" className="input input-bordered w-full mt-3" placeholder="Add New Category" value={name} onChange={e => setName(e.target.value)} />
          <button className="btn btn-success float-right mt-3" type="button" onClick={addCategory}>Add <AddIcon /></button>
        </label>
      </label>

      <Toast color="success" isShown={isCreateToastShown} setIsShown={setIsCreateToastShown}>A category is created successfully.</ Toast>
      <Toast color="error" isShown={isErrorToastShown} setIsShown={setIsErrorToastShown}>Cannot Delete a category</Toast>
    </>
  )
}
export async function getServerSideProps() {
  const categories = await prisma.category.findMany({
    select: {
      _count: true,
      name: true,
      id: true,
      item: true,
      createdAt: true,
      updatedAt: true
    },
  })
  categories.map(category => {
    const newCreatedDate = new Date(category.createdAt);
    const newUpdatedDate = new Date(category.createdAt);
    console.log(typeof newCreatedDate);

    return {
      ...category, createdAt: newCreatedDate.toLocaleString(), updatedAt: newUpdatedDate.toLocaleString()
    }
  })
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories))
    }
  }
}