import React from "react";
import { PawPrint, Heart, Star, Users, Phone, Mail } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8">
      <PawPrint size={120} className="text-[#E8E1DA] opacity-20" />
    </div>
    <div className="h-2 bg-gradient-to-r from-[#00D1BD] to-[#78dcca] rounded-full mb-6"></div>
    <div className="p-3 bg-[#F6F3F0] rounded-full inline-block mb-4">
      <Icon className="w-6 h-6 text-[#967D6C]" />
    </div>
    <h2 className="text-2xl font-semibold text-[#967D6C] mb-4">{title}</h2>
    <p className="text-gray-700 leading-relaxed relative z-10">{description}</p>
  </div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen  flex flex-col items-center py-16 px-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section with Decorative Elements */}
        <div className="text-center mb-20 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <PawPrint
                  key={i}
                  size={24}
                  className="text-[#78dcca] transform rotate-45"
                />
              ))}
            </div>
          </div>
          <h1 className="text-6xl font-bold text-[#967D6C] mb-6">
            Welcome to Petify
            <span className="inline-block ml-4">
              <Heart className="inline-block text-[#00D1BD] w-12 h-12" />
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Where Every Pet Gets the Care They Deserve
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#78dcca] bg-opacity-20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#967D6C] mb-2">1000+</div>
            <div className="text-gray-700">Happy Pets Helped</div>
          </div>
          <div className="bg-[#78dcca] bg-opacity-20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#967D6C] mb-2">50+</div>
            <div className="text-gray-700">Certified Vets</div>
          </div>
          <div className="bg-[#78dcca] bg-opacity-20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#967D6C] mb-2">24/7</div>
            <div className="text-gray-700">Available Care</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <FeatureCard
            icon={Star}
            title="Our Mission"
            description="Petify is dedicated to making quality pet care accessible to all. We connect pet owners with certified veterinarians for virtual consultations, available whenever you need us."
          />
          <FeatureCard
            icon={Heart}
            title="Our Vision"
            description="We envision a world where every pet has access to immediate, quality healthcare. Through technology, we're making pet care more accessible than ever before."
          />
        </div>

        {/* Team Section with Interactive Elements */}
        <div className="bg-[#E8E1DA] rounded-2xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform -translate-y-1/2">
            <PawPrint size={200} className="text-white opacity-10" />
          </div>
          
          <div className="text-center mb-12">
            <Users className="w-12 h-12 text-[#967D6C] mx-auto mb-4" />
            <h2 className="text-3xl font-semibold text-[#967D6C] mb-6">Our Team</h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Our team of dedicated professionals shares a love for animals and a commitment
              to making a positive impact in the world of pet care.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <Phone className="w-8 h-8 text-[#00D1BD]" />
              <div>
                <h3 className="font-semibold text-[#967D6C]">24/7 Support</h3>
                <p className="text-gray-600">1-800-PETIFY</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <Mail className="w-8 h-8 text-[#00D1BD]" />
              <div>
                <h3 className="font-semibold text-[#967D6C]">Email Us</h3>
                <p className="text-gray-600">care@petify.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          {/* <button className="bg-[#00D1BD] text-white px-8 py-4 text-lg rounded-xl 
                           hover:bg-[#78dcca] transition duration-300 
                           transform hover:scale-105 shadow-md
                           flex items-center gap-2 mx-auto">
            <span>Join Our Pet-Loving Community</span>
            <PawPrint className="w-5 h-5" />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;