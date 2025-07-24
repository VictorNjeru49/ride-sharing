import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';
import { ChatResponseDto } from './dto/chat-response.dto';
@Injectable()
export class ChatbotService {
  async getReply(message: string, role: UserRole): Promise<string> {
    if (!message || message.trim() === '') {
      throw new BadRequestException('No message provided');
    }

    const normalizedMsg = message.trim().toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Common greetings/help/thanks
    if (normalizedMsg.includes('hello') || normalizedMsg.includes('hi')) {
      return 'Hello! How can I assist you with your ride today?';
    }
    if (normalizedMsg.includes('help')) {
      return 'I can help you book rides, answer questions about our services, or assist with your account.';
    }
    if (normalizedMsg.includes('thank')) {
      return "You're welcome! Let me know if you need anything else.";
    }

    // Role-specific replies
    switch (role) {
      case UserRole.RIDER:
        return this.userReply(normalizedMsg, message);
      case UserRole.DRIVER:
        return this.driverReply(normalizedMsg, message);
      case UserRole.ADMIN:
        return this.adminReply(normalizedMsg, message);
      default:
        return `Gemini Bot says: You sent "${message}". This is a simulated response.`;
    }
  }

  async chat(message: string): Promise<ChatResponseDto> {
    if (!message || message.trim() === '') {
      throw new BadRequestException('No message provided');
    }

    const normalized = message.trim().toLowerCase();
    const reply = this.buildReply(normalized, message);

    // simulate latency
    await new Promise((res) => setTimeout(res, 1_000));

    return { reply };
  }

  private userReply(normalizedMsg: string, originalMsg: string): string {
    if (normalizedMsg.includes('book')) {
      return 'To book a ride, please tell me your pickup and drop-off locations.';
    }
    if (normalizedMsg.includes('cancel')) {
      return 'To cancel a booking, please provide your booking ID.';
    }
    if (normalizedMsg.includes('status')) {
      return 'You can check your ride status on the "My Rides" page.';
    }
    return `User support: You said "${originalMsg}". How else can I assist you?`;
  }

  private driverReply(normalizedMsg: string, originalMsg: string): string {
    if (normalizedMsg.includes('available')) {
      return 'You are currently marked as available for rides.';
    }
    if (normalizedMsg.includes('accept')) {
      return 'To accept a ride, please confirm the ride ID.';
    }
    if (normalizedMsg.includes('earnings')) {
      return 'You can view your earnings summary in the driver dashboard.';
    }
    return `Driver support: You said "${originalMsg}". What can I assist you with?`;
  }

  private adminReply(normalizedMsg: string, originalMsg: string): string {
    if (normalizedMsg.includes('reports')) {
      return 'You can generate reports from the admin dashboard under the "Reports" section.';
    }
    if (normalizedMsg.includes('users')) {
      return 'To manage users, please visit the user management panel.';
    }
    if (normalizedMsg.includes('drivers')) {
      return 'Driver management is available in the admin panel under "Drivers".';
    }
    return `Admin support: You said "${originalMsg}". How may I assist you?`;
  }
  private buildReply(normalized: string, original: string): string {
    if (normalized.includes('hello') || normalized.includes('hi')) {
      return 'Hello! How can I assist you with your ride today?';
    }
    if (normalized.includes('book')) {
      return 'To book a ride, please visit the "Book Now" page or tell me your pickup and drop‑off locations.';
    }
    if (normalized.includes('cancel')) {
      return 'If you want to cancel a booking, please provide your booking ID.';
    }
    if (normalized.includes('help')) {
      return 'I can help you book rides, answer questions about our services, or assist with your account.';
    }
    if (normalized.includes('thank')) {
      return "You're welcome! Let me know if you need anything else.";
    }
    return `Gemini Bot says: You sent "${original}". This is a simulated response.`;
  }
}
