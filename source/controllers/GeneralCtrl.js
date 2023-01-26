import Cookies from 'universal-cookie';

import { randomAmong } from './SpecialCtrl'

import store from '../store/store';

import { sendXMessage } from './MessageCtrl';

export const processCookies = () => {

  const cookies = new Cookies()

  const allowedCookies = cookies.get('allow-cookies') === 'true'

  if (allowedCookies !== true) {

    const unsubscribe = store.subscribe(() => {

      if (store.getState().user.tested === true) {

        unsubscribe()

        setTimeout(async () => {

          const xMessg = await sendXMessage({

            heading: { text: "Cookies Settings", style: {} },

            content: { text: "We use cookies primarily for authentication and combined with other technologies to provide you with a better user experience. \nBy Clicking 'Accept Cookies', you agree to our cookie policy", style: { textAlign: 'left' } },

            buttons: [

              { text: 'Accept Cookies', waitFor: 'allowed', style: { backgroundColor: '#2e2e52' } }

            ],

            style: {}

          })

          if (xMessg === 'allowed') { cookies.set('allow-cookies', true, { path: '/', expires: new Date(90 ** 7) }) }

        }, randomAmong(4000, 10000));

      }

    })

  }

}

export const getSectionOpenStatus = sectionID => {
  if (typeof window !== "undefined") {
    let localDataString = JSON.parse(localStorage.getItem("sections-open"))
    if (!localDataString || !Array.isArray(localDataString)) {
      // Create a new object
      localDataString = [
        { id: sectionID, open: true }
      ]
      // Save the object to ls
      localStorage.setItem("sections-open", JSON.stringify(localDataString))
      // Return Default True
      return true
    }

    let sectionData = localDataString.find(sec => sec.id === sectionID)

    if (!sectionData) {
      // Add the section as true
      localDataString.push({ id: sectionID, open: true })
      // Save the object to ls
      localStorage.setItem("sections-open", JSON.stringify(localDataString))
      // Return Default True
      return true
    }

    return sectionData.open
  } else { return true }
}

export const toggleSectionOpenStatus = sectionID => {
  if (typeof window !== "undefined") {
    let localDataString = JSON.parse(localStorage.getItem("sections-open"))
    if (!localDataString || !Array.isArray(localDataString)) {
      // Create a new object
      localDataString = [
        { id: sectionID, open: true }
      ]
      // Save the object to ls
      localStorage.setItem("sections-open", JSON.stringify(localDataString))
      // Return Default True
      return true
    }

    let newSectionData = localDataString.map(sec => {
      if (sec.id === sectionID) { return { ...sec, open: !sec.open } }
      else { return sec }
    })
    let sectionData = newSectionData.find(sec => sec.id === sectionID)

    if (!sectionData) {
      // Add the section as true
      localDataString.push({ id: sectionID, open: true })
      // Save the object to ls
      localStorage.setItem("sections-open", JSON.stringify(localDataString))
      // Return Default True
      return true
    }

    localStorage.setItem("sections-open", JSON.stringify(newSectionData))
    return sectionData.open
  } else { return true }
}
