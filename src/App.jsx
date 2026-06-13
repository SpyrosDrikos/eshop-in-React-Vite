import { useState } from "react";
 
// ─── IMPORTS ───────────────────────────────────────────────────────────────────
// Components
import Header from "../components/Header.jsx";
import TopButton from "../components/TopButton.jsx";
 
// Pages
import HomePage from "../pages/HomePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import CartPage from "../pages/CartPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
 
import { I18nProvider } from "./i18n/i18ncontext";

// Data & Constants
import {
  megamenu,
  sidebarCategories,
  clothes,
  shoes,
  hotCategories,
  footerCols,
  prefooterPromises
} from "./data/constants";
 
// Styles
import "../styles/base.css";
import "../styles/home.css";
import "../styles/register.css";
import "../styles/cart.css";
import "../styles/category.css";
import "../styles/productdetail.css";
 
// ─── APP COMPONENT ────────────────────────────────────────────────────────────
export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}

function AppInner() {
  const [page, setPage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
 
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleToggleWishlist = (product) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };
 
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlistItems.length;
 
  const currentCategory = page.startsWith("category:") ? page.split(":")[1] : null;
  const isProductPage = page.startsWith("product:");
  const [, productCategory, productId] = isProductPage ? page.split(":") : [];
 
  const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --body-color: #f9f6f0;
    --red: #b6271e;
    --dark: #1a1a1a;
    --mid: #3a3a3a;
    --light: #f5f5f3;
    --border: #e0e0e0;
    --font-display: 'Playfair Display', serif;
    --font-body: 'Jost', sans-serif;
  }
  body { font-family: var(--font-body); background-color: var(--body-color); color: var(--dark); }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: var(--font-body); }
  main { min-height: calc(100vh - 400px); }
  `;
 
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <style>{S}</style>
      <Header page={page} setPage={setPage} megamenu={megamenu} sidebarCategories={sidebarCategories} cartCount={cartCount} wishlistCount={wishlistCount} />
      <main>
        {page === "home" && (
          <HomePage
            clothes={clothes}
            shoes={shoes}
            hotCategories={hotCategories}
            promises={prefooterPromises}
            footerCols={footerCols}
            setPage={setPage}
            onAddToCart={handleAddToCart}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
        {page === "register" && (
          <RegisterPage promises={prefooterPromises} footerCols={footerCols} />
        )}
        {page === "cart" && (
          <CartPage
            cartItems={cartItems}
            setCartItems={setCartItems}
            promises={prefooterPromises}
            footerCols={footerCols}
            setPage={setPage}
          />
        )}
        {page === "wishlist" && (
          <WishlistPage
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            promises={prefooterPromises}
            footerCols={footerCols}
            setPage={setPage}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentCategory && (
          <CategoryPage
            category={currentCategory}
            promises={prefooterPromises}
            footerCols={footerCols}
            onAddToCart={handleAddToCart}
            setPage={setPage}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
        {isProductPage && (
          <ProductDetailPage
            productId={productId}
            category={productCategory}
            onAddToCart={handleAddToCart}
            setPage={setPage}
            promises={prefooterPromises}
            footerCols={footerCols}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </main>
      <TopButton />
    </>
  );
}
 