import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  Validate,
  AfterValidate
} from 'sequelize-typescript';
import {Organization} from './organization';
import {User} from './user';
import {EventParticipation} from './event-participation';

@Table({
  timestamps: false,
})
export class Event extends Model<Event> {

  static DATES_ERROR: Error = new Error('Beginning date must be before end date');

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.DATE)
  beginning: Date;

  @Column(DataType.DATE)
  end: Date;

  @Validate({
    min: 1
  })
  @Column(DataType.INTEGER)
  maxParticipants: number;

  @ForeignKey(() => Organization)
  @Column(DataType.INTEGER)
  organizationId: number;

  @BelongsTo(() => Organization)
  organization: Organization;

  @BelongsToMany(() => User, () => EventParticipation)
  participants: User[];

  @AfterValidate
  static checkDatesOrder(instance: Event): Promise<void> {
    if (instance.beginning.getTime() < instance.end.getTime()) {
      return Promise.resolve();
    }
    return Promise.reject(this.DATES_ERROR);
  }

}
