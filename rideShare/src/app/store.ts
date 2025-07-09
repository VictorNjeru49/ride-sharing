// store.ts
import { Store } from '@tanstack/store'
import { UserRole, type globalDataType } from '@/types/alltypes'

const initialStorage: globalDataType = {
  isVerified: false,
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  user: {
    id: '',
    email: '',
    role: UserRole.RIDER,
  },
}

export const authStore = new Store<globalDataType>(initialStorage)

const saveToLocalStorage = (data: globalDataType) => {
  localStorage.setItem('auth', JSON.stringify(data))
  localStorage.setItem('accessToken', data.tokens.accessToken)
  localStorage.setItem('refreshToken', data.tokens.refreshToken)
}

const getAuthFromStorage = (): globalDataType | null => {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('Invalid auth JSON in localStorage:', e)
    return null
  }
}

export const authActions = {
  initializeUser: () => {
    const stored = getAuthFromStorage()
    if (stored) authStore.setState(stored)
  },

  saveUser: (data: globalDataType) => {
    const newState: globalDataType = {
      isVerified: true,
      tokens: {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role ?? UserRole.RIDER,
      },
    }
    authStore.setState(newState)
    saveToLocalStorage(newState)
  },

  saveAccessToken: (accessToken: string) => {
    const state = authStore.state
    const updated = {
      ...state,
      tokens: {
        ...state.tokens,
        accessToken,
      },
    }
    authStore.setState(updated)
    saveToLocalStorage(updated)
  },

  deleteUser: () => {
    authStore.setState(initialStorage)
    localStorage.removeItem('auth')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
}
