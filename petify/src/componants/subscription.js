import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import DropIn from 'braintree-web-drop-in-react';
import axios from './api/axios';

const testCards = {
  visa: '4111111111111111',
  mastercard: '5555555555554444',
  amex: '378282246310005',
  discover: '6011111111111117',
  jcb: '3530111333300000'
};

const SubscriptionPayment = () => {
  const { user } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    { id: 'weekly', name: 'Weekly', amount: '2.84', description: 'Perfect for short-term needs' },
    { id: 'monthly', name: 'Monthly', amount: '9.27', description: 'Our most popular plan' }
  ];

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const { data } = await axios.get('/pay/braintree/getToken');
        setClientToken(data.clientToken);
      } catch (error) {
        console.error('Error fetching client token', error);
        setError('Failed to initialize payment system. Please try again later.');
      }
    };
    fetchClientToken();
  }, []);

  const handlePayment = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: plans.find(plan => plan.id === selectedPlan).amount,
        userId: user?.id, 
        plan: selectedPlan
      };
      console.log('Payment data being sent:', paymentData);
      
      const response = await axios.post('/pay/braintree/processPayment', paymentData);
  
      if (response.data.success) {
        setPaymentSuccess(true);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment failed', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      setError('An error occurred during payment. Please try again.');
    }
  };

  return (
    <section className="subscription-payment min-h-screen py-12 ">
      <div className="payment-container max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-brown">Choose Your Subscription Plan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              className={`border rounded-lg p-6 cursor-pointer ${selectedPlan === plan.id ? 'border-bermuda bg-customGray' : 'border-customGray hover:border-bermuda'}`}
              onClick={() => setSelectedPlan(plan.id)}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-brown">{plan.name}</h2>
              <p className="text-3xl font-bold text-green mb-4">${plan.amount} JD</p>
              <p className="text-brown mb-4">{plan.description}</p>
              <div className={`w-full py-2 px-4 rounded text-center ${selectedPlan === plan.id ? 'bg-bermuda text-white' : 'bg-customGray text-brown'}`}>
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </div>
            </motion.div>
          ))}
        </div>

        {error && <p className="error-message text-red-500 mb-4">{error}</p>}

        {clientToken && (
          <div className="braintree-container mb-8">
            <DropIn
              options={{ authorization: clientToken }}
              onInstance={(instance) => setInstance(instance)}
            />
            <motion.button
              className="pay-btn bg-green text-white py-3 px-6 rounded-lg hover:bg-bermuda transition duration-300 w-full mt-6 text-lg font-semibold"
              onClick={handlePayment}
              whileHover={{ scale: 1.05 }}
            >
              Pay Now
            </motion.button>
          </div>
        )}

        {paymentSuccess && <p className="success-message text-green font-semibold mt-4 text-center text-lg">Payment Successful!</p>}
      </div>
    </section>
  );
};

export default SubscriptionPayment;