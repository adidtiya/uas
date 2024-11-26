module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('Reviews', 'updatedAt', {
          type: Sequelize.DATE,
          allowNull: true,
      });
  },
  async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('Reviews', 'updatedAt');
  },
};
