import type {
  Admin,
  Device,
  DriverLocation,
  DriverProfile,
  Payment,
  PromoCode,
  Rating,
  Ride,
  Ridecancel,
  RideFeedback,
  Riderequest,
  RiderProfile,
  SupportTicket,
  UserPromoUsage,
  Notification,
  userTypes,
  Vehicle,
  Location,
  Wallet,
} from '@/types/alltypes'
import axios from 'axios'
import { API_BASE_URL } from './BaseUrl'

//  ------------------------------------------------

//            CHATBOT  -> chatbot

// -------------------------------------------------


export const fetchBotReply = async (userMessage: string): Promise<string>  => {
  try {
    const response = await axios.post<{ reply: string }>(
      `${API_BASE_URL}/chatbot`,
      {
        message: userMessage,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    const {data} = await response
    return data.reply
  } catch (error) {
    console.error('fetchBotReply error:', error)
    return 'Sorry, something went wrong. Please try again later.'
  }
}




// -------------------------------------------------

//                 USERS  -> users

// ---------------------------------------------------


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

// GET user by ID or Email
export const getUserByIdOrEmail = async (identifier: string): Promise<userTypes> => {
  const response = await axios.get(`${API_BASE_URL}/users?email=${identifier}`)
  return response.data
}



// UPDATE user
export const updateUser = async (
  id: string,
  userData: Partial<userTypes>,
): Promise<userTypes> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/${id}`, userData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Backend error response:', error.response?.data)
      throw new Error(`Update failed: ${JSON.stringify(error.response?.data)}`)
    }
    throw error
  }
}


// DELETE user
export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${id}`)
}











// -------------------------------------------------

//                 VEHICLE -> vehicle

// ---------------------------------------------------

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
  vehicleData: Partial<Vehicle>,
): Promise<Vehicle> => {
  const response = await axios.post(`${API_BASE_URL}/vehicle`, vehicleData)
  return response.data
}

// UPDATE Vehicles
export const updateVehicles = async (
  id: string,
  vehicleData: Partial<Vehicle>,
): Promise<Vehicle> => {
  const response = await axios.patch(
    `${API_BASE_URL}/vehicle/${id}`,
    vehicleData,
  )
  return response.data
}

// DELETE Vehicles
export const deleteVehicles = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/vehicle/${id}`)
}






// -------------------------------------------------

//                 WALLET -> wallets

// ---------------------------------------------------

//GET all Wallet
export const getWallet = async (): Promise<Wallet[]> => {
  const response = await axios.get(`${API_BASE_URL}/wallets`)
  return response.data
}
// GET Wallet by ID
export const getWalletById = async (id: string): Promise<Wallet> => {
  const response = await axios.get(`${API_BASE_URL}/wallets/${id}`)
  return response.data
}

// CREATE Wallet
export const createWallet = async (
  walletData: Partial<Wallet>,
): Promise<Wallet> => {
  const response = await axios.post(`${API_BASE_URL}/wallets`, walletData)
  return response.data
}

// UPDATE Wallet
export const updateWallet = async (
  id: string,
  walletData: Partial<Wallet>,
): Promise<Wallet> => {
  const response = await axios.patch(`${API_BASE_URL}/wallets/${id}`, walletData)
  return response.data
}

// DELETE Wallet
export const deleteWallet = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/wallets/${id}`)
}












// -------------------------------------------------

//                 USER PROMO USAGE -> userpromousage

// ---------------------------------------------------

//GET all USER PROMO USAGE
export const getUserPromoUsage = async (): Promise<UserPromoUsage[]> => {
  const response = await axios.get(`${API_BASE_URL}/userpromousage`)
  return response.data
}
// GET USER PROMO USAGE by ID
export const getUserPromoUsageById = async (id: string): Promise<UserPromoUsage> => {
  const response = await axios.get(`${API_BASE_URL}/userpromousage/${id}`)
  return response.data
}

// CREATE USER PROMO USAGE
export const createUserPromoUsage = async (
  userpromousageData: Partial<UserPromoUsage>,
): Promise<UserPromoUsage> => {
  const response = await axios.post(`${API_BASE_URL}/userpromousage`, userpromousageData)
  return response.data
}

