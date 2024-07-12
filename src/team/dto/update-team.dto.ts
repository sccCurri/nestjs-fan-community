import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter your team name.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter an description to your team.' })
  description: string;
}
