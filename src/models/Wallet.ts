import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize';


export class Wallet extends Model<
    InferAttributes<Wallet>,
    InferCreationAttributes<Wallet>
> {
    declare id: CreationOptional<string>;

    declare balance: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Wallet.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: '0.00',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'wallet',
        modelName: 'Wallet',
        timestamps: true,
    }
);

export default Wallet;
