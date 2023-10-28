/* eslint-disable prettier/prettier */
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/types/userRole.type';

import {
  Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@UseGuards(RolesGuard)
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll() {
    return await this.teamService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.teamService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    await this.teamService.create(file);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    await this.teamService.update(id, updateTeamDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.teamService.delete(id);
  }
}
