import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/sequelize';

export class TransactionLog extends Model<
    InferAttributes<TransactionLog>,
    InferCreationAttributes<TransactionLog>
> {
    declare id: CreationOptional<string>;

    declare fromWalletId: string;
    declare toWalletId: string;
    declare amount: string;

    declare idempotencyKey: string;
    declare status: 'pending' | 'success' | 'failed';

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

TransactionLog.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fromWalletId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        toWalletId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'success', 'failed'),
            allowNull: false,
        },
        idempotencyKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        tableName: 'transaction_logs',
        modelName: 'TransactionLog',
        timestamps: true,
    }
);

export default TransactionLog;
