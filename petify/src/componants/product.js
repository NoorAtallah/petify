import React from 'react';
import 'flowbite';
import img from '../images/product/pngwing.com (8).png'
const ProductDetails = () => {
  return (
    <div className="flex flex-col md:flex-row items-start mb- mt-20">
      {/* Product Image */}
      <div className="w-full md:w-1/3">
        <img src={img} alt="Product Image" className="w-full h-auto mb-4 md:mb-0" />
      </div>

      {/* Product Info */}
      <div className="w-full md:w-2/3 md:pl-8 mt-20">
        <h1 className="text-2xl font-semibold mb-2">Hill's Prescription Diet c/d Multicare Chicken Flavor Dry Puppy Food</h1>
        {/* <p className="text-sm text-gray-500 mb-4">Size: 27.5-lb bag</p> */}

        {/* Size Options */}
        <div className="flex items-center space-x-2 mb-4 mt-16 text-left">
          <button className="border border-gray-300 rounded-md px-4 py-2">8.5-lb bag<br />$2/lb</button>
          <button className="border border-gray-300 rounded-md px-4 py-2">17.6-lb bag<br />$1.5/lb</button>
          <button className="border border-gray-300 rounded-md px-4 py-2">27.5-lb bag<br />$1.2/lb</button>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" className="border border-gray-300 rounded-md w-16 text-center" />
          </div>
          <button className="bg-brown text-white rounded-md px-8 py-2 mt-6">Add to Cart</button>
        </div>
      </div>

      {/* Accordion Section */}
     
    </div>
  );
};

export default ProductDetails;
