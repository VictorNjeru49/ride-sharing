export interface GenericsType {
  id: string
}

export enum UserRole {
  RIDER = 'rider',
  DRIVER = 'driver',
  ADMIN = 'admin'
}


export interface userTypes extends GenericsType {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: UserRole
  hashedRefreshToken: string
  isVerified: boolean
  provider: string
  providerId: string
  profilePicture: string
  walletBalance: number
  createdAt: Date
  updatedAt: Date
  riderProfile: Riderprofile
  driverProfile: Driverprofile
  rideRequests: Riderequest[]
  ridesOffered: Ride[]
  ridesTaken: Ride[]
  payments: Payment[]
  ratingsGiven: Rating[]
  ratingsReceived: Rating[]
  walletTransactions: Wallet[]
  rideFeedbacks: Ridefeedback[]
  supportTickets: Supportticket[]
  notifications: Notification[]
  devices: Device[]
  promoUsages: Userpromousage[]
  adminProfile: Admin
  createdPromoCodes: Promocode[]
  driverLocations: Driverlocation[]
}

export interface Vehicle extends GenericsType {
  vehicleImage: string
  make: string
  model: string
  plateNumber: string
  color: string
  capacity: number
  year: number
  vehicleType: string
  createdAt?: Date
  updatedAt?: Date
}
export interface Riderprofile extends GenericsType {}
export interface Driverprofile extends GenericsType {}
export interface Riderequest extends GenericsType {}
export interface Ride extends GenericsType {}
export interface Payment extends GenericsType {}
export interface Rating extends GenericsType {}
export interface Wallet extends GenericsType {}
export interface Supportticket extends GenericsType {}
export interface Device extends GenericsType {}
export interface Ridefeedback extends GenericsType {}
export interface Userpromousage extends GenericsType {}
export interface Admin extends GenericsType {}
export interface Promocode extends GenericsType {}
export interface Driverlocation extends GenericsType {}
export interface LoginPayload {
  email: string
  phone?: string
  password: string
}

export interface LoginResponse {
  isVerified?: boolean
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: {
    id: string
    email: string
    phone: string
    role?: UserRole
  }
}

export interface globalDataType{
  isVerified?: boolean;
      tokens: {
      accessToken: string
      refreshToken: string
    }
    user: {
      id: string;
      email: string
      role: UserRole
    }
  }