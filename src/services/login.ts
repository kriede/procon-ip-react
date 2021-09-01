import axios from "axios"

export function isLoggedIn() : boolean {
  return localStorage.SPCauth && localStorage.SPCauth !== ''
}

export const currentUser = {
  username: localStorage.SPCuser,
  password: localStorage.SPCpass
}

export async function login(username: string, password: string) {
  const result = await axios.get("/usr/passwd.ini", {
    auth: currentUser
  })
  if (result.status === 404) {
    logout()
    throw new Error('invalid username or password')
  } else if (result.status === 200) {
    currentUser.username = localStorage.SPCuser = username
    currentUser.password = localStorage.SPCpass = password
    localStorage.SPCauth = btoa(username + ':' + password)
  }
}

export async function logout() {
  currentUser.username = localStorage.SPCuser = ''
  currentUser.password = localStorage.SPCpass = ''
  localStorage.SPCauth = ''
}