// UPDATE USER PROMO USAGE
export const updateUserPromoUsage = async (
  id: string,
  userpromousageData: Partial<UserPromoUsage>,
): Promise<UserPromoUsage> => {
  const response = await axios.patch(`${API_BASE_URL}/userpromousage/${id}`, userpromousageData)
  return response.data
}

// DELETE USER PROMO USAGE
export const deleteUserPromoUsage = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/userpromousage/${id}`)
}


















// -------------------------------------------------

//                 SUPPORT TICKET -> supportticket

// ---------------------------------------------------


//GET all  SUPPORT TICKET
export const getSupportTicket = async (): Promise<SupportTicket[]> => {
  const response = await axios.get(`${API_BASE_URL}/supportticket`)
  return response.data
}
// GET  SUPPORT TICKET by ID
export const getSupportTicketById = async (id: string): Promise<SupportTicket> => {
  const response = await axios.get(`${API_BASE_URL}/supportticket/${id}`)
  return response.data
}

// CREATE  SUPPORT TICKET
export const createSupportTicket = async (
  supportticketData: Partial<SupportTicket>,
): Promise<SupportTicket> => {
  const response = await axios.post(`${API_BASE_URL}/supportticket`, supportticketData)
  return response.data
}

// UPDATE  SUPPORT TICKET
export const updateSupportTicket = async (
  id: string,
  supportticketData: Partial<SupportTicket>,
): Promise<SupportTicket> => {
  const response = await axios.patch(`${API_BASE_URL}/supportticket/${id}`, supportticketData)
  return response.data
}

// DELETE  SUPPORT TICKET
export const deleteSupportTicket = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/supportticket/${id}`)
}


















// -------------------------------------------------

//                 RIDER PROFILE -> riderprofile

// ---------------------------------------------------

//GET all RIDER PROFILE
export const getRiderProfile = async (): Promise<RiderProfile[]> => {
  const response = await axios.get(`${API_BASE_URL}/riderprofile`)
  return response.data
}
// GET RIDER PROFILE by ID
export const getRiderProfileById = async (id: string): Promise<RiderProfile> => {
  const response = await axios.get(`${API_BASE_URL}/riderprofile/${id}`)
  return response.data
}

// CREATE RIDER PROFILE
export const createRiderProfile = async (
  riderprofileData: Partial<RiderProfile>,
): Promise<RiderProfile> => {
  const response = await axios.post(`${API_BASE_URL}/riderprofile`, riderprofileData)
  return response.data
}

// UPDATE RIDER PROFILE
export const updateRiderProfile = async (
  id: string,
  riderprofileData: Partial<RiderProfile>,
): Promise<RiderProfile> => {
  const response = await axios.patch(`${API_BASE_URL}/riderprofile/${id}`, riderprofileData)
  return response.data
}

// DELETE RIDER PROFILE
export const deleteRiderProfile = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/riderprofile/${id}`)
}



















// -------------------------------------------------

//                 RIDE REQUEST -> riderequest

// ---------------------------------------------------

// GET all Ride Requests
export const getRideRequests = async (): Promise<Riderequest[]> => {
  const response = await axios.get(`${API_BASE_URL}/riderequest`)
  return response.data
}

// GET Ride Request by ID
export const getRideRequestById = async (id: string): Promise<Riderequest> => {
  const response = await axios.get(`${API_BASE_URL}/riderequest/${id}`)
  return response.data
}

// CREATE Ride Request
export const createRideRequest = async (
  riderequestData: Partial<Riderequest>,
): Promise<Riderequest> => {
  const response = await axios.post(`${API_BASE_URL}/riderequest`, riderequestData)
  return response.data
}

// UPDATE Ride Request
export const updateRideRequest = async (
  id: string,
  riderequestData: Partial<Riderequest>,
): Promise<Riderequest> => {
  const response = await axios.patch(`${API_BASE_URL}/riderequest/${id}`, riderequestData)
  return response.data
}

// DELETE Ride Request
export const deleteRideRequest = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/riderequest/${id}`)
}



// -------------------------------------------------

//                 RIDE FEEDBACK  ->  ridefeedback

// ---------------------------------------------------

// GET all Ride Feedbacks
export const getRideFeedbacks = async (): Promise<RideFeedback[]> => {
  const response = await axios.get(`${API_BASE_URL}/ridefeedback`)
  return response.data
}

// GET Ride Feedback by ID
export const getRideFeedbackById = async (id: string): Promise<RideFeedback> => {
  const response = await axios.get(`${API_BASE_URL}/ridefeedback/${id}`)
  return response.data
}

