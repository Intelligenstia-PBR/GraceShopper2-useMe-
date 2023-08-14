const client = require("./client");

async function createProduct({
  title,
  description,
  price,
  quantity,
  category,
  photo,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
  INSERT INTO products (title, description, price, quantity, category, photo)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `,
      [title, description, price, quantity, category, photo]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows: products } = await client.query(`
        SELECT products.*
        FROM products;
        `);
    return products;
  } catch (error) {
    throw error;
  }
}

async function getProductById({ id }) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        SELECT products.*
        FROM products
        WHERE id = $1;
        `,
      [id]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductByTitle({ title }) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
          SELECT products.*
          FROM products
          WHERE title = $1;
          `,
      [title]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductsByCategory({ category }) {
  try {
    const { rows: products } = await client.query(
      `
          SELECT products.*
          FROM products
          WHERE category = $1;
          `,
      [category]
    );
    return products;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByTitle,
  getProductsByCategory,
};
