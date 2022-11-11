import { useSelector } from "react-redux"


const AuthControl = ({ ...props }) => {

  const { tested } = useSelector(store => store.user)

  const { revealView, isVerify } = useSelector(store => store.display)

	return (

		<>{((tested && revealView) || isVerify) ? props.children : <></>}</>

	)

}

export default AuthControl
