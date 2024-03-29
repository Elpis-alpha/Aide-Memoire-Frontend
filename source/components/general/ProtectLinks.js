import { useRouter } from 'next/router'

import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { authLink, protectedLinks, treeLinks } from '../../__env';

import { setShowNav, setRevealView, setShowTree, setIsVerify } from '../../store/slice/displaySlice';


const ProtectLinks = () => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { available, tested } = useSelector(store => store.user)

  useEffect(() => {

    const handleRouteChange = url => {

      let isProtected = false

      let isTree = false

      if (url === authLink) dispatch(setIsVerify(true))

      else if (url.includes('/public/')) dispatch(setIsVerify(true))

      else if (!tested) dispatch(setIsVerify(false))

      protectedLinks.forEach(link => {

        if (link.split('*').length === 2 && url.startsWith(link.slice(0, -1))) {

          isProtected = true

        } else if (link === url || url.startsWith(link + '?') || url.startsWith(link + '/?')) {

          isProtected = true

        }

      })

      if (url === '/verify') { dispatch(setShowNav(false)) }

      else { dispatch(setShowNav(true)) }


      treeLinks.forEach(link => {

        if (link.split('*').length === 2 && url.startsWith(link.slice(0, -1))) {

          isTree = true

        } else if (link === url || url.startsWith(link + '?') || url.startsWith(link + '/?')) {

          isTree = true

        }

      })

      if (isTree) { dispatch(setShowTree(true)) }

      else { dispatch(setShowTree(false)) }

      if (!tested && isProtected) { return dispatch(setRevealView(false)) }

      if (isProtected === true && available === false) { router.push(authLink); return dispatch(setRevealView(false)) }

      dispatch(setRevealView(true))

    }

    handleRouteChange(router.asPath)

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {

      router.events.off('routeChangeComplete', handleRouteChange)

    }

  }, [available, tested, dispatch, router])

  return <></>

}

export default ProtectLinks
