import { useEffect, useState } from "react";
import useChangeDateFormat from "../hooks/useChangeDateFormat";

export default function LocalTime({ time }: { time: Date | string }) {
  const [modifiedDate, setModifiedDate] = useState("")
  useEffect(() => {
    setModifiedDate(useChangeDateFormat(time))
  }, [])
  return (
    <>
      {modifiedDate}
    </>
  )
}
