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
}

// Define enum for payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
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

  ridesOffered?: Ride[]
  ridesTaken?: Ride[]
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
  DriverLocations?: DriverLocation[]
}

export interface Notification extends GenericsType {
  type: NotifyStatus
  message: string
  isRead: boolean
  createdAt: Date
  user: userTypes
}
export interface Vehicle extends GenericsType {
  vehicleImage: string
  make: string
  model: string
  plateNumber: string
  color: string
  available: boolean
  capacity: number
  year: number
  vehicleType: string
  createdAt?: Date
  updatedAt?: Date
}
export interface RiderProfile extends GenericsType {
  preferredPaymentMethod?: string
  rating: number
  createdAt: Date
  updatedAt: Date
  user: userTypes
  rideRequests: Riderequest[]
  ridesTaken: Ride[]
}
export interface DriverProfile extends GenericsType {
  user: userTypes
  licenseNumber: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
  vehicle: Vehicle
  ridesOffered: Ride[]
  assignedRequests: Riderequest[]
  locationHistory: DriverLocation[]
}

export interface Ridecancel extends GenericsType {
  cancelledBy: RideCancelBy
  reason: string
  cancelledAt: Date
  ride: Ride
  user: userTypes
}
export interface Riderequest extends GenericsType {
  rider: RiderProfile
  assignedDriver: DriverProfile
  pickupLocation: Location
  dropoffLocation: Location
  status: string
  preferredVehicleType: string
  requestedAt: Date
}
export interface Ride extends GenericsType {
  rider: RiderProfile
  driver: DriverProfile
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
  feedbacks: RideFeedback[]
}
export interface Payment extends GenericsType {
  ride: Ride
  user: userTypes
  amount: number
  currency: string
  method: PaymentMethod
  stripePaymentIntentId?: string
  status: PaymentStatus
  paidAt: Date
  createdAt: Date
}
export interface Rating extends GenericsType {
  ride: Ride
  rater: userTypes
  ratee: userTypes
  score: number
  comment: string
  createdAt: Date
}
export interface Location extends GenericsType{
  address: string
  latitude: number
  longitude: number
  ridesPickup: Ride[]
  ridesDropoff: Ride[]
  requestsPickup: Riderequest[]
  requestsDropoff: Riderequest[]
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
export interface RideFeedback extends GenericsType {
  feedbackText: string
  submittedAt: Date
  user: userTypes
  ride: Ride
}
export interface UserPromoUsage extends GenericsType {
  usedAt: Date
  user: userTypes
  PromoCode: PromoCode
}
export interface Admin extends GenericsType {
  role: superRole
  permission: string[]
  user: userTypes
}
export interface PromoCode extends GenericsType {
  code: string
  discountAmount: number
  usageLimit: number
  expirationDate: Date
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
}
export interface LoginPayload{
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
export interface VehicleSpecification {
  engine: string
  transmission: 'Automatic' | 'Manual'
  fuelType: 'Gasoline' | 'Diesel' | 'Electric'
  mileage: number
  color: string
  condition: 'New' | 'Used'
}
export interface Vehicles extends VehicleSpecification {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number
  category: string
  image: string
  description: string
  features: string[]
}
