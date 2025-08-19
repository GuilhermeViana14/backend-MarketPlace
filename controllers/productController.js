const { Product, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Parâmetros de query para filtros e paginação
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    let whereClause = { isActive: true };

    if (category) {
      whereClause.category = category;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Calcular offset para paginação
    const offset = (page - 1) * limit;

    // Buscar produtos
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email']
      }],
      order: [[sort, order.toUpperCase()]],
      offset,
      limit: Number(limit)
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total: count,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / limit)
      },
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
};

// @desc    Obter um produto específico
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email', 'avatar']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao buscar produto',
      error: error.message
    });
  }
};

// @desc    Criar novo produto
// @route   POST /api/products
// @access  Private (Seller/Admin)
const createProduct = async (req, res) => {
  try {
    // Adicionar o ID do usuário como sellerId
    req.body.sellerId = req.user.id;

    const product = await Product.create(req.body);

    // Buscar produto criado com dados do seller
    const productWithSeller = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: productWithSeller
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar produto',
      error: error.message
    });
  }
};

// @desc    Atualizar produto
// @route   PUT /api/products/:id
// @access  Private (Owner/Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar se o usuário é o dono do produto ou admin
    if (product.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a atualizar este produto'
      });
    }

    await product.update(req.body);

    // Buscar produto atualizado com dados do seller
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error.message
    });
  }
};

// @desc    Deletar produto
// @route   DELETE /api/products/:id
// @access  Private (Owner/Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar se o usuário é o dono do produto ou admin
    if (product.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a deletar este produto'
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao deletar produto',
      error: error.message
    });
  }
};

// @desc    Obter produtos do usuário logado
// @route   GET /api/products/my-products
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao buscar seus produtos',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
};
