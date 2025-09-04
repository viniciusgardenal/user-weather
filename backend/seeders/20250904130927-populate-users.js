'use strict';
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'users.csv'); 
    const usersToInsert = [];
    const limit = 100; // Nosso novo limite

    console.log(`Iniciando o processo para inserir os primeiros ${limit} usuários...`);

    const stream = fs.createReadStream(filePath).pipe(csv());

    // Criamos uma promessa para saber quando a leitura terminar
    const streamPromise = new Promise((resolve, reject) => {
      stream.on('data', (row) => {
        // Adicionamos usuários ao array APENAS se ainda não atingimos o limite
        if (usersToInsert.length < limit) {
          usersToInsert.push({
            id: row.id,
            name: row.name,
            email: row.email,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // Se já temos 100 usuários, paramos de ler o arquivo.
          // stream.destroy() encerra a leitura imediatamente.
          stream.destroy();
          resolve();
        }
      });

      stream.on('end', () => {
        // O evento 'end' é chamado quando o arquivo termina ou quando a stream é destruída.
        console.log('Leitura do arquivo finalizada.');
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });

    // Espera a leitura do arquivo terminar
    await streamPromise;

    // Insere o lote único de 100 usuários no banco de dados
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