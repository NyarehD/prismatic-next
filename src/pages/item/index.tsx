import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import Toast from "../../../components/Toast";
import AddIcon from "../../../components/icons/AddIcon";
import PencilIcon from "../../../components/icons/PencilIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import useChangeDateFormat from "../../../hooks/useChangeDateFormat";
import useToast from "../../../hooks/useToast";
import prisma from "../../../prisma/prisma";
import getPageSkip from "../../../server_hooks/getPageSkip";
import { authOptions } from "../api/auth/[...nextauth]";

interface ModifiedItem extends Omit<Prisma.ItemGetPayload<{
  include: {
    category: {
      select: {
        name: true
      }
    }
  }
}>, "createdAt" | "updatedAt"> {
  createdAt: string
  updatedAt: string
}

interface ItemProps {
  items: ModifiedItem[]
  pageCount: number
  categories: Prisma.CategoryGetPayload<{
    select: {
      id: true
      name: true
    }
  }>[]
}
export default function Items({ items, pageCount, categories }: ItemProps) {
  const router = useRouter()
  const { setToast, ...toastState } = useToast()

  // Refs
  const modelCreateButtonRef = useRef<HTMLLabelElement>(null);
  const modelUpdateButtonRef = useRef<HTMLLabelElement>(null);

  // Create New Item
  const [itemName, setItemName] = useState("")
  const [itemCategoryId, setItemCategoryId] = useState(0)

  async function addItem() {
    const response = await fetch('/api/item', {
      method: 'POST',
      body: JSON.stringify({ name: itemName, categoryId: itemCategoryId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.status === 200) {
      setToast("Item is created successfully", "success");
      modelCreateButtonRef.current?.click();
      router.replace(router.asPath);
      setItemName("");
    } else if (response.status === 400) {
      const message = await response.json();
      setToast(message.details[0].message, "warning")
    }
  }

  // Delete category
  async function deleteCategory(id: number) {
    const response = await fetch(`/api/category/${id}`, {
      method: 'DELETE',
    })
    if (response.status === 200) {
      setToast("Item is deleted successfully", "info")
      router.replace(router.asPath);
    } else if (response.status === 404) {
    }
  }

  // Edit a category
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<number>()

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
      const message = await response.json();
      setToast(message.details[0].message, "warning")
    }
  }

  return (
    <>
      <div className="flex justify-between mb-3">
        <h1 className="text-3xl font-semibold">Item List</h1>
        <label htmlFor="item-create-modal" className="btn btn-success" ref={modelCreateButtonRef}>Add Item<AddIcon /></label>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full mb-3">
          {/* head */}
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? items.map((item, i) => (
              <tr className="hover" key={`${item.id}&${i}`}>
                <th>{item.id}</th>
                <td>{item.name}</td>
                <td>{item.category?.name}</td>
                <td>{item.createdAt}</td>
                <td>{item.createdAt}</td>
                <td>
                  <label htmlFor="item-update-modal" className="btn btn-square btn-sm btn-info mr-2" onClick={() => updateCategoryModal(item.name, item.id)} ref={modelUpdateButtonRef}><PencilIcon /></label>
                  <button className="btn btn-square btn-sm btn-error mr-2" onClick={() => deleteCategory(item.id)}><TrashIcon /></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={12} className="text-center">No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {
        items.length !== 0 && <Pagination pageCount={pageCount} />
      }

      {/* Model to create item*/}
      <Modal id="item-create-modal">
        <h3 className="text-lg font-bold">Add a New Item</h3>
        <input type="text" name="itemName" id="itemName" className="input input-bordered w-full mt-3" placeholder="Add New Item" value={itemName} onChange={e => setItemName(e.target.value)} />
        <select className="select select-bordered block w-full mt-3" title="Select your category" onChange={e => setItemCategoryId(Number(e.target.value))}>
          <option disabled selected defaultValue="Pick your category">Pick your category</option>
          {categories.map((category, i) => (
            <option key={`${category}${i}`} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button className="btn btn-success float-right mt-3" type="button" onClick={addItem}>Add <AddIcon /></button>
      </Modal >

      {/* Modal to edit category */}
      < Modal id="item-update-modal" >
        <h3 className="text-lg font-bold">Edit a Category</h3>
        <input type="text" name="itemUpdate" id="itemUpdate" className="input input-bordered w-full mt-3" placeholder="Edit item" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
        <button className="btn btn-success float-right mt-3" type="button" onClick={() => updateCategory(editingCategoryId)}>Edit <PencilIcon /></button>
      </Modal >
      <Toast {...toastState} />
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const take = 8;
  const pageCount = Math.ceil((await prisma.item.findMany()).length / take)

  const session = await getServerSession(context.req, context.res, authOptions);

  // Get items from db
  const items = await prisma.item.findMany({
    take,
    skip: getPageSkip(Number(context.query?.page), take),
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    where: {
      userId: session?.user.id
    }
  })

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    }
  })

  const modifiedItems = items.map(item => {
    return {
      ...item,
      createdAt: useChangeDateFormat(item.createdAt),
      updatedAt: useChangeDateFormat(item.updatedAt)
    }
  })

  return {
    props: {
      items: JSON.parse(JSON.stringify(modifiedItems)),
      categories,
      pageCount
    }
  }
}