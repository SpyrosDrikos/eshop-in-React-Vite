import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar, faStarHalfAlt, faFilter, faChevronDown, faChevronUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import PreFooter from "../components/PreFooter";
import { allProducts, categoryMeta, getBrands, getColors, getSizes } from "../src/data/products/index";
import { useI18n } from "../src/i18n/i18ncontext";

const SORT_OPTIONS = ["newest", "priceLow", "priceHigh", "popular", "rating"];

function StarRating({ rating }) {
  return (
    <div className="starRating">
      {[1, 2, 3, 4, 5].map(i => {
        if (rating >= i) return <FontAwesomeIcon key={i} icon={faStar} className="starFilled" />;
        if (rating >= i - 0.5) return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="starFilled" />;
        return <FontAwesomeIcon key={i} icon={faStarEmpty} className="starEmpty" />;
      })}
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filterSection">
      <button className="filterSectionHead" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="filterChevron" />
      </button>
      {open && <div className="filterSectionBody">{children}</div>}
    </div>
  );
}

function ProductCard({ product, onAddToCart, t, onNavigate }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="catProductCard" onClick={() => onNavigate(product)} style={{ cursor: "pointer" }}>
      <div className="catProductImg">
        <img src={product.src} alt={product.title} loading="lazy" />
        <div className="catProductBadges">
          {product.isNew && <span className="badge badgeNew">{t.product.new}</span>}
          {product.isSale && discount && <span className="badge badgeSale">-{discount}%</span>}
        </div>
        <button
          className={`catWishlistBtn${wishlisted ? " active" : ""}`}
          onClick={e => { e.stopPropagation(); setWishlisted(w => !w); }}
          title={t.header.wishlist}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button className="catQuickAdd" onClick={e => { e.stopPropagation(); onAddToCart(product); }}>
          {t.product.addToCart}
        </button>
      </div>
      <div className="catProductInfo">
        <p className="catProductBrand">{product.brand}</p>
        <h3 className="catProductTitle">{product.title}</h3>
        <div className="catProductRating">
          <StarRating rating={product.rating} />
          <span className="catProductReviews">({product.reviews})</span>
        </div>
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

export default function CategoryPage({ category, promises, footerCols, onAddToCart, setPage }) {
  const { t } = useI18n();
  const products = allProducts[category] || [];
  const meta = categoryMeta[category] || { label: category.toUpperCase() };
  const brands = getBrands(category);
  const colors = getColors(category);
  const sizes = getSizes(category);

  const navigateToProduct = (product) => {
    setPage(`product:${category}:${product.id}`);
  };

  const [sort, setSort] = useState("newest");
  const [filterBrands, setFilterBrands] = useState([]);
  const [filterColors, setFilterColors] = useState([]);
  const [filterSizes, setFilterSizes] = useState([]);
  const [filterSale, setFilterSale] = useState(false);
  const [filterNew, setFilterNew] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const maxPrice = Math.ceil(Math.max(...products.map(p => p.originalPrice || p.price)));
  const minPrice = Math.floor(Math.min(...products.map(p => p.price)));

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filterBrands.length) list = list.filter(p => filterBrands.includes(p.brand));
    if (filterColors.length) list = list.filter(p => p.colors.some(c => filterColors.includes(c)));
    if (filterSizes.length) list = list.filter(p => p.sizes.some(s => filterSizes.includes(s)));
    if (filterSale) list = list.filter(p => p.isSale);
    if (filterNew) list = list.filter(p => p.isNew);
    list = list.filter(p => p.price >= priceMin && p.price <= priceMax);
    switch (sort) {
      case "priceLow": list.sort((a, b) => a.price - b.price); break;
      case "priceHigh": list.sort((a, b) => b.price - a.price); break;
      case "popular": list.sort((a, b) => b.reviews - a.reviews); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [products, filterBrands, filterColors, filterSizes, filterSale, filterNew, priceMin, priceMax, sort]);

  const activeFilterCount = filterBrands.length + filterColors.length + filterSizes.length +
    (filterSale ? 1 : 0) + (filterNew ? 1 : 0);

  const clearAll = () => {
    setFilterBrands([]);
    setFilterColors([]);
    setFilterSizes([]);
    setFilterSale(false);
    setFilterNew(false);
    setPriceMin(minPrice);
    setPriceMax(maxPrice);
  };

  const FilterPanel = () => (
    <aside className="catFilters">
      <div className="catFiltersHead">
        <h2>{t.filters.filters}</h2>
        {activeFilterCount > 0 && (
          <button className="clearFiltersBtn" onClick={clearAll}>
            {t.filters.clearFilters}
          </button>
        )}
      </div>

      <FilterSection title={t.filters.availability}>
        <label className="filterCheckLabel">
          <input type="checkbox" checked={filterSale} onChange={e => setFilterSale(e.target.checked)} />
          <span>{t.filters.onSale}</span>
        </label>
        <label className="filterCheckLabel">
          <input type="checkbox" checked={filterNew} onChange={e => setFilterNew(e.target.checked)} />
          <span>{t.filters.newArrivals}</span>
        </label>
      </FilterSection>

      <FilterSection title={t.filters.price}>
        <div className="priceRange">
          <span>€{priceMin}</span>
          <span>€{priceMax}</span>
        </div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceMin}
          className="priceSlider"
          onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceMax}
          className="priceSlider"
          onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
        />
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title={t.filters.brand}>
          {brands.map(brand => (
            <label key={brand} className="filterCheckLabel">
              <input
                type="checkbox"
                checked={filterBrands.includes(brand)}
                onChange={() => toggleArr(filterBrands, setFilterBrands, brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </FilterSection>
      )}

      {sizes.length > 0 && (
        <FilterSection title={t.filters.size}>
          <div className="sizeGrid">
            {sizes.map(size => (
              <button
                key={size}
                className={`sizeBtn${filterSizes.includes(size) ? " active" : ""}`}
                onClick={() => toggleArr(filterSizes, setFilterSizes, size)}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {colors.length > 0 && (
        <FilterSection title={t.filters.color} defaultOpen={false}>
          {colors.slice(0, 12).map(color => (
            <label key={color} className="filterCheckLabel">
              <input
                type="checkbox"
                checked={filterColors.includes(color)}
                onChange={() => toggleArr(filterColors, setFilterColors, color)}
              />
              <span>{color}</span>
            </label>
          ))}
        </FilterSection>
      )}
    </aside>
  );

  return (
    <div>
      <div className="catHero">
        <img src={meta.img} alt={meta.label} />
        <div className="catHeroOverlay">
          <h1>{meta.label}</h1>
          <p>{filtered.length} {t.filters.showResults.toLowerCase()}</p>
        </div>
      </div>

      <div className="catPageWrapper">
        <div className="catMobileBar">
          <button className="catMobileFilterBtn" onClick={() => setMobileFiltersOpen(o => !o)}>
            <FontAwesomeIcon icon={faFilter} />
            {t.filters.filters}
            {activeFilterCount > 0 && <span className="filterBadge">{activeFilterCount}</span>}
          </button>
          <select className="catSortSelect" value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{t.filters.sortOptions[opt]}</option>
            ))}
          </select>
        </div>

        {mobileFiltersOpen && (
          <div className="mobileFiltersOverlay">
            <div className="mobileFiltersPanel">
              <div className="mobileFiltersClose">
                <span>{t.filters.filters}</span>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <FilterPanel />
              <button className="applyFiltersBtn" onClick={() => setMobileFiltersOpen(false)}>
                {t.filters.applyFilters} ({filtered.length})
              </button>
            </div>
          </div>
        )}

        <div className="catLayout">
          <FilterPanel />

          <div className="catMain">
            <div className="catToolbar">
              <span className="catResultCount">
                {filtered.length} {t.filters.showResults.toLowerCase()}
              </span>
              <div className="catSortWrap">
                <label className="catSortLabel">{t.filters.sort}:</label>
                <select className="catSortSelect" value={sort}  onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{t.filters.sortOptions[opt]}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="activeFilters">
                {filterBrands.map(b => (
                  <span key={b} className="activeFilterTag">
                    {b}
                    <button onClick={() => toggleArr(filterBrands, setFilterBrands, b)}>×</button>
                  </span>
                ))}
                {filterSizes.map(s => (
                  <span key={s} className="activeFilterTag">
                    {s}
                    <button onClick={() => toggleArr(filterSizes, setFilterSizes, s)}>×</button>
                  </span>
                ))}
                {filterColors.map(c => (
                  <span key={c} className="activeFilterTag">
                    {c}
                    <button onClick={() => toggleArr(filterColors, setFilterColors, c)}>×</button>
                  </span>
                ))}
                {filterSale && (
                  <span className="activeFilterTag">
                    {t.filters.onSale}
                    <button onClick={() => setFilterSale(false)}>×</button>
                  </span>
                )}
                {filterNew && (
                  <span className="activeFilterTag">
                    {t.filters.newArrivals}
                    <button onClick={() => setFilterNew(false)}>×</button>
                  </span>
                )}
                <button className="clearAllTagBtn" onClick={clearAll}>{t.filters.clearFilters}</button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="catEmpty">
                <p>{t.filters.noProducts}</p>
                <span>{t.filters.tryAdjusting}</span>
                <button onClick={clearAll}>{t.filters.clearFilters}</button>
              </div>
            ) : (
              <div className="catGrid catProductGrid">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onNavigate={navigateToProduct}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PreFooter promises={promises} footerCols={footerCols} />
    </div>
  );
}