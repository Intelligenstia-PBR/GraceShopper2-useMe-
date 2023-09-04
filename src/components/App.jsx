import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";
import { CartProvider } from "../CartContext";

import {
  Header,
  Home,
  Contacts,
  Product,
  Cart,
  Account,
  Wishlist,
  Orders,
  Register,
  Login,
  Search,
  Categories,
  AccountForm,
} from "../components/index";

import { fetchUserCart } from "../api";
import { v4 as uuidv4 } from "uuid";
// This is the Mother of all components. This is what will house all of the other components to render on screen.
export const App = () => {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cart, setCart] = useState([]);
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchUserCart(storedToken)
        .then((cartData) => {
          setCart(cartData);
        })
        .catch((error) => {
          console.error("Error fetching user cart:", error);
        });
    } else {
      // No JWT token, so it's likely a guest session
      const storedGuestSessionId = localStorage.getItem("guestSessionId");
      const guestSessionId = storedGuestSessionId || uuidv4();
      localStorage.setItem("guestSessionId", guestSessionId);
    }

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const setAndStoreToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const setAndStoreUsername = (username) => {
    localStorage.setItem("username", username);
    setUsername(username);
  };

  return (
    <CartProvider>
      <BrowserRouter className="app-container">
        <Header
          token={token}
          setToken={setToken}
          username={username}
          setIsLoggedIn={setIsLoggedIn}
        />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                productId={productId}
                setProductId={setProductId}
                cart={cart}
                setCart={setCart}
                token={token}
              />
            }
          ></Route>

          <Route
            exact
            path="/product/:productId"
            element={
              <Product productId={productId} setProductId={setProductId} />
            }
          ></Route>

          <Route
            exact
            path="/cart"
            element={<Cart token={token} cart={cart} setCart={setCart} />}
          ></Route>

          <Route exact path="/orders" element={<Orders />}></Route>

          <Route
            exact
            path="/account"
            element={
              <Account
                setUsername={setUsername}
                username={username}
                token={token}
                userId={userId}
                setUserId={setUserId}
              />
            }
          ></Route>

          <Route exact path="/Wishlist" element={<Wishlist />}></Route>

          <Route
            exact
            path="/User/Edit"
            element={
              <AccountForm
                setUsername={setUsername}
                username={username}
                token={token}
                setAndStoreUsername={setAndStoreUsername}
                userId={userId}
                setUserId={setUserId}
              />
            }
          ></Route>

          <Route
            exact
            path="/Register"
            element={
              <Register
                token={token}
                setToken={setAndStoreToken}
                username={username}
                setUsername={setUsername}
                setAndStoreUsername={setAndStoreUsername}
                cart={cart}
                setCart={setCart}
              />
            }
          ></Route>

          <Route
            exact
            path="/login"
            element={
              <Login
                token={token}
                setToken={setAndStoreToken}
                username={username}
                setUsername={setUsername}
                setAndStoreUsername={setAndStoreUsername}
                cart={cart}
                setCart={setCart}
              />
            }
          ></Route>
        </Routes>
        <footer className="footer">
          <Contacts />
        </footer>
      </BrowserRouter>
    </CartProvider>
  );
};
