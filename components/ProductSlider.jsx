import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "../src/i18n/i18ncontext";

export default function ProductSlider({ clothes, shoes, onAddToCart }) {
  const { t } = useI18n();
  const [category, setCategory] = useState("clothes");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const items = category === "clothes" ? clothes : shoes;

  const getVisible = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
  };
  const [visible, setVisible] = useState(getVisible());

  useEffect(() => {
    const handler = () => setVisible(getVisible());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const maxSlide = items.length - visible;
  const next = () => setActiveSlide(s => (s >= maxSlide ? 0 : s + 1));
  const prev = () => setActiveSlide(s => (s <= 0 ? maxSlide : s - 1));

  useEffect(() => { 
    setActiveSlide(0);
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(s => (s >= maxSlide ? 0 : s + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [category, maxSlide]);

  const offset = -activeSlide * (100 / visible);

  const handleColorChange = (itemTitle, color) => {
    setSelectedColors(prev => ({ ...prev, [itemTitle]: color }));
  };

  const handleSizeChange = (itemTitle, size) => {
    setSelectedSizes(prev => ({ ...prev, [itemTitle]: size }));
  };


  const handleAddToCart = (item) => {
    if (onAddToCart) {
      // Convert slider item format to product format for cart
      onAddToCart({
        id: `slider-${item.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: item.title,
        price: item.price,
        src: item.src,
        brand: "",
        qty: 1
      });
    }
  };

  return (
    <div className="sliderSection">
      <div className="sliderViewport">
        <div className="sliderControls">
          <FontAwesomeIcon icon={faChevronLeft} onClick={prev} className={`controlBtn`} />
          <FontAwesomeIcon icon={faChevronRight} onClick={next} className={`controlBtn`}/>
        </div>
        <div className="sliderTrack" style={{ transform: `translateX(${offset}%)` }}>
          {items.map((item) => (
            <div className="slideCard" key={item.title} style={{ flex: `0 0 ${100 / visible}%` }}>
              <div className="slideInner">
                <FontAwesomeIcon icon={faHeart} className="wishlistBtn" />
                <img src={item.src} alt={item.title} />
                <div className="slideInfo">
                  <span className="slideTitle">{item.title}</span>
                  {item.price && (
                    <span className="slidePrice">€{item.price.toFixed(2)}</span>
                  )}
                  {/* <span className="slidePrice">${item.price}</span> */}
                  
                  <div className="colorSelector">
                    <label>Color:</label>
                    <div className="colorOptions"> 
                      {item.colors.map(color => (
                        <button
                          key={color}
                          className={`colorOption${selectedColors[item.title] === color ? " active" : ""}`}
                          onClick={() => handleColorChange(item.title, color)}
                          title={color}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sizeSelector">
                    <label>Size:</label>
                    <div className="sizeOptions">
                      {item.sizes.map(size => (
                        <button
                          key={size}
                          className={`sizeOption${selectedSizes[item.title] === size ? " active" : ""}`}
                          onClick={() => handleSizeChange(item.title, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="addToCart" onClick={() => handleAddToCart(item)}>
                  {t.product.addToCart}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="sliderWrapper">
          <button
            className={`sliderTab${category === "clothes" ? " active" : ""}`}
            onClick={() => setCategory("clothes")}
          >
            {t.sections.clothes}
          </button>
          <button
            className={`sliderTab${category === "shoes" ? " active" : ""}`}
            onClick={() => setCategory("shoes")}
          >
            {t.sections.shoes}
          </button>
        </div>
      </div>
    </div>
  );
}
