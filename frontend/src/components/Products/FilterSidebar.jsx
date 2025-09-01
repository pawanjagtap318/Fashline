import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tooltipPos, setTooltipPos] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (priceRange[1] / 100) * rect.width;
    setTooltipPos(percent);
  };

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [openSections, setOpenSections] = useState({
    category: true,
    gender: true,
    color: true,
    size: false,
    material: false,
    brand: false,
    price: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Beige", "Black", "Blue", "Blue Floral", "Brown", "Burgundy", "Camel",
    "Charcoal", "Charcoal Grey", "Cream", "Dark Blue", "Dark Green", "Dark Grey",
    "Dark Wash", "Emerald Green", "Floral Print", "Forest Green", "Gray", "Grey",
    "Heather Gray", "Heather Grey", "Khaki", "Lavender", "Light Blue", "Light Brown",
    "Light Green", "Light Wash", "Maroon", "Medium Blue", "Medium Wash", "Navy",
    "Navy Blue", "Navy Palms", "Oatmeal", "Olive", "Olive Green", "Orange", "Pink",
    "Pink Floral", "Red", "Rust", "Rust Red", "Silver", "Striped", "Terracotta",
    "Tropical Print", "Voilet", "White", "Yellow", "Yellow Floral"
  ];
  const colorMap = {
    "Beige": "#F5F5DC",
    "Black": "#000000",
    "Blue": "#0000FF",
    "Blue Floral": "#3F88C5",
    "Brown": "#8B4513",
    "Burgundy": "#800020",
    "Camel": "#C19A6B",
    "Charcoal": "#36454F",
    "Charcoal Grey": "#4A4A4A",
    "Cream": "#FFFDD0",
    "Dark Blue": "#00008B",
    "Dark Green": "#006400",
    "Dark Grey": "#2F4F4F",
    "Dark Wash": "#223A5E",
    "Emerald Green": "#50C878",
    "Floral Print": "#FF69B4",
    "Forest Green": "#228B22",
    "Gray": "#808080",
    "Grey": "#808080",
    "Heather Gray": "#9CA3AF",
    "Heather Grey": "#9CA3AF",
    "Khaki": "#C3B091",
    "Lavender": "#E6E6FA",
    "Light Blue": "#ADD8E6",
    "Light Brown": "#A0522D",
    "Light Green": "#90EE90",
    "Light Wash": "#A7C7E7",
    "Maroon": "#800000",
    "Medium Blue": "#4682B4",
    "Medium Wash": "#6A8CA7",
    "Navy": "#000080",
    "Navy Blue": "#000080",
    "Navy Palms": "#1D2951",
    "Oatmeal": "#D9CBB6",
    "Olive": "#808000",
    "Olive Green": "#556B2F",
    "Orange": "#FFA500",
    "Pink": "#FFC0CB",
    "Pink Floral": "#FFB6C1",
    "Red": "#FF0000",
    "Rust": "#B7410E",
    "Rust Red": "#8B3103",
    "Silver": "#C0C0C0",
    "Striped": "#CCCCCC",
    "Terracotta": "#E2725B",
    "Tropical Print": "#32CD32",
    "Voilet": "#8A2BE2",
    "White": "#FFFFFF",
    "Yellow": "#FFFF00",
    "Yellow Floral": "#FFD700"
  };
  const sizes = [
    "XS", "S", "M", "L", "XL", "XXL", "XXXL",
    "26", "27", "28", "29", "30", "31", "32",
    "34", "36", "38", "38R", "40R", "42L", "44L"
  ];
  const materials = [
    'Corduroy', 'Cotton', 'Cotton Blend', 'Cotton Canvas', 'Cotton Twill',
    'Denim', 'Fleece', 'Knit', 'Knitted Fabric', 'Linen Blend',
    'Nylon', 'Polyester', 'Polyester Blend', 'Rayon', 'Ribbed Knit',
    'Silk Blend', 'Viscose', 'Wool Blend'
  ];
  const brands = [
    'ActiveWear', 'Beach Breeze', 'BohoVibes', 'BreezyVibes', 'Casual Comfort',
    'Casual Threads', 'CasualLook', 'Chic & Co.', 'Chic & Cozy', 'ChicKnit',
    'ChicStyle', 'ChicWrap', 'ChillZone', 'ClassicStyle', 'ComfortFit',
    'ComfyFit', 'ComfyTees', 'Cozy Knits', 'CozyWear', 'DelicateWear',
    'Denim Revival', 'DenimCo', 'DenimStyle', 'Elegance', 'Elegant Wear',
    'ElegantStyle', 'ElegantWear', 'Everyday Comfort', 'Everyday Style',
    'ExecutiveStyle', 'Fashion Finds', 'FeminineWear', 'Flowy Fashion',
    'Formal Finery', "Gentleman's Closet", 'Heritage Wear', 'LoungeWear',
    'Modern Fit', 'Outdoor Gear', 'Polo Classics', 'Retro Denim', 'SportX',
    'Street Style', 'Street Vibes', 'StreetStyle', 'StreetWear', 'Summer Days',
    'SunnyStyle', 'Tailored Threads', 'Urban Chic', 'Urban Outdoors',
    'Urban Threads', 'UrbanStyle', 'Winter Basics', 'WinterStyle'
  ];
  const genders = ["Men", "Women", "Unisex"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });

    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`); // ?category=Bottom+Wear&size=XS%2CS  => (%2C) = encoded version of ","
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);

    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);  // change
    updateURLParams(newFilters);
  }

  return (
    <aside className="p-2 bg-white rounded-2xl shadow-md 
                w-full  md:max-w-xs lg:max-w-sm xl:max-w-md
                sticky max-h-screen 
                overflow-y-auto overflow-x-hidden">
      <h3 className="text-2xl pl-2 pt-2 font-bold text-gray-800 mb-6">Filters</h3>

      {/* ============ CATEGORY ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Category
          {openSections.category ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        {openSections.category && (
          <div className="pl-1 space-y-1">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  onChange={handleFilterChange}
                  checked={filters.category === category}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ============ GENDER ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("gender")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Gender
          {openSections.gender ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        {openSections.gender && (
          <div className="pl-1 space-y-1">
            {genders.map((gender) => (
              <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  onChange={handleFilterChange}
                  checked={filters.gender === gender}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ============ COLORS ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("color")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Color
          {openSections.color ? <HiChevronUp /> : <HiChevronDown />}
        </button>

        {openSections.color && (
          <div className="flex flex-wrap gap-2 pl-2 pr-2">
            {colors.map((color) => (
              <div key={color} className="relative group mx-auto">
                <button
                  name="color"
                  value={color}
                  onClick={handleFilterChange}
                  className={`w-8 h-8 rounded-full border cursor-pointer transition hover:scale-110 ${filters.color === color ? "ring-2 ring-indigo-400" : "border-gray-300"
                    }`}
                  style={{
                    backgroundColor: colorMap[color] || "#D3D3D3",
                  }}
                />
                {/* Tooltip */}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                  {color}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ SIZES ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("size")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Size
          {openSections.size ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        {openSections.size && (
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <label
                key={size}
                className={`px-3 py-1 border rounded-md text-sm text-center cursor-pointer transition ${filters.size.includes(size)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <input
                  type="checkbox"
                  name="size"
                  value={size}
                  checked={filters.size.includes(size)}
                  onChange={handleFilterChange}
                  className="hidden"
                />
                {size}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ============ MATERIAL ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("material")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Material
          {openSections.material ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        {openSections.material && (
          <div className="pl-1 space-y-1">
            {materials.map((material) => (
              <label key={material} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="material"
                  value={material}
                  checked={filters.material.includes(material)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span>{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ============ BRANDS ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("brand")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Brand
          {openSections.brand ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        {openSections.brand && (
          <div className="pl-1 space-y-1">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="brand"
                  value={brand}
                  checked={filters.brand.includes(brand)}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ============ PRICE RANGE ============ */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex justify-between items-center text-gray-700 font-medium mb-2"
        >
          Price Range
          {openSections.price ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        {openSections.price && (
          <div className="relative">
            <input
              type="range"
              name="priceRange"
              min={0}
              max={100}
              value={priceRange[1]}
              onChange={handlePriceChange}
              onMouseMove={handleMouseMove}
              className="w-full accent-indigo-600"
            />

            {/* Tooltip */}
            <div
              className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow pointer-events-none transition"
              style={{ left: `${tooltipPos}px`, transform: "translateX(-50%)" }}
            >
              ${priceRange[1]}
            </div>

            <div className="flex justify-between text-gray-600 mt-2 text-sm">
              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default FilterSidebar;
