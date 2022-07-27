import styled from "styled-components"

import { useSelector } from "react-redux"


const BigWrapper = ({ ...props }) => {

  const { tested } = useSelector(store => store.user)

  const { revealView, isVerify } = useSelector(store => store.display)

  const clickStar = e => {

    const star = e.currentTarget

    if (star.style.top.length > 0) { return star.remove() }

    star.style.top = star.offsetTop + "px"

    star.style.left = star.offsetLeft + "px"

    star.style.animation = "none"

  }

  return (

    <BigWrapperStyle>

      {((tested && revealView) || isVerify) ? props.children : <></>}

      <img onClick={clickStar} className="spex-flyer -h1010-btx-01" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-02" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-03" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-04" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-05" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-06" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-07" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-08" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-09" src="/images/star-100.png" alt="" />

      <img onClick={clickStar} className="spex-flyer -h1010-btx-10" src="/images/star-100.png" alt="" />

    </BigWrapperStyle>

  )

}

const BigWrapperStyle = styled.div`
  z-index: 10;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;

  img.spex-flyer{
    width: 1pc;
    position: fixed;
    opacity: .4;
    cursor: crosshair;
    top: 0; left: 0;

    &.-h1010-btx-01{animation: spin-me-fx-1 50s linear infinite}
    &.-h1010-btx-02{animation: spin-me-fx-2 30s linear infinite}
    &.-h1010-btx-03{animation: spin-me-fx-3 80s linear infinite}
    &.-h1010-btx-04{animation: spin-me-fx-4 70s linear infinite}
    &.-h1010-btx-05{animation: spin-me-fx-5 40s linear infinite}
    &.-h1010-btx-06{animation: spin-me-fx-6 100s linear infinite}
    &.-h1010-btx-07{animation: spin-me-fx-7 70s linear infinite}
    &.-h1010-btx-08{animation: spin-me-fx-8 90s linear infinite}
    &.-h1010-btx-09{animation: spin-me-fx-9 120s linear infinite}
    &.-h1010-btx-10{animation: spin-me-fx-10 63s linear infinite}
  }
`

export default BigWrapper
