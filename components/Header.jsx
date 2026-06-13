import { faEye, faEyeSlash, faHeart, faSearch, faShoppingCart, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import SearchDropdown from "./SearchDropdown";
import { hotSearches, recommendedSearches } from "../src/data/constants";
import { useI18n } from "../src/i18n/i18ncontext";
import LanguageSwitcher from "./LanguageSwitcher";

// ─── TOPBAR ─────────────────────────────────────────────────────────────────────
function TopBar() {
  const { t } = useI18n();
  const navLinks = [
    t.nav.home,
    t.nav.company,
    t.nav.termsOfUse,
    t.nav.contact,
    t.nav.privacyPolicy
  ];
  return (
    <div className="topBar">
      <div className="topSocials">
        <a href="mailto:info@myeshop.gr">info@myeshop.gr</a>
        <span>+30 2310 123 456</span>
        {["facebook","instagram","twitter","pinterest"].map(s => (
          <a key={s} href="#" aria-label={s}>
            <i style={{ marginLeft: '8px' }} className={`fa fa-${s}`} />
          </a>
        ))}
      </div>
      <div className="topLinks">
        {navLinks.map(l => <a key={l} href="#">{l}</a>)}
      </div>
    </div>
  );
}

// ─── SIDEBAR COMPONENTS ────────────────────────────────────────────────────────
function SidebarDropdownItem({ cat }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sidebarCat">
      <div
        className={`sidebarCatHead${cat.hot ? " hot" : ""}`}
        onClick={() => cat.items.length && setOpen(o => !o)}
      >
        <span>{cat.label}</span>
        {cat.items.length > 0 && (
          <button className={`sidebarCatToggle${open ? " open" : ""}`}>&#8964;</button>
        )}
      </div>
      {cat.items.length > 0 && (
        <div className={`sidebarDropdown${open ? " open" : ""}`}>
          {cat.items.map(item => <a key={item} href="#">{item}</a>)}
        </div>
      )}
    </div>
  );
}

function Sidebar({ open, onClose, sidebarCategories }) {
  const { t } = useI18n();
  return (
    <>
      <div className={`sidebarOverlay${open ? " open" : ""}`} onClick={onClose} />
      <nav className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebarHead">
          <span>{t.sidebar.menu}</span>
          <FontAwesomeIcon icon={faXmark} className="sidebarClose" onClick={onClose} />
        </div>
        <div className="sidebarSearch">
          <input placeholder={t.header.search} />
          <FontAwesomeIcon icon={faSearch} className="searchBtn" />
        </div>
        {sidebarCategories.map(cat => <SidebarDropdownItem key={cat.label} cat={cat} />)}
      </nav>
    </>
  );
}



// ─── MEGAMENU NAV ──────────────────────────────────────────────────────────────

const LINK_TO_CATEGORY = {
  "Dresses": "dresses", "Outfits": "dresses",
  "Jeans": "jeans",
  "Blouses": "blouses",
  "Dresses": "dresses",
  "Jumpsuits": "dresses",
  "Skirts": "skirts",
  "Hoodies": "mens-pants", "Shirts": "mens-pants",
  "Pants": "mens-pants", "Jackets": "mens-pants", "Sweaters": "mens-pants",
  "Bags": "accessories", "Beauty": "accessories", "Sunglasses": "accessories",
  "Belts": "accessories", "Accessories": "accessories",
  "Jewelry": "accessories", "Wallets": "accessories", "Watches": "accessories",
  "New Arrivals": "dresses", "Best Sellers": "dresses",
  "Summer Collection": "dresses", "Seasonal Picks": "dresses",
  "Sneakers": "accessories", "Athletic Shoes": "accessories",
  "Boots": "accessories", "Sandals": "accessories", "Platforms": "accessories",
  "Underwear": "blouses",
};

function MegaNav({ megamenu, setPage }) {
  const { t } = useI18n();

  const CATEGORY_SLUGS = {
    WOMEN: "dresses",
    MEN: "mens-pants",
    ACCESSORIES: "accessories",
  };

  return (
    <nav className="megamenuNav">
      <a href="#" onClick={e => { e.preventDefault(); setPage("category:dresses"); }}>{t.nav.newArrivals}</a>
      {megamenu.map(item => (
        <div className="megaItem" key={item.label}>
          <a
            href="#"
            onClick={e => { e.preventDefault(); setPage(`category:${CATEGORY_SLUGS[item.label] || "dresses"}`); }}
          >
            {item.label}
          </a>
          <div className="megadrop">
            {item.cols.map((col, i) => (
              <div className="megaCol" key={i}>
                {col.title && <div className="megaColTitle">{col.title}</div>}
                {col.links.map(l => (
                  <a
                    key={l}
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      const slug = LINK_TO_CATEGORY[l] || CATEGORY_SLUGS[item.label] || "dresses";
                      setPage(`category:${slug}`);
                    }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
            <div className="megaImg">
              <img src={item.img} alt={item.label} />
              <div className="absolute">
                <button
                  style={{ backgroundColor: item.btnColor }}
                  onClick={() => setPage(`category:${CATEGORY_SLUGS[item.label] || "dresses"}`)}
                >
                  SHOW ALL
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <a href="#" className="hotSale" onClick={e => { e.preventDefault(); setPage("category:dresses"); }}>
        {t.nav.sales}
      </a>
    </nav>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
export default function Header({ page, setPage, megamenu, sidebarCategories, cartCount = 0, wishlistCount = 0 }) {
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const prevScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY;
      setHidden(cur > prevScroll.current && cur > 80);
      prevScroll.current = cur;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} sidebarCategories={sidebarCategories} />
      <TopBar />
      <header className={`mainHeader${hidden ? " hidden" : ""}`}>
        <button className="hamburgerBtn" onClick={() => setSidebarOpen(true)}>
          <span /><span /><span />
        </button>
        <div className="logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
          <span className="logoPlaceholder">MY ESHOP</span>
        </div>
        <MegaNav megamenu={megamenu} setPage={setPage} />
        <div className="headerActions">
          <SearchDropdown
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            hotSearches={hotSearches}
            recommendedSearches={recommendedSearches}
            onSearch={(query) => console.log("Search for:", query)}
          />
          <LanguageSwitcher />
          <FontAwesomeIcon icon={faSearch} className="iconBtn" onClick={() => setSearchOpen(!searchOpen)} title={t.header.search} />
          <FontAwesomeIcon icon={faUser} className="iconBtn" onClick={() => setPage("register")} title={t.header.account} />
          <button className="iconBtn cartIconBtn" onClick={() => setPage("wishlist")} title={t.header.wishlist}>
            <FontAwesomeIcon icon={faHeart} />
            {wishlistCount > 0 && <span className="cartBadge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>}
          </button>
          <button className="iconBtn cartIconBtn" onClick={() => setPage("cart")} title={t.header.cart}>
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="cartBadge">{cartCount > 99 ? "99+" : cartCount}</span>}
          </button>
        </div>
      </header>
    </>
  );
}
