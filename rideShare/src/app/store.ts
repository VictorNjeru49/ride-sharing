import type { globalDataType } from '@/types/alltypes'
import { UserRole } from '../types/alltypes'
import { Store } from '@tanstack/store'

const initialStorage: globalDataType = {
  isVerified: false,
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  user: {
    email: '',
    id: '',
    role: UserRole.RIDER,
  },
}
export const authStore = new Store<globalDataType>(initialStorage)

export const localStorageJson = () => {
    const localData = localStorage.getItem('auth')
    let jsonData;
    if (localData) jsonData = JSON.parse(localData)
    return jsonData
}

export const authActions = {
  saveUser: (data: globalDataType) => {
    authStore.setState({
      isVerified: true,
      tokens: data.tokens,
      user: data.user,
    })
    localStorage.setItem('auth', JSON.stringify({ ...data, isVerfied: true }))
  },
  deleteUser: () => {
    authStore.setState(initialStorage)
    localStorage.removeItem('auth')
  },
  intializeUser: () => {
    const userData = localStorage.getItem('auth')
    console.log('userData localstorage', userData)
    if (!userData) return
    const json_data = JSON.parse(userData)
    console.log('json data user', json_data)
    authStore.setState(json_data)
  },
  // saving new access token
  saveAccessToken: (token: string) => {
    console.log('data from localstorage', localStorageJson)
    console.log('received token', token)
    console.log('state before update', authStore.state)

    // authStore.setState(authStore.state);
    // localStorage.setItem('auth', JSON.stringify(authStore.state));
  },
}