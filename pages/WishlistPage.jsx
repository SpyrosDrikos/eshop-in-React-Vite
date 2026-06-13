import PreFooter from "../components/PreFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../src/i18n/i18ncontext";

export default function WishlistPage({ wishlistItems = [], onToggleWishlist, onAddToCart, promises, footerCols, setPage }) {
  const { t } = useI18n();

  const removeFromWishlist = (product) => {
    onToggleWishlist(product);
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product);
  };

  return (
    <div style={{ padding: "0 16px" }}>
      {wishlistItems.length === 0 ? (
        <div className="cartEmpty">
          <h2 className="sectionTitle">{t.header?.wishlist || "My Wishlist"}</h2>
          <p>{t.cart?.discover || "Start adding items to your wishlist"}</p>
          <a href="#" onClick={e => { e.preventDefault(); setPage("home"); }}>
            {t.cart?.continueShopping || "Continue Shopping"}
          </a>
        </div>
      ) : (
        <div className="cartContainer">
          <div className="cartItems">
            <h2 className="cartHeader">{t.header?.wishlist || "My Wishlist"} ({wishlistItems.length})</h2>
            {wishlistItems.map(item => (
              <div className="cartItem" key={item.id}>
                <img className="cartItemImg" src={item.src} alt={item.title} />
                <div className="cartItemContent">
                  <div>
                    <div className="cartItemTitle">{item.title}</div>
                    <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
                      {item.brand && <span>{item.brand}</span>}
                    </div>
                  </div>
                  <div className="cartItemControls">
                    <span className="cartItemPrice">€{item.price.toFixed(2)}</span>
                    <button 
                      className="addToCartBtn" 
                      onClick={() => handleAddToCart(item)}
                      title={t.product?.addToCart || "Add to Cart"}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                      {t.product?.addToCart || "Add"}
                    </button>
                    <button 
                      className="removeBtn" 
                      onClick={() => removeFromWishlist(item)}
                      title={t.header?.wishlist || "Remove"}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <h3>{t.cart?.summary || "Summary"}</h3>
            <div className="summaryRow">
              <span>{t.filters?.showResults || "Items"}</span>
              <span>{wishlistItems.length}</span>
            </div>
            <div className="summaryRow total">
              <span>{t.cart?.total || "Total Value"}</span>
              <span>€{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <button 
              className="checkoutBtn" 
              onClick={() => setPage("home")}
            >
              {t.cart?.continueShopping || "Continue Shopping"}
            </button>
          </div>
        </div>
      )}
      <PreFooter promises={promises} footerCols={footerCols} />
    </div>
  );
}
