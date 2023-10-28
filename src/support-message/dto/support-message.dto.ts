import { IsNotEmpty, IsString } from 'class-validator';

export class SupportMessageDto {
  @IsString()
  @IsNotEmpty({ message: '응원 메시지를 입력해주세요.' })
  message: string;
}
