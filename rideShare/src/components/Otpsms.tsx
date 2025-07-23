import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Verify Dialog: email + phone input
export function VerifyDialog({
  open,
  onOpenChange,
  recoveryEmail,
  setRecoveryEmail,
  phone,
  setPhone,
  isSending,
  onSend,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  recoveryEmail: string
  setRecoveryEmail: (email: string) => void
  phone: string
  setPhone: (phone: string) => void
  isSending: boolean
  onSend: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Email Address"
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <Input
            placeholder="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            onClick={onSend}
            disabled={isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSending ? 'Sending...' : 'Send OTP'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// OTP Dialog: enter OTP
export function OtpDialog({
  open,
  onOpenChange,
  otp,
  setOtp,
  onVerifyOtp,
  phone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  otp: string
  setOtp: (otp: string) => void
  onVerifyOtp: () => void
  phone: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            OTP sent to phone: <strong>{phone}</strong>
          </p>

          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button onClick={onVerifyOtp} className="w-full">
            Verify OTP
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Reset Dialog: enter new password
export function ResetDialog({
  open,
  onOpenChange,
  newPassword,
  setNewPassword,
  onResetPassword,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPassword: string
  setNewPassword: (password: string) => void
  onResetPassword: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={onResetPassword} className="w-full">
            Reset Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