// CREATE Ride Feedback
export const createRideFeedback = async (
  ridefeedbackData: Partial<RideFeedback>,
): Promise<RideFeedback> => {
  const response = await axios.post(`${API_BASE_URL}/ridefeedback`, ridefeedbackData)
  return response.data
}

// UPDATE Ride Feedback
export const updateRideFeedback = async (
  id: string,
  ridefeedbackData: Partial<RideFeedback>,
): Promise<RideFeedback> => {
  const response = await axios.patch(`${API_BASE_URL}/ridefeedback/${id}`, ridefeedbackData)
  return response.data
}

// DELETE Ride Feedback
export const deleteRideFeedback = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/ridefeedback/${id}`)
}



// -------------------------------------------------

//                 RIDE CANCEL -> ridecancel

// ---------------------------------------------------

// GET all Ride Cancels
export const getRideCancels = async (): Promise<Ridecancel[]> => {
  const response = await axios.get(`${API_BASE_URL}/ridecancel`)
  return response.data
}

// GET Ride Cancel by ID
export const getRideCancelById = async (id: string): Promise<Ridecancel> => {
  const response = await axios.get(`${API_BASE_URL}/ridecancel/${id}`)
  return response.data
}

// CREATE Ride Cancel
export const createRideCancel = async (
  ridecancelData: Partial<Ridecancel>,
): Promise<Ridecancel> => {
  const response = await axios.post(`${API_BASE_URL}/ridecancel`, ridecancelData)
  return response.data
}

// UPDATE Ride Cancel
export const updateRideCancel = async (
  id: string,
  ridecancelData: Partial<Ridecancel>,
): Promise<Ridecancel> => {
  const response = await axios.patch(`${API_BASE_URL}/ridecancel/${id}`, ridecancelData)
  return response.data
}

// DELETE Ride Cancel
export const deleteRideCancel = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/ridecancel/${id}`)
}



// -------------------------------------------------

//                 RIDE -> ride

// ---------------------------------------------------

// GET all Rides
export const getRides = async (): Promise<Ride[]> => {
  const response = await axios.get(`${API_BASE_URL}/ride`)
  return response.data
}

// GET Ride by ID
export const getRideById = async (id: string): Promise<Ride> => {
  const response = await axios.get(`${API_BASE_URL}/ride/${id}`)
  return response.data
}

// CREATE Ride
export const createRide = async (
  rideData: Partial<Ride>,
): Promise<Ride> => {
  const response = await axios.post(`${API_BASE_URL}/ride`, rideData)
  return response.data
}

// UPDATE Ride
export const updateRide = async (
  id: string,
  rideData: Partial<Ride>,
): Promise<Ride> => {
  const response = await axios.patch(`${API_BASE_URL}/ride/${id}`, rideData)
  return response.data
}

// DELETE Ride
export const deleteRide = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/ride/${id}`)
}



// -------------------------------------------------

//                 RATINGS -> ratings

// ---------------------------------------------------

// GET all Ratings
export const getRatings = async (): Promise<Rating[]> => {
  const response = await axios.get(`${API_BASE_URL}/ratings`)
  return response.data
}

// GET Rating by ID
export const getRatingById = async (id: string): Promise<Rating> => {
  const response = await axios.get(`${API_BASE_URL}/ratings/${id}`)
  return response.data
}

// CREATE Rating
export const createRating = async (
  ratingData: Partial<Rating>,
): Promise<Rating> => {
  const response = await axios.post(`${API_BASE_URL}/ratings`, ratingData)
  return response.data
}

// UPDATE Rating
export const updateRating = async (
  id: string,
  ratingData: Partial<Rating>,
): Promise<Rating> => {
  const response = await axios.patch(`${API_BASE_URL}/ratings/${id}`, ratingData)
  return response.data
}

// DELETE Rating
export const deleteRating = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/ratings/${id}`)
}



// -------------------------------------------------

//                 PROMO CODE -> promocode

// ---------------------------------------------------

// GET all Promo Codes
export const getPromoCodes = async (): Promise<PromoCode[]> => {
  const response = await axios.get(`${API_BASE_URL}/promocode`)
  return response.data
}

// GET Promo Code by ID
export const getPromoCodeById = async (id: string): Promise<PromoCode> => {
  const response = await axios.get(`${API_BASE_URL}/promocode/${id}`)
  return response.data
}

// CREATE Promo Code
export const createPromoCode = async (
  promocodeData: Partial<PromoCode>,
): Promise<PromoCode> => {
  const response = await axios.post(`${API_BASE_URL}/promocode`, promocodeData)
  return response.data
}

// UPDATE Promo Code
export const updatePromoCode = async (
  id: string,
  promocodeData: Partial<PromoCode>,
): Promise<PromoCode> => {
  const response = await axios.patch(`${API_BASE_URL}/promocode/${id}`, promocodeData)
  return response.data
}

// DELETE Promo Code
export const deletePromoCode = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/promocode/${id}`)
}



// -------------------------------------------------
//                 PAYMENTS -> payments
// ---------------------------------------------------

// GET all Payments
export const getPayments = async (): Promise<Payment[]> => {
  const response = await axios.get(`${API_BASE_URL}/payments`)
  return response.data
}

// GET Payment by ID
export const getPaymentById = async (id: string): Promise<Payment> => {
  const response = await axios.get(`${API_BASE_URL}/payments/${id}`)
  return response.data
}

// CREATE Payment
export const createPayment = async (
  paymentData: Partial<Payment>,
): Promise<Payment> => {
  const response = await axios.post(`${API_BASE_URL}/payments`, paymentData)
  return response.data
}

// CREATE Stripe Checkout Session
export const createCheckoutSession = async (
  paymentData: Partial<Payment>,
): Promise<{ url: string }> => {
  const response = await axios.post(`${API_BASE_URL}/payments/checkout`, paymentData)
  return response.data
}

//  NEW: GET Stripe Checkout Session by Session ID
export const getStripeSessionById = async (
  sessionId: string,
): Promise<{ paymentIntentId: string }> => {
  const response = await axios.get(`${API_BASE_URL}/payments/session/${sessionId}`)
  return response.data
}

// CONFIRM Payment by PaymentIntent ID
export const confirmPayment = async (
  paymentIntentId: string,
): Promise<Payment> => {
  const response = await axios.post(`${API_BASE_URL}/payments/confirm`, {
    paymentIntentId,
  })
  return response.data
}

// UPDATE Payment
export const updatePayment = async (
  id: string,
  paymentData: Partial<Payment>,
): Promise<Payment> => {
  const response = await axios.patch(`${API_BASE_URL}/payments/${id}`, paymentData)
  return response.data
}

// DELETE Payment
export const deletePayment = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/payments/${id}`)
}




// -------------------------------------------------

//                 NOTIFICATION -> notification

// ---------------------------------------------------

// GET all Notifications
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get(`${API_BASE_URL}/notification`)
  return response.data
}

// GET Notification by ID
export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await axios.get(`${API_BASE_URL}/notification/${id}`)
  return response.data
}

// CREATE Notification
export const createNotification = async (
  notificationData: Partial<Notification>,
): Promise<Notification> => {
  const response = await axios.post(`${API_BASE_URL}/notification`, notificationData)
  return response.data
}

// UPDATE Notification
export const updateNotification = async (
  id: string,
  notificationData: Partial<Notification>,
): Promise<Notification> => {
  const response = await axios.patch(`${API_BASE_URL}/notification/${id}`, notificationData)
  return response.data
}

// DELETE Notification
export const deleteNotification = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/notification/${id}`)
}



// -------------------------------------------------

//                 LOCATIONS -> locations

// ---------------------------------------------------

// GET all Locations
export const getLocations = async (): Promise<Location[]> => {
  const response = await axios.get(`${API_BASE_URL}/locations`)
  return response.data
}

// GET Location by ID
export const getLocationById = async (id: string): Promise<Location> => {
  const response = await axios.get(`${API_BASE_URL}/locations/${id}`)
  return response.data
}

// CREATE Location
export const createLocation = async (
  locationData: Partial<Location>,
): Promise<Location> => {
  const response = await axios.post(`${API_BASE_URL}/locations`, locationData)
  return response.data
}

// UPDATE Location
export const updateLocation = async (
  id: string,
  locationData: Partial<Location>,
): Promise<Location> => {
  const response = await axios.patch(`${API_BASE_URL}/locations/${id}`, locationData)
  return response.data
}

// DELETE Location
export const deleteLocation = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/locations/${id}`)
}



