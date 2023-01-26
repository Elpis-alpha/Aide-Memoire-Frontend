import { backendLocation } from './__env'


// User Routes
export const createUser = () => `${backendLocation}/api/users`

export const getUser = () => `${backendLocation}/api/users/user`

export const editUser = () => `${backendLocation}/api/users/user`

export const deleteUser = () => `${backendLocation}/api/users/user`

export const getUserbyID = (userID) => `${backendLocation}/api/users/id/${userID}`

export const getUserbyEmail = (email) => `${backendLocation}/api/users/email/${email}`

export const changePassword = () => `${backendLocation}/api/users/user/password`

export const sendVerificationEmail = () => `${backendLocation}/api/users/user/verify`

export const uploadAvatar = () => `${backendLocation}/api/users/user/avatar`

export const deleteAvatar = () => `${backendLocation}/api/users/user/avatar`

export const getUserPicture = (userID, size = 'small') => `${backendLocation}/api/users/pic-id/${userID}/avatar?size=${size}`

export const userExistence = (email) => `${backendLocation}/api/users/user/exists?email=${email}`

export const loginUser = () => `${backendLocation}/api/users/login`

export const logoutUser = () => `${backendLocation}/api/users/logout`

export const logoutUserAll = () => `${backendLocation}/api/users/logout/all`


// Note Routes
export const createNote = () => `${backendLocation}/api/note/create`

export const getPrivateNote = () => `${backendLocation}/api/note/get-private`

export const getNote = (noteID) => `${backendLocation}/api/note/retrieve/${noteID}`

export const getSpecialNote = (name) => `${backendLocation}/api/note/special-re/${name}`

export const getPublicNote = (noteID) => `${backendLocation}/api/note/public/retrieve/${noteID}`

export const getQNote = (q) => `${backendLocation}/api/note/get-notes/list/by-q?q=${q}`

export const getQANote = (q) => `${backendLocation}/api/note/get-notes/list/by-qa?q=${q}`

export const addNoteTag = (noteID) => `${backendLocation}/api/note/add-tag/${noteID}`

export const removeNoteTag = (noteID) => `${backendLocation}/api/note/remove-tag/${noteID}`

export const addSection = (noteID) => `${backendLocation}/api/note/add-section/${noteID}`

export const removeSection = (noteID) => `${backendLocation}/api/note/remove-section/${noteID}`

export const updateNote = (noteID) => `${backendLocation}/api/note/update/${noteID}`

export const getTagNotes = (tagID) => `${backendLocation}/api/note/get-notes/list/by-tag/${tagID}`

export const getTagNotesNA = (tagID) => `${backendLocation}/api/note/get-notes/list/by-tag-NA/${tagID}`

export const getSectionNotes = (sectionID) => `${backendLocation}/api/note/get-sec-notes/${sectionID}`

export const getPublicSectionNotes = (sectionID) => `${backendLocation}/api/note/get-pub-sec-notes/${sectionID}`

export const getPublicSectionNote = (sectionID, noteID) => `${backendLocation}/api/note/get-pub-sec-note/${sectionID}/${noteID}`

export const getFreeNotes = () => `${backendLocation}/api/note/get-free-notes/`

export const toggleNotePublic = (noteID) => `${backendLocation}/api/note/toggle-public/${noteID}`

export const deleteNote = (noteID) => `${backendLocation}/api/note/delete/${noteID}`


// Tag Routes
export const createTag = () => `${backendLocation}/api/tag/create`

export const getTagByID = (tagID) => `${backendLocation}/api/tag/retrieve-id/${tagID}`

export const getTagByName = (tagName) => `${backendLocation}/api/tag/retrieve-name?name=${tagName}`

export const filterTag = (tagName) => `${backendLocation}/api/tag/retrieve-filter/${tagName}`


// Section Routes
export const createSection = () => `${backendLocation}/api/section/create`

export const getPrivateSections = () => `${backendLocation}/api/section/get-private`

export const getSection = (sectionID) => `${backendLocation}/api/section/retrieve/${sectionID}`

export const updateSection = (sectionID) => `${backendLocation}/api/section/update/${sectionID}`

export const getPublicSection = (sectionID) => `${backendLocation}/api/section/retrieve-pub/${sectionID}`

export const toggleSectionOpen = (sectionID) => `${backendLocation}/api/section/toggle-open/${sectionID}`

export const toggleSectionPublic = (sectionID) => `${backendLocation}/api/section/toggle-public/${sectionID}`

export const deleteSection = (sectionID) => `${backendLocation}/api/section/delete/${sectionID}`


// Misc
export const convertToBuffer = (quality = 10, width = 500) => `${backendLocation}/api/to-img/pic?quality=${quality}&width=${width}`
