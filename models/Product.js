const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do produto é obrigatório'
      },
      len: {
        args: [1, 100],
        msg: 'Nome não pode ter mais de 100 caracteres'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Descrição é obrigatória'
      },
      len: {
        args: [1, 1000],
        msg: 'Descrição não pode ter mais de 1000 caracteres'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Preço não pode ser negativo'
      },
      notNull: {
        msg: 'Preço é obrigatório'
      }
    }
  },
  category: {
    type: DataTypes.ENUM(
      'electronics',
      'clothing',
      'books',
      'home',
      'sports',
      'beauty',
      'toys',
      'automotive',
      'other'
    ),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Categoria é obrigatória'
      }
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Estoque não pode ser negativo'
      },
      notNull: {
        msg: 'Quantidade em estoque é obrigatória'
      }
    }
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.JSONB,
    defaultValue: {
      average: 0,
      count: 0
    }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3), // em kg
    validate: {
      min: {
        args: [0],
        msg: 'Peso não pode ser negativo'
      }
    }
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  condition: {
    type: DataTypes.ENUM('new', 'used', 'refurbished'),
    defaultValue: 'new'
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['category']
    },
    {
      fields: ['sellerId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['price']
    }
  ]
});

module.exports = Product;
