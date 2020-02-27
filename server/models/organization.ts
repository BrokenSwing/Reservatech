import {Table, Column, Model, DataType, BelongsToMany, HasMany} from 'sequelize-typescript';
import { User } from './user';
import {OrganizationMember} from './organization-member';
import {Event} from './event';

@Table({
    timestamps: false,
})
export class Organization extends Model<Organization> {

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @BelongsToMany(() => User, () => OrganizationMember)
  members: User[];

  @HasMany(() => Event)
  events: Event[];

}
