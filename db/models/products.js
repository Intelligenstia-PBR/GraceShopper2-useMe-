const client = require("../client");
// const fs = require('fs');

async function createProduct({
  title,
  description,
  price,
  quantity,
  category,
  photo,
}) {



  try {
    // fs.readFile(photo, 'utf-8', (err, data) => {
    //   if (err) {
    //     console.error("Error reading file", err)
    //     return
    //   } else {
    //     let binary = '';

    //     for (let i = 0; i < data.length; i++) {
    //       const byte = data[i];
    //       const binaryByte = byte.toString(2).padStart(8, '0');
    //       binary += binaryByte + ' ';
    //     }
    //     binary = binary.trim();
    //     return binary
    //   }
    // });

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
    console.error(error)
  }
}


// async function createProduct({
//   title,
//   description,
//   price,
//   quantity,
//   category,
//   photo,
// }) {
//   try {
//     const data = await fs.readFile(photo); // Read the file asynchronously

// let binary = '';

// for (let i = 0; i < data.length; i++) {
//   const byte = data[i];
//   const binaryByte = byte.toString(2).padStart(8, '0');
//   binary += binaryByte + ' ';
// }
// const photoBinaryInfo = binary.trim();

//     console.log(photoBinaryInfo);

//     const {
//       rows: [product],
//     } = await client.query(
//       `
//       INSERT INTO products (title, description, price, quantity, category, photo)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING *;
//       `,
//       [title, description, price, quantity, category, photoBinaryInfo] // Use the binary data here
//     );

//     return product;
//   } catch (error) {
//     console.error(error)
//   }
// }


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

async function updateProduct({ id, ...fields }) {
  try {
    const string = Object.keys(fields)
      .map(
        (key, index) =>
          `"${key}" = $${index + 1}
    `
      )
      .join(", ");

    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET ${string} 
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );
    return product;
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
  updateProduct,
};
