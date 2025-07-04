import type { userTypes, Vehicle } from '@/types/alltypes'
import axios from 'axios'
import { API_BASE_URL } from './BaseUrl'

// GET all users
export const getUsers = async (): Promise<userTypes[]> => {
  const response = await axios.get(`${API_BASE_URL}/users`)
  return response.data
}

// GET user by ID
export const getUserById = async (id: string): Promise<userTypes> => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`)
  return response.data
}

// CREATE user
export const createUser = async (
  userData: Partial<userTypes>,
): Promise<userTypes> => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData)
  return response.data
}

// UPDATE user
export const updateUser = async (
  id: string,
  userData: Partial<userTypes>,
): Promise<userTypes> => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData)
  return response.data
}

// DELETE user
export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${id}`)
}











//GET all Vehicles
export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await axios.get(`${API_BASE_URL}/vehicle`)
  return response.data
}
// GET Vehicles by ID
export const getVehiclesById = async (id: string): Promise<Vehicle> => {
  const response = await axios.get(`${API_BASE_URL}/vehicle/${id}`)
  return response.data
}

// CREATE Vehicles
export const createVehicles = async (
  userData: Partial<Vehicle>,
): Promise<Vehicle> => {
  const response = await axios.post(`${API_BASE_URL}/vehicle`, userData)
  return response.data
}

// UPDATE Vehicles
export const updateVehicles = async (
  id: string,
  userData: Partial<Vehicle>,
): Promise<Vehicle> => {
  const response = await axios.put(`${API_BASE_URL}/vehicle/${id}`, userData)
  return response.data
}

// DELETE Vehicles
export const deleteVehicles = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/vehicle/${id}`)
}