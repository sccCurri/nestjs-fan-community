import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty({ message: '팀 이름을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '팀에 대한 소개를 입력해주세요.' })
  description: string;
}
