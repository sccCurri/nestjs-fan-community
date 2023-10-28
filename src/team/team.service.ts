import _ from 'lodash';
import { parse } from 'papaparse';
import { Repository } from 'typeorm';

/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: number) {
    return await this.verifyTeamById(id);
  }

  async create(file: Express.Multer.File) {
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV 파일만 업로드 가능합니다.');
    }

    const csvContent = file.buffer.toString();

    let parseResult;
    try {
      parseResult = parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      throw new BadRequestException('CSV 파싱에 실패했습니다.');
    }

    const teamsData = parseResult.data as any[];

    for (const teamData of teamsData) {
      if (_.isNil(teamData.name) || !teamData.description) {
        throw new BadRequestException(
          'CSV 파일은 name과 description 컬럼을 포함해야 합니다.',
        );
      }
    }

    const createTeamDtos = teamsData.map((teamData) => ({
      name: teamData.name,
      description: teamData.description,
    }));

    await this.teamRepository.save(createTeamDtos);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    await this.verifyTeamById(id);
    await this.teamRepository.update({ id }, updateTeamDto);
  }

  async delete(id: number) {
    await this.verifyTeamById(id);
    await this.teamRepository.delete({ id });
  }

  private async verifyTeamById(id: number) {
    const team = await this.teamRepository.findOneBy({ id });
    if (_.isNil(team)) {
      throw new NotFoundException('존재하지 않는 팀입니다.');
    }

    return team;
  }
}
