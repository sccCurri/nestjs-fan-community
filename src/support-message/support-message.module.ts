import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupportMessage } from './entities/support-message.entity';
import { SupportMessageController } from './support-message.controller';
import { SupportMessageService } from './support-message.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupportMessage])],
  providers: [SupportMessageService],
  controllers: [SupportMessageController],
})
export class SupportMessageModule {}
