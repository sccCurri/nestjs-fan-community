import _ from 'lodash';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SupportMessage } from './entities/support-message.entity';

@Injectable()
export class SupportMessageService {
  constructor(
    @InjectRepository(SupportMessage)
    private supportMessageRepository: Repository<SupportMessage>,
  ) {}

  async getMessagesByTeamId(teamId: number) {
    return await this.supportMessageRepository.findBy({
      team_id: teamId,
    });
  }

  async createMessage(teamId: number, userId: number, message: string) {
    await this.supportMessageRepository.save({
      team_id: teamId,
      user_id: userId,
      message,
    });
  }

  async updateMessage(id: number, userId: number, message: string) {
    await this.verifyMessage(id, userId);
    await this.supportMessageRepository.update({ id }, { message });
  }

  async deleteMessage(id: number, userId: number) {
    await this.verifyMessage(id, userId);
    await this.supportMessageRepository.delete({ id });
  }

  private async verifyMessage(id: number, userId: number) {
    const supportMessage = await this.supportMessageRepository.findOneBy({
      id,
    });

    if (_.isNil(supportMessage) || supportMessage.user_id !== userId) {
      throw new NotFoundException(
        '메시지를 찾을 수 없거나 수정/삭제할 권한이 없습니다.',
      );
    }
  }
}
