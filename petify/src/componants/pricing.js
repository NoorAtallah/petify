import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Check } from 'lucide-react';

const PricingPlan = ({ title, price, features, onClick }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    }}
    className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-light rounded-lg border border-gray-200 shadow-md xl:p-8"
  >
    <h3 className="mb-4 text-2xl font-semibold text-[#2D3648]">{title}</h3>
    <div className="flex justify-center items-baseline my-8">
      <span className="mr-2 text-5xl font-extrabold text-[#2D3648]">{price}</span>
      <span className="text-gray-500">JD</span>
    </div>
    <ul role="list" className="mb-8 space-y-4 text-left">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <Check className="flex-shrink-0 w-5 h-5 text-[#00D1BD]" />
          <span className="text-[#2D3648]">{feature}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onClick}
      className="bg-brown hover:bg-green text-white font-medium rounded-md text-sm px-5 py-2.5 text-center transition-colors duration-200"
    >
      Subscribe Now
    </button>
  </motion.div>
);

const Pricing = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubscriptionClick = () => {
    if (isAuthenticated) {
      navigate('/subscription');
    } else {
      navigate('/login');
    }
  };

  const plans = [
    {
      title: "Monthly subscription",
      price: "9.27",
      features: [
        "Text conversations with a vet",
        "Share files with the veterinarian",
        "Unlimited text questions",
        "15 medical consultations"
      ]
    },
    {
      title: "Weekly subscription",
      price: "2.84",
      features: [
        "Text conversations with a vet",
        "Share files with the veterinarian",
        "Unlimited text questions",
        "3 medical consultations"
      ]
    }
  ];

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-[#2D3648]">Choose your Subscription</h2>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0 hover:">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              onClick={handleSubscriptionClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;