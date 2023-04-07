import { useState } from "react";
import { ToastType } from "../components/Toast";

export default function useToast() {
  const [isShown, setIsShown] = useState(false)
  const [message, setMessage] = useState("")
  const [color, setColor] = useState<ToastType["color"]>(null);

  function setToast(toastMessage: string, toastType: ToastType["color"] = "success", isToastShown: boolean = true) {
    setIsShown(isToastShown);
    setMessage(toastMessage);
    setColor(toastType)
  }

  return { isShown, setIsShown, message, color, setColor, setToast }
}