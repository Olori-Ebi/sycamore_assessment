import { Model, DataTypes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/sequelize';

export class Ledger extends Model {
    declare id: CreationOptional<string>;
    declare walletId: string;
    declare transactionId: string;
    declare type: 'debit' | 'credit';
    declare amount: string;
    declare balanceAfter: string;
    declare createdAt: CreationOptional<Date>;
}

Ledger.init(
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
        transactionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('debit', 'credit'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        balanceAfter: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'ledger',
        modelName: 'Ledger',
        timestamps: false,
    }
);

export default Ledger;
