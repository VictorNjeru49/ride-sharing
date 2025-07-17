// src/app/authPersistence.ts
import {jwtDecode} from 'jwt-decode'
import { authStore } from './store'
import type { globalDataType } from '@/types/alltypes'

const STORAGE_KEY = {
  auth: 'auth',
  user: 'user',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}

/* ------------------------------------------------------------------ */
/* 🟢 1) Hydrate store on first load                                   */
/* ------------------------------------------------------------------ */
export function hydrateAuthStore(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY.auth)
    if (!raw) return
    const parsed = JSON.parse(raw) as globalDataType
    authStore.setState(parsed)
  } catch (err) {
    console.error('[authPersistence] invalid JSON in localStorage', err)
    localStorage.removeItem(STORAGE_KEY.auth)
  }
}

/* ------------------------------------------------------------------ */
/* 🟡 2) Persist every subsequent change                               */
/* ------------------------------------------------------------------ */
export function subscribeAuthPersistence(): void {
  let initial = true
  authStore.subscribe((state) => {
    // Skip the very first call (hydration), it’s already in LS
    if (initial) {
      initial = false
      return
    }
    localStorage.setItem(STORAGE_KEY.auth, JSON.stringify(state))
  })
}

/* ------------------------------------------------------------------ */
/* 🔐 3) Helper – is the user logged‑in (and token not expired)?       */
/* ------------------------------------------------------------------ */
export function isLoggedIn(): boolean {
  const { tokens, user } = authStore.state
  if (!tokens.accessToken || !user.id) return false

  try {
    const { exp } = jwtDecode<{ exp: number }>(tokens.accessToken)
    if (exp && exp * 1000 < Date.now()) {
      return false // token expired
    }
  } catch {
    return false // invalid JWT
  }
  return true
}

/* ------------------------------------------------------------------ */
/* 🛠 4) Call these once in your main entry                            */
/* ------------------------------------------------------------------ */

