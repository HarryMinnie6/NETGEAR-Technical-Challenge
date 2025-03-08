import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/dbConfig";

export class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public genre!: string;
  public publishedYear!: number;
  public totalCopies!: number;
  public copiesAvailable!: number;
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
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalCopies: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    copiesAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'books',
  }
);