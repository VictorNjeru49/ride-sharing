import { getNewToken } from '@/api/LoginApi'
import { authActions, authStore } from '@/app/store'
import { jwtDecode } from 'jwt-decode'
interface JwtPayload {
  exp: number
  [key: string]: any
}

const checkTokenExpired = (token: string) => {
  try {
    const decode = jwtDecode<JwtPayload>(token)
    const now = Math.floor(Date.now() / 1000)
    return decode.exp < now
  } catch (error) {
    return true
  }
}

export const VerifyToken = async () => {
    const tokens = authStore.state.tokens
    if(!tokens.accessToken || !tokens.refreshToken) {
        authActions.deleteUser()
        return null
    }
    const isTokenExpired = checkTokenExpired(tokens.accessToken)
    if(!isTokenExpired) {
        return tokens.accessToken
    }
    try{
        const newToken = await getNewToken()
        authStore.state.tokens.accessToken = newToken
        return newToken
    }catch(error) {
        authActions.deleteUser()
          console.error('error from getting tokens', error)
    }
}