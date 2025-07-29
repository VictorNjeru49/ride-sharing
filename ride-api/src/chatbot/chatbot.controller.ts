import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { ChatbotService } from './chatbot.service';
import { ChatResponseDto } from './dto/chat-response.dto';

interface ChatRequestDto {
  message: string;
  role: UserRole;
}

// interface ChatResponseDto {
//   reply: string;
// }
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Post()
  async chat(@Body() { message }: ChatRequestDto): Promise<ChatResponseDto> {
    return await this.chatbotService.chat(message);
  }
  @Public()
  @Post('user')
  async chatUser(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    const reply = await this.chatbotService.getReply(
      body.message,
      UserRole.RIDER,
    );
    return { reply };
  }

  @Public()
  @Post('driver')
  async chatDriver(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    const reply = await this.chatbotService.getReply(
      body.message,
      UserRole.DRIVER,
    );
    return { reply };
  }

  @Public()
  @Post('admin')
  async chatAdmin(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    const reply = await this.chatbotService.getReply(
      body.message,
      UserRole.ADMIN,
    );
    return { reply };
  }
  @Public()
  @Post('reply')
  async roleReply(
    @Body() body: ChatRequestDto & { role: UserRole },
  ): Promise<ChatResponseDto> {
    const { message, role } = body;
    const reply = await this.chatbotService.getReply(message, role);
    return { reply };
  }
}
