import {Table, Column, DataType, Model, BelongsToMany} from 'sequelize-typescript';
import {Organization} from './organization';
import {OrganizationMember} from './organization-member';
import {EventParticipation} from './event-participation';
import {Event} from './event';

@Table({
  timestamps: false,
})
export class User extends Model<User> {

    @Column(DataType.STRING)
    firstName: string;

    @Column(DataType.STRING)
    lastName: string;

    @Column(DataType.STRING)
    email: string;

    @BelongsToMany(() => Organization, () => OrganizationMember)
    organizations: Organization[];

    @BelongsToMany(() => Event, () => EventParticipation)
    events: Event[];

}
