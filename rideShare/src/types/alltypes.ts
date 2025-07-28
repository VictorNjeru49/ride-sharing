export interface GenericsType {
  id: string
}

export enum UserRole {
  RIDER = 'rider',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum WalletTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum SupportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'inprogress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum RideCancelBy {
  RIDER = 'rider',
  DRIVER = 'driver',
  SYSTEM = 'system',
}

export enum NotifyStatus {
  RIDE_STATUS = 'ridestatus',
  PAYMENT = 'payment',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}
export enum DriverLocationStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
}
export enum devicestatus {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}
export enum superRole {
  MODERATOR = 'moderator',
  SUPERVISOR = 'supervisor',
  SUPERADMIN = 'superadmin',
}

// Define enum for payment methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  STRIPE_CHECKOUT = 'stripe_checkout',
  
}

// Define enum for payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
  SESSION_RETRIEVED = 'session_retrieved',
  
}
export interface userTypes extends GenericsType {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: UserRole
  hashedRefreshToken?: string
  isVerified: boolean
  provider?: string
  providerId?: string
  profilePicture?: string
  walletBalance: number
  createdAt?: Date
  updatedAt?: Date

  riderProfile?: RiderProfile
  driverProfile?: DriverProfile
  adminProfile?: Admin

  payments?: Payment[]
  ratingsGiven?: Rating[]
  ratingsReceived?: Rating[]
  walletTransactions?: Wallet[]
  RideFeedbacks?: RideFeedback[]
  SupportTickets?: SupportTicket[]
  notifications?: Notification[]
  devices?: Device[]
  promoUsages?: UserPromoUsage[]
  createdPromoCodes?: PromoCode[]
  driverLocations?: DriverLocation[]
  cancel?: Ridecancel[]
}

export interface Notification extends GenericsType {
  type: NotifyStatus
  message: string
  isRead: boolean
  createdAt?: Date
  user?: userTypes
}
export interface Vehicle extends GenericsType {
  vehicleImage: string
  make: string
  model: string
  plateNumber: string
  rentalrate: number
  color: string
  capacity: number
  year: number
  available: boolean
  vehicleType: string
  createdAt?: Date
  updatedAt?: Date
  driver?: DriverProfile
}
export interface RiderProfile {
  id: string
  preferredPaymentMethod?: string
  rating?: number
  createdAt?: Date
  updatedAt?: Date
  user?: userTypes
  rideRequests?: Riderequest[]
  ridesTaken?: Ride[]
  riderHistory?: DriverLocation[]
}
export interface DriverProfile extends GenericsType {
  user?: userTypes
  licenseNumber?: string
  rating?: number
  isAvailable?: boolean
  createdAt?: Date
  updatedAt?: Date
  vehicle?: Vehicle
  ridesOffered?: Ride[]
  ridesTaken?: Ride[]
  assignedRequests?: Riderequest[]
  locationHistory?: DriverLocation[]
}

export interface Ridecancel extends GenericsType {
  cancelledBy?: RideCancelBy
  reason: string
  cancelledAt: Date
  ride?: Ride
  user?: userTypes
}
export interface Riderequest extends GenericsType {
  rider?: RiderProfile
  assignedDriver?: DriverProfile
  riderId: string
  assignedDriverId: string | null
  pickupLocationId: string
  dropoffLocationId: string
  pickupLocation?: Location
  dropoffLocation?: Location
  status: string
  preferredVehicleType?: string
  requestedAt: Date
  feedbacks: RideFeedback[]

}
export interface Ride extends GenericsType {
  rider?: RiderProfile
  driver?: DriverProfile
  pickupLocation: Location
  dropoffLocation: Location
  status: string
  fare: number
  distanceKm: number
  startTime: Date
  endTime: Date
  createdAt: Date
  payment: Payment
  ratings: Rating[]
  cancellation: Ridecancel
}
export interface Payment extends GenericsType {
  ride: Ride
  user: userTypes
  userId?: string
  rideId?: string
  amount?: number
  clientSecret?: string
  currency: string
  method?: PaymentMethod
  stripeCheckoutSessionId?: string
  stripePaymentIntentId?: string
  status?: PaymentStatus
  paidAt?: Date
  vehicle: Vehicle
  createdAt?: Date
}
export interface Rating extends GenericsType {
  ride: Ride
  rater: userTypes
  ratee: userTypes
  score: number
  comment: string
  createdAt: Date
}
export interface Location {
  id: string
  address: string
  latitude: number
  longitude: number
  ridesPickup: Ride[]
  ridesDropoff: Ride[]
  requestsPickup: Riderequest[]
  requestsDropoff: Riderequest[]
  driverlocation: DriverLocation
}
export interface Wallet extends GenericsType {
  type: WalletTransactionType
  amount: number
  description: string
  createdAt?: Date
}
export interface SupportTicket extends GenericsType {
  issueType: string
  description: string
  status: SupportStatus
  createdAt: Date
  updatedAt: Date
  user: userTypes
}
export interface Device extends GenericsType {
  deviceToken: string
  deviceType: devicestatus
  lastActive: Date
  createdAt: Date
  user: userTypes
}
export interface RideFeedback {
  id?: string
  feedbackText: string
  submittedAt: Date
  user?: userTypes
  Riderequest: Riderequest;
}
export interface UserPromoUsage extends GenericsType {
  usedAt: Date
  user: userTypes
  PromoCode: PromoCode
}
export interface Admin extends GenericsType {
  role?: superRole
  userId?: string
  permission?: string | string[]
  user?: userTypes
}
export interface PromoCode extends GenericsType {
  code: string
  discountAmount: number
  usageLimit: number
  expirationDate: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  usages: UserPromoUsage[]
  createdBy: userTypes[]
}
export interface DriverLocation extends GenericsType {
  status: DriverLocationStatus
  preferredVehicleType: string
  requestedAt: Date
  driver: userTypes
  driverProfile: DriverProfile
  location: Location
}
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

export interface globalDataType {
  isVerified?: boolean
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: {
    id: string
    email: string
    role: UserRole
  }
  avatar?: userTypes
}

