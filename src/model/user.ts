import {
  Model,
  PrimaryKey,
  Column,
  DataType,
  Default,
  Table,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

@Table({
  paranoid: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  public userName!: string;
}
