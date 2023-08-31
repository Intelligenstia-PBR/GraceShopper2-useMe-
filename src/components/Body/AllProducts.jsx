import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../../api";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ setProductId, productId, loggedIn }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  const handleClick = (e) => {
    setProductId(e.target.value);
    console.log(productId);
    navigate(`/products/${productId}`);
  };

  const filter = () => {
    const filtered = products.filter((product) => {
      const lowerCaseQuery = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredProducts(filtered);
    console.log(filtered);
  };

  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  return (
    <div className="container-fluid">
      <h1 className="text-center">Products</h1>
      <Row className="products">
        {products.map((product) => (
          <Col
            key={product.id}
            value={product}
            md={4}
            className="product-card mb-3"
          >
            <Link onClick={handleClick}>
              <Card.Body>
                <Card.Img variant="top" src="/images/img-not-found.png" />
                <Card.Title>{product.title}</Card.Title>
                <Card.Subtitle>{product.price}</Card.Subtitle>
                <Button>Add to Cart</Button>
                <Button>Add to Wishlist</Button>
              </Card.Body>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};
