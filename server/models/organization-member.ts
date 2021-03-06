import { Table, Column, DataType, Model, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import {Organization} from './organization';
import { User } from './user';

@Table({
  timestamps: false,
})
export class OrganizationMember extends Model<OrganizationMember> {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @PrimaryKey
  @ForeignKey(() => Organization)
  @Column(DataType.INTEGER)
  organizationId: number;

}
