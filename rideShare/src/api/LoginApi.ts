import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { API_BASE_URL } from './BaseUrl'
import type { LoginPayload, LoginResponse } from '@/types/alltypes'



const loginFn = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_BASE_URL}/auth/login`,
    {

    ...payload,
    },
  )
  console.log(response.data)
  return response.data
}

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginPayload
> => {
  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
        console.log(data.tokens)
      toast.success(`Welcome, ${data.user.email}!`)
      // Save token in localStorage or context
      localStorage.setItem('auth', JSON.stringify(data.tokens))
      localStorage.setItem('accesstoken', data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.tokens.refreshToken)
    },
    onError: (error: any) => {
      toast.error(
        `Login failed: ${error?.response?.data?.message || error.message}`,
      )
    },
  })
}
