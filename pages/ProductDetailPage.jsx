import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart, faStar, faStarHalfAlt, faChevronDown, faChevronUp,
  faArrowLeft, faCheck
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import PreFooter from "../components/PreFooter";
import { allProducts, categoryMeta } from "../src/data/products/index";
import { useI18n } from "../src/i18n/i18ncontext";

// ─── STAR RATING ─────────────────────────────────────────────────────────────

function StarRating({ rating, large = false }) {
  const size = large ? 14 : 11;
  return (
    <div className="starRating" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => {
        if (rating >= i) return <FontAwesomeIcon key={i} icon={faStar} className="starFilled" />;
        if (rating >= i - 0.5) return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="starFilled" />;
        return <FontAwesomeIcon key={i} icon={faStarEmpty} className="starEmpty" />;
      })}
    </div>
  );
}

// ─── ACCORDION ITEM ───────────────────────────────────────────────────────────

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pdpAccordionItem">
      <button className="pdpAccordionHead" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} style={{ fontSize: 11, color: "#999" }} />
      </button>
      {open && <div className="pdpAccordionBody">{children}</div>}
    </div>
  );
}

// ─── CART TOAST ───────────────────────────────────────────────────────────────

function CartToast({ show, onViewCart, t }) {
  return (
    <div className={`cartToast${show ? " show" : ""}`}>
      <FontAwesomeIcon icon={faCheck} />
      <span>{t.product.addedToCart || "Added to cart"}</span>
      <button onClick={onViewCart}>{t.cart.yourCart || "View Cart"}</button>
    </div>
  );
}

// ─── RELATED PRODUCT CARD ─────────────────────────────────────────────────────

function RelatedCard({ product, onNavigate, onAddToCart, t }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="catProductCard" style={{ cursor: "pointer" }} onClick={() => onNavigate(product)}>
      <div className="catProductImg">
        <img src={product.src} alt={product.title} loading="lazy" />
        <div className="catProductBadges">
          {product.isNew && <span className="badge badgeNew">{t.product.new}</span>}
          {product.isSale && discount && <span className="badge badgeSale">-{discount}%</span>}
        </div>
        <button
          className="catQuickAdd"
          onClick={e => { e.stopPropagation(); onAddToCart(product); }}
        >
          {t.product.addToCart}
        </button>
      </div>
      <div className="catProductInfo">
        <p className="catProductBrand">{product.brand}</p>
        <h3 className="catProductTitle">{product.title}</h3>
        <div className="catProductPrices">
          <span className="catProductPrice">€{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="catProductOriginalPrice">€{product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ProductDetailPage({ productId, category, onAddToCart, setPage, promises, footerCols, wishlistItems, onToggleWishlist }) {
  const { t } = useI18n();

  const products = allProducts[category] || [];
  const product = products.find(p => p.id === productId) || products[0];
  const meta = categoryMeta[category] || { label: category };

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(null);
      setQty(1);
      setSizeError(false);
      setActiveImg(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p>Product not found.</p>
        <button onClick={() => setPage(`category:${category}`)} style={{ marginTop: 16 }}>
          ← Back
        </button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // Generate pseudo-gallery (same image 3 times — swap for real images when available)
  const galleryImgs = [product.src, product.src, product.src];

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onAddToCart({ ...product, selectedColor, selectedSize, qty });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // Related: same category, different product
  const related = products.filter(p => p.id !== product.id).slice(0, 4);

  const categoryLabel = meta.label || category.toUpperCase();

  return (
    <>
      {/* Back button */}
      <button className="pdpBackBtn" onClick={() => setPage(`category:${category}`)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        {categoryLabel}
      </button>

      <div className="pdpContainer">
        {/* ── LEFT: Gallery ── */}
        <div className="pdpGallery">
          <img
            className="pdpMainImg"
            src={galleryImgs[activeImg]}
            alt={product.title}
          />
          <div className="pdpThumbRow">
            {galleryImgs.map((img, i) => (
              <img
                key={i}
                className={`pdpThumb${activeImg === i ? " active" : ""}`}
                src={img}
                alt={`${product.title} ${i + 1}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="pdpInfo">
          {/* Breadcrumb */}
          <div className="pdpBreadcrumb">
            <span onClick={() => setPage("home")}>Home</span>
            <span className="sep">›</span>
            <span onClick={() => setPage(`category:${category}`)}>{categoryLabel}</span>
            <span className="sep">›</span>
            <span style={{ color: "#555", cursor: "default" }}>{product.title}</span>
          </div>

          {/* Brand */}
          <p className="pdpBrand">{product.brand}</p>

          {/* Title */}
          <h1 className="pdpTitle">{product.title}</h1>

          {/* Rating */}
          <div className="pdpRatingRow">
            <StarRating rating={product.rating} large />
            <span className="pdpReviews">
              {product.rating.toFixed(1)} ({product.reviews} {t.product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="pdpPriceRow">
            <span className="pdpPrice">€{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="pdpOriginalPrice">€{product.originalPrice.toFixed(2)}</span>
                <span className="pdpSaveBadge">-{discount}%</span>
              </>
            )}
          </div>

          <hr className="pdpDivider" />

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div>
              <div className="pdpLabel">
                {t.product.color}:
                <span className="pdpLabelValue">{selectedColor}</span>
              </div>
              <div className="pdpColorList">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`pdpColorBtn${selectedColor === color ? " active" : ""}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes?.length > 0 && (
            <div>
              <div className="pdpLabel">
                {t.product.size}:
                {selectedSize && <span className="pdpLabelValue">{selectedSize}</span>}
              </div>
              <div className="pdpSizeList">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`pdpSizeBtn${selectedSize === size ? " active" : ""}`}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="pdpSizeError">
                {sizeError ? (t.product.selectSize || "Please select a size") : ""}
              </p>
            </div>
          )}

          {/* Qty + Add to Cart */}
          <div className="pdpQtyRow">
            <div className="pdpQtyControl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="pdpAddBtn" onClick={handleAddToCart}>
              {t.product.addToCart}
            </button>
            <button
              className={`pdpWishlistBtn${wishlistItems && wishlistItems.some(item => item.id === product.id) ? " active" : ""}`}
              onClick={() => onToggleWishlist(product)}
              title={t.header.wishlist}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>

          {/* Accordion: Description, Shipping, Returns */}
          <div className="pdpAccordion">
            <AccordionItem title="DESCRIPTION" defaultOpen>
              <p>{product.description}</p>
            </AccordionItem>
            <AccordionItem title="SHIPPING & DELIVERY">
              <p>Free shipping on orders over €20 within Greece. Orders are processed within 1–2 business days and delivered in 2–4 business days.</p>
            </AccordionItem>
            <AccordionItem title="RETURNS & EXCHANGES">
              <p>Free returns within 30 days of purchase. Items must be unworn, unwashed, and in original packaging with tags attached.</p>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="pdpRelated">
          <h2 className="pdpRelatedTitle">You May Also Like</h2>
          <div className="pdpRelatedGrid">
            {related.map(p => (
              <RelatedCard
                key={p.id}
                product={p}
                onNavigate={(prod) => setPage(`product:${category}:${prod.id}`)}
                onAddToCart={onAddToCart}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      <PreFooter promises={promises} footerCols={footerCols} />

      {/* Add to cart toast */}
      <CartToast
        show={toastVisible}
        onViewCart={() => { setToastVisible(false); setPage("cart"); }}
        t={t}
      />
    </>
  );
}