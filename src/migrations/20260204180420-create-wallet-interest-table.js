module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallet_interest', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      walletId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      principal: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      interest: {
        type: Sequelize.DECIMAL(18, 4),
        allowNull: false,
      },
      calculatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('wallet_interest');
  },
};