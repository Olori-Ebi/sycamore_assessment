import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/sequelize';

export class WalletInterest extends Model<
    InferAttributes<WalletInterest>,
    InferCreationAttributes<WalletInterest>
> {
    declare id: CreationOptional<string>;

    declare walletId: string;
    declare principal: string;
    declare interest: string;

    declare calculatedAt: CreationOptional<Date>;
}

WalletInterest.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        walletId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        principal: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        interest: {
            type: DataTypes.DECIMAL(18, 4),
            allowNull: false,
        },
        calculatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'wallet_interest',
        modelName: 'WalletInterest',
        timestamps: false,
    }
);

export default WalletInterest;