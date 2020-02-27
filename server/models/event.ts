import {Table, Column, DataType, Model, ForeignKey, BelongsToMany, BelongsTo} from 'sequelize-typescript';
import {Organization} from './organization';
import {User} from './user';
import {EventParticipation} from './event-participation';

@Table({
  timestamps: false,
})
export class Event extends Model<Event> {

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.DATE)
  beginning: Date;

  @Column(DataType.DATE)
  end: Date;

  @ForeignKey(() => Organization)
  @Column(DataType.NUMBER)
  organizationId: number;

  @BelongsTo(() => Organization)
  organization: Organization;

  @BelongsToMany(() => User, () => EventParticipation)
  participants: User[];

}
