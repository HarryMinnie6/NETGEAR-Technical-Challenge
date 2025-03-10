import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/dbConfig';

export class BookReservation extends Model {
  public id!: number;
  public bookId!: number;
  public title!: string;
  public genre!: string;
  public reserverName!: string;
}

BookReservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reserverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'book_reservations',
    timestamps: false,
  },
);

export default BookReservation;
