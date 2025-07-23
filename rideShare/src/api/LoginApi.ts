import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { API_BASE_URL } from './BaseUrl'
import type { LoginPayload, LoginResponse } from '@/types/alltypes'
import { authStore } from '@/app/store'

interface ForgotPasswordResponse {
  message: string
}

interface VerifyOtpResponse {
  verified: boolean
  resetToken?: string // assuming your backend returns this for password reset
}

interface ResetPasswordResponse {
  message: string
  token: string
}

interface RegisterResponse {
  message: string
}
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
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('auth', JSON.stringify(data.tokens))
      localStorage.setItem('accessToken', data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.tokens.refreshToken)
    },
    onError: (error: any) => {
      toast.error(
        `Login failed: ${error?.response?.data?.message || error.message}`,
      )
    },
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await axios.get(`${API_BASE_URL}/auth/logout/${userId}`)
      return res.data
    },
    onSuccess: () => {
      // Clear all auth data from localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('auth')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      toast.success('You have been logged out.')
    },
    onError: (error: any) => {
      toast.error(
        `Logout failed: ${error?.response?.data?.message || error.message}`,
      )
    },
  })
}

export const getNewToken = async () => {
  const refreshToken = authStore.state.tokens.refreshToken
  const id = authStore.state.user.id
    if (!refreshToken || !id) {
      throw new Error('something is missing')
    }

    const response = await axios.get(`${API_BASE_URL}/auth/refresh${id}`)

    const result = await response.data
    return result
}




export const authApi = {
  // Send email or phone to initiate password reset
  forgotPassword: async (
    emailOrPhone: string,
  ): Promise<ForgotPasswordResponse> => {
    const response = await axios.post<ForgotPasswordResponse>(
      `${API_BASE_URL}/auth/forgot-password`,
      {
        emailOrPhone,
      },
    )
    return response.data
  },

  // Verify OTP sent to phone
  verifyOtp: async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await axios.post<VerifyOtpResponse>(
      `${API_BASE_URL}/auth/verify-opt`,
      {
        phone,
        otp,
      },
    )
    return response.data
  },

  // Reset password using token
  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<ResetPasswordResponse> => {
    const response = await axios.post<ResetPasswordResponse>(
      `${API_BASE_URL}/auth/reset-password`,
      {
        token,
        newPassword,
      },
    )
    return response.data
  },

  // Optional: Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      {
        email,
        password,
      },
    )
    return response.data
  },

  // Optional: Register
  register: async (
    userData: Record<string, any>,
  ): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/auth/register`,
      userData,
    )
    return response.data
  },

  // Optional logout placeholder if needed
  logout: async (): Promise<void> => {
    // If your backend supports logout
    await axios.post('/auth/logout')
  },
}
