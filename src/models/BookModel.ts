import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../utils/dbConfig';

export class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public genre!: string;
  public published_date!: number;
  public total_copies!: number;
  public copies_available!: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    total_copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    copies_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: false,
  },
);
