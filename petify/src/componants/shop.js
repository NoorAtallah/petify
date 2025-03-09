import React, { useState } from 'react';
import ProductDetails from './product';
import { Link } from 'react-router-dom';
import img from '../images/shop/2.png';
import img1 from '../images/shop/pngwing.com (8).png';
import img2 from '../images/shop/PngItem_2283980.png';
import img3 from '../images/shop/PngItem_3006922.png';
import img4 from '../images/shop/PngItem_3740431.png';
import img5 from '../images/shop/PngItem_3967835.png';
import img6 from '../images/shop/PngItem_3968564.png';
import img7 from '../images/shop/PngItem_3971109.png';
import img8 from '../images/shop/PngItem_5691048.png';
import img9 from '../images/shop/pngwing.com (11).png';
const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({
    pet: {
      dog: false,
      cat: false,
      fish: false,
      bird: false,
      smallPet: false,
    },
    productType: {
      dryFood: false,
      wetFood: false,
      treats: false,
      accessories: false,
    },
    priceRange: 50,
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleCheckboxChange = (category, option) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [option]: !prevFilters[category][option],
      },
    }));
  };
  const handlePriceChange = (e) => setFilters({ ...filters, priceRange: e.target.value });

  const products = [
    { id: 1, image: (img1), name: 'Product 1', price: 1.00 },
    { id: 2, image: (img2), name: 'Product 2', price: 12.00 },
    { id: 3, image: (img3), name: 'Product 3', price: 12.00 },
    { id: 4, image: (img4), name: 'Product 4', price: 12.00 },
    { id: 5, image: (img5), name: 'Product 5', price: 12.00 },
    { id: 6, image: (img6), name: 'Product 6', price: 12.00 },
    { id: 7, image: (img7), name: 'Product 7', price: 12.00 },
    { id: 8, image: (img8), name: 'Product 8', price: 12.00 },
    { id: 9, image: (img9), name: 'Product 9', price: 12.00 },
  ];

  return (
    <div className="container mx-auto p-6 ">
      {/* Hero Section */}
      <div className="hero-section " style={{width:' width: 100%;'}}>
        <img
          src={img}
          alt="Hero Section"
          className="hero-image" style={{width:'100%'}}
        />
        <div className="hero-overlay">
          {/* Add content for overlay if needed */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-20">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-[#8E7B70] rounded-xl p-2 mb-4 md:mb-0"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4 mb-6 md:mb-0">
          <h2 className="font-semibold mb-2">Pet</h2>
          <div>
            {Object.keys(filters.pet).map((pet) => (
              <label key={pet} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.pet[pet]}
                  onChange={() => handleCheckboxChange('pet', pet)}
                />
                {pet.charAt(0).toUpperCase() + pet.slice(1)}
              </label>
            ))}
          </div>

          <h2 className="font-semibold mt-4 mb-2 text-black">Product type</h2>
          <div>
            {Object.keys(filters.productType).map((type) => (
              <label key={type} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.productType[type]}
                  onChange={() => handleCheckboxChange('productType', type)}
                />
                {type.split(/(?=[A-Z])/).join(' ')}
              </label>
            ))}
          </div>

          <h2 className="font-semibold mt-4 mb-2 text-black">Price</h2>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.priceRange}
            onChange={handlePriceChange}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col items-center">
              <img src={product.image} alt="Product Image" className="w-full h-48 object-contain mb-4" />
              <Link to='/product'><h3 className="font-semibold mb-2 text-center">{product.name}</h3></Link>
              <p className="text-gray-500 mb-4 text-center">{product.price} jd</p>
              <a href="cart.html"><button className="bg-[#8E7B70] text-white rounded-md px-4 py-2">Add to Cart</button></a>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button className="border border-gray-300 rounded-md px-4 py-2 mr-2">1</button>
        <button className="border border-gray-300 rounded-md px-4 py-2 mr-2">2</button>
        <button className="border border-gray-300 rounded-md px-4 py-2">3</button>
      </div>
    </div>
  );
};

export default ProductPage;