// -------------------------------------------------

//                 DRIVER PROFILE  -> driverprofile

// ---------------------------------------------------

// GET all Driver Profiles
export const getDriverProfiles = async (): Promise<DriverProfile[]> => {
  const response = await axios.get(`${API_BASE_URL}/driverprofile`)
  return response.data
}

// GET Driver Profile by ID
export const getDriverProfileById = async (id: string): Promise<DriverProfile> => {
  const response = await axios.get(`${API_BASE_URL}/driverprofile/${id}`)
  return response.data
}

// CREATE Driver Profile
export const createDriverProfile = async (
  driverprofileData: Partial<DriverProfile>,
): Promise<DriverProfile> => {
  const response = await axios.post(`${API_BASE_URL}/driverprofile`, driverprofileData)
  return response.data
}

// UPDATE Driver Profile
export const updateDriverProfile = async (
  id: string,
  driverprofileData: Partial<DriverProfile>,
): Promise<DriverProfile> => {
  const response = await axios.patch(`${API_BASE_URL}/driverprofile/${id}`, driverprofileData)
  return response.data
}

// DELETE Driver Profile
export const deleteDriverProfile = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/driverprofile/${id}`)
}



// -------------------------------------------------

//                 DRIVER LOCATION -> driverlocation

// ---------------------------------------------------

// GET all Driver Locations
export const getDriverLocations = async (): Promise<DriverLocation[]> => {
  const response = await axios.get(`${API_BASE_URL}/driverlocation`)
  return response.data
}

// GET Driver Location by ID
export const getDriverLocationById = async (id: string): Promise<DriverLocation> => {
  const response = await axios.get(`${API_BASE_URL}/driverlocation/${id}`)
  return response.data
}

// CREATE Driver Location
export const createDriverLocation = async (
  driverlocationData: Partial<DriverLocation>,
): Promise<DriverLocation> => {
  const response = await axios.post(`${API_BASE_URL}/driverlocation`, driverlocationData)
  return response.data
}

// UPDATE Driver Location
export const updateDriverLocation = async (
  id: string,
  driverlocationData: Partial<DriverLocation>,
): Promise<DriverLocation> => {
  const response = await axios.patch(`${API_BASE_URL}/driverlocation/${id}`, driverlocationData)
  return response.data
}

// DELETE Driver Location
export const deleteDriverLocation = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/driverlocation/${id}`)
}



// -------------------------------------------------

//                 DEVICE -> device

// ---------------------------------------------------

// GET all Devices
export const getDevices = async (): Promise<Device[]> => {
  const response = await axios.get(`${API_BASE_URL}/device`)
  return response.data
}

// GET Device by ID
export const getDeviceById = async (id: string): Promise<Device> => {
  const response = await axios.get(`${API_BASE_URL}/device/${id}`)
  return response.data
}

// CREATE Device
export const createDevice = async (
  deviceData: Partial<Device>,
): Promise<Device> => {
  const response = await axios.post(`${API_BASE_URL}/device`, deviceData)
  return response.data
}

// UPDATE Device
export const updateDevice = async (
  id: string,
  deviceData: Partial<Device>,
): Promise<Device> => {
  const response = await axios.patch(`${API_BASE_URL}/device/${id}`, deviceData)
  return response.data
}

// DELETE Device
export const deleteDevice = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/device/${id}`)
}



// -------------------------------------------------

//                 ADMINS -> admin

// ---------------------------------------------------

// GET all Admins
export const getAdmins = async (): Promise<Admin[]> => {
  const response = await axios.get(`${API_BASE_URL}/admin`)
  return response.data
}

// GET Admin by ID
export const getAdminById = async (id: string): Promise<Admin> => {
  const response = await axios.get(`${API_BASE_URL}/admin/${id}`)
  return response.data
}

// CREATE Admin
export const createAdmin = async (
  adminData: Partial<Admin>,
): Promise<Admin> => {
  const response = await axios.post(`${API_BASE_URL}/admin`, adminData)
  return response.data
}

// UPDATE Admin
export const updateAdmin = async (
  id: string,
  adminData: Partial<Admin>,
): Promise<Admin> => {
  const response = await axios.patch(`${API_BASE_URL}/admin/${id}`, adminData)
  return response.data
}

// DELETE Admin
export const deleteAdmin = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/admin/${id}`)
}
