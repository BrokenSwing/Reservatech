import {Table, Column, Model, PrimaryKey, ForeignKey, DataType} from 'sequelize-typescript';
import { User } from './user';
import {Event} from './event';

@Table({
  timestamps: false,
})
export class EventParticipation extends Model<EventParticipation> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @PrimaryKey
  @ForeignKey(() => Event)
  @Column(DataType.INTEGER)
  eventId: number;

}
