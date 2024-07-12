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
      throw new BadRequestException('Only CSV files can be uploaded.');
    }

    const csvContent = file.buffer.toString();

    let parseResult;
    try {
      parseResult = parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      });
    } catch (error) {
      throw new BadRequestException('CSV parsing failed.');
    }

    const teamsData = parseResult.data as any[];

    for (const teamData of teamsData) {
      if (_.isNil(teamData.name) || !teamData.description) {
        throw new BadRequestException(
          'CSV file must contain a name and a description column.',
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
      throw new NotFoundException('This is a team that does not exist in db.');
    }

    return team;
  }
}
