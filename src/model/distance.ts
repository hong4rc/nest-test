import {
  Model,
  PrimaryKey,
  Column,
  DataType,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  Index,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user';

@Table({
  paranoid: true,
})
export class Distance extends Model<Distance> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  creator_id: string;

  @BelongsTo(() => User)
  creator: User;

  @AllowNull(false)
  @Column(DataType.DOUBLE)
  distance: number;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(8))
  date: string;
}
