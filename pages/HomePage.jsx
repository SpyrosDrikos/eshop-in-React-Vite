import ProductSlider from "../components/ProductSlider";
import HotCategories from "../components/HotCategories";
import PreFooter from "../components/PreFooter";
import { useI18n } from "../src/i18n/i18ncontext";
import PromoBanner from "../components/PromoBanner";

function Hero() {
  const { t } = useI18n();
  const [line1, line2] = t.hero.title.split("\n");
  return (
    <div className="hero">
      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80" alt="Hero" />
      <div className="heroOverlay">
        <div className="heroContent">
          <h1>{line1}<br />{line2}</h1>
          <button onClick={() => setPage("category:dresses")}>{t.hero.buyNow}</button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ clothes, shoes, hotCategories, promises, footerCols, setPage, onAddToCart, wishlistItems, onToggleWishlist }) {
  return (
    <>
      <Hero setPage={setPage}/>
      <PromoBanner 
        title="Limited Time Offer"
        subtitle="Get up to 50% off on selected items. Don't miss out!"
        buttonText="Shop Now"
        buttonLink="#"
        image="https://images.unsplash.com/photo-1515222134207-3a0f31f9eeac?w=1200&q=80"
      />
      <ProductSlider clothes={clothes} shoes={shoes} onAddToCart={onAddToCart} wishlistItems={wishlistItems} onToggleWishlist={onToggleWishlist} />
      <HotCategories categories={hotCategories} setPage={setPage} />
      <PreFooter promises={promises} footerCols={footerCols} />
    </>
  );
}
