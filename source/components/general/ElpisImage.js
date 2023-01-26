import { useEffect, useRef } from "react"
import { reformImage } from "../../controllers/SpecialCtrl"

const ElpisImage = ({ src, alt = "", title = "", removeNext = true }) => {
  const imageRef = useRef(null)
  useEffect(() => { reformImage(imageRef.current, removeNext) }, [removeNext])
  return <img src={src} alt={alt} title={title} ref={imageRef} />
}

export default ElpisImage