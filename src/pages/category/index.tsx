import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import Toast from "../../../components/Toast";
import AddIcon from "../../../components/icons/AddIcon";
import PencilIcon from "../../../components/icons/PencilIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import usePageCount from "../../../hooks/usePageCount";
import useToast from "../../../hooks/useToast";
import prisma from "../../../prisma/prisma";

interface ModifiedCategory extends Omit<Prisma.CategoryGetPayload<{
  select: {
    _count: true,
    name: true,
    id: true,
    item: true,
    createdAt: true,
    updatedAt: true,
  }
}>, "createdAt" | "updatedAt"> {
  createdAt: string,
  updatedAt: string
}
interface Props {
  categories: ModifiedCategory[]
  pageCount: number
}
export default function Categories({ categories, pageCount }: Props) {
  const router = useRouter()
  const { setToast, ...toastState } = useToast()

  // Refs
  const modelCreateButtonRef = useRef<HTMLLabelElement>(null);
  const modelUpdateButtonRef = useRef<HTMLLabelElement>(null);

  // Create New Category
  const [categoryName, setCategoryName] = useState("")

  async function addCategory() {
    const response = await fetch('/api/category', {
      method: 'POST',
      body: JSON.stringify({ name: categoryName }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      setToast("Category is created successfully", "success");
      modelCreateButtonRef.current?.click();
      router.replace(router.asPath);
      setCategoryName("");
    } else if (response.status === 400) {
    }
  }

  // Delete category
  async function deleteCategory(id: number) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 200) {
      setToast("Category is deleted successfully", "info")
      router.replace(router.asPath);
    } else if (response.status === 404) {
    }
  }


  // Edit a category
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<number>(0)

  function updateCategoryModal(name: string, id: number) {
    setEditCategoryName(name);
    setEditingCategoryId(id);
  }

  async function updateCategory(id: number) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: editCategoryName }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      setToast(`Category is updated successfully`, "success");
      modelUpdateButtonRef.current?.click();
      router.replace(router.asPath);
      setEditCategoryName("");
    } else if (response.status === 400) {
    }
  }

  return (
    <>
      <div className="flex justify-between mb-3">
        <h1 className="text-3xl font-semibold">Category List</h1>
        <label htmlFor="category-create-modal" className="btn btn-success" ref={modelCreateButtonRef}>Add Category<AddIcon /></label>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full mb-3">
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
                  <label htmlFor="category-update-modal" className="btn btn-square btn-sm btn-info mr-2" onClick={() => updateCategoryModal(category.name, category.id)} ref={modelUpdateButtonRef}><PencilIcon /></label>
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
      <Pagination pageCount={pageCount} />

      {/* Model to create category */}
      <Modal id="category-create-modal">
        <h3 className="text-lg font-bold">Add a New Category</h3>
        <input type="text" name="name" id="name" className="input input-bordered w-full mt-3" placeholder="Add New Category" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
        <button className="btn btn-success float-right mt-3" type="button" onClick={addCategory}>Add <AddIcon /></button>
      </Modal>

      {/* Modal to edit category */}
      <Modal id="category-update-modal">
        <h3 className="text-lg font-bold">Edit a Category</h3>
        <input type="text" name="categoryUpdate" id="categoryUpdate" className="input input-bordered w-full mt-3" placeholder="Edit Category" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
        <button className="btn btn-success float-right mt-3" type="button" onClick={() => updateCategory(editingCategoryId)}>Edit <PencilIcon /></button>
      </Modal>
      <Toast {...toastState} />
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const take = 8;
  const pageCount = Math.ceil((await prisma.category.findMany()).length / take)

  const categories = await prisma.category.findMany({
    take,
    skip: context.query?.page ? (Number(context.query?.page) - 1) * 8 : 0,
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
    return {
      ...category, createdAt: newCreatedDate.toLocaleString(), updatedAt: newUpdatedDate.toLocaleString()
    }
  })
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      pageCount
    }
  }
}