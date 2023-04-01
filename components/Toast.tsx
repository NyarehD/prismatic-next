import React, { useEffect, useState } from "react"

interface ToastType {
  children: React.ReactNode
  color: "info" | "success" | "warning" | "error" | null
  isShown: boolean
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Toast({ children, color, isShown, setIsShown }: ToastType) {
  const colorVariant = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }

  if (!isShown) return null
  return (
    <div className="toast">
      <div className={`alert ${color && colorVariant[color]}`}>
        <div>
          <span>{children}</span>
          <button className="btn btn-square btn-sm" onClick={() => setIsShown(false)} type="button" title="Close Toast">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}