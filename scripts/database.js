const { sequelize } = require('../config/db');
const { User, Product } = require('../models');

// Script para criar e popular o banco com dados de exemplo
const setupDatabase = async () => {
  try {
    console.log('🔄 Sincronizando banco de dados...');
    
    // Força a recriação das tabelas (cuidado em produção!)
    await sequelize.sync({ force: true });
    
    console.log('✅ Tabelas criadas com sucesso!');
    
    // Criar usuários de exemplo
    const users = await User.bulkCreate([
      {
        name: 'Admin Sistema',
        email: 'admin@marketplace.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'João Vendedor',
        email: 'joao@vendedor.com',
        password: 'vendedor123',
        role: 'seller'
      },
      {
        name: 'Maria Cliente',
        email: 'maria@cliente.com',
        password: 'cliente123',
        role: 'user'
      }
    ]);
    
    console.log('✅ Usuários criados com sucesso!');
    
    // Criar produtos de exemplo
    const products = await Product.bulkCreate([
      {
        name: 'iPhone 15 Pro',
        description: 'Smartphone Apple com câmera profissional e chip A17 Pro',
        price: 8999.99,
        category: 'electronics',
        stock: 10,
        sellerId: users[1].id, // João Vendedor
        tags: ['smartphone', 'apple', 'iphone'],
        condition: 'new'
      },
      {
        name: 'Camiseta Nike Dri-FIT',
        description: 'Camiseta esportiva com tecnologia de secagem rápida',
        price: 89.99,
        category: 'clothing',
        stock: 25,
        sellerId: users[1].id,
        tags: ['camiseta', 'nike', 'esporte'],
        condition: 'new'
      },
      {
        name: 'Clean Code - Robert Martin',
        description: 'Livro sobre boas práticas de programação',
        price: 45.90,
        category: 'books',
        stock: 15,
        sellerId: users[1].id,
        tags: ['programação', 'livro', 'clean code'],
        condition: 'new'
      }
    ]);
    
    console.log('✅ Produtos criados com sucesso!');
    console.log('🎉 Database setup completo!');
    
    console.log('\n📊 Dados criados:');
    console.log(`👥 Usuários: ${users.length}`);
    console.log(`📦 Produtos: ${products.length}`);
    
    console.log('\n🔐 Credenciais de teste:');
    console.log('Admin: admin@marketplace.com / admin123');
    console.log('Vendedor: joao@vendedor.com / vendedor123');
    console.log('Cliente: maria@cliente.com / cliente123');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
  } finally {
    await sequelize.close();
  }
};

// Script para limpar o banco
const clearDatabase = async () => {
  try {
    console.log('🔄 Limpando banco de dados...');
    await sequelize.drop();
    console.log('✅ Banco limpo com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  } finally {
    await sequelize.close();
  }
};

// Executar script baseado no argumento
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'clear':
    clearDatabase();
    break;
  default:
    console.log('Comandos disponíveis:');
    console.log('node scripts/database.js setup  - Configura o banco com dados de exemplo');
    console.log('node scripts/database.js clear  - Limpa o banco de dados');
}

module.exports = { setupDatabase, clearDatabase };
