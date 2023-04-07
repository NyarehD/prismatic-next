import React from 'react'

interface ModalType {
  children: React.ReactNode
  id: string
}
export default function Modal({ children, id }: ModalType) {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <label htmlFor={id} className="btn btn-sm btn-square right-5 top-5 absolute">✕</label>
          {children}
        </label>
      </label>
    </>
  )
}
