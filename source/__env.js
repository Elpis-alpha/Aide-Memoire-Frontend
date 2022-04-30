// Static Variables
export const creator = "Elpis"

export const siteName = "Aide-mémoire"

export const siteDescription = "A web application (notebook) in which individuals create notes, edit notes, delete notes. Individuals can also make notes public for others to view without authentication to their account"

export const keywordx = ['elpis','aide','aide-mémoire','mémoire','aide','memoire','note','notebook','jotter','fun','design']

export const emailName = "Aide-mémoire"

export const hostEmail = "site.overseer.alpha@gmail.com"

export const protectedLinks = ["/", '/note*', '/section*', '/user*', '/tag/private*']

export const treeLinks = ["/", '/user*', '/section*', '/note*', '/tag/private*']

export const specialNotes = ["welcome"]

export const authLink = "/verify"


// Dynamic Variables
export const host = process.env.NEXT_PUBLIC_HOST

export const backendLocation = process.env.NEXT_PUBLIC_BACK_END

export const isProduction = process.env.NEXT_PUBLIC_BACK_END === "true"

export const complain = `${process.env.NEXT_PUBLIC_BACK_END}/complain`
