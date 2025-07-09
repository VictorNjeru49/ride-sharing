import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @Public()
  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }
  @Public()
  @Get()
  findAll() {
    return this.walletsService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(id, updateWalletDto);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(id);
  }
}
