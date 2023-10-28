/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Team } from '../../team/entities/team.entity';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'support_messages',
})
export class SupportMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.supportMessages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', name: 'user_id' })
  user_id: number;

  @ManyToOne(() => Team, (team) => team.supportMessages, {
    onDelete: 'CASCADE',
  })
  team: Team;

  @Column({ type: 'bigint', name: 'team_id' })
  team_id: number;
}
