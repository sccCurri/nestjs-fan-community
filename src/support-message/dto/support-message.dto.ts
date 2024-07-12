import { IsNotEmpty, IsString } from 'class-validator';

export class SupportMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter a message of support.' })
  message: string;
}
