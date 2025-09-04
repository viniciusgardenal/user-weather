'use strict';
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'users.csv'); 
    const usersToInsert = [];
    const limit = 100;

    console.log(`Iniciando o processo para inserir os primeiros ${limit} usuários...`);

    const stream = fs.createReadStream(filePath).pipe(csv());

    const streamPromise = new Promise((resolve, reject) => {
      stream.on('data', (row) => {
        if (usersToInsert.length < limit) {
          usersToInsert.push({
            id: row.id,
            name: row.name,
            email: row.email,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          stream.destroy();
          resolve();
        }
      });

      stream.on('end', () => {
        console.log('Leitura do arquivo finalizada.');
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });

    await streamPromise;

    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('Users', usersToInsert, {});
      console.log(`${usersToInsert.length} usuários foram inseridos com sucesso.`);
    }

    console.log('PROCESSO DE SEED CONCLUÍDO! 🎉');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};