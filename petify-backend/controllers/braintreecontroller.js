const braintree = require('braintree');
const Subscription = require('../models/subscription');
require('dotenv').config();

// Setup Braintree gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Controller to generate Braintree token
exports.generateToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.send({ clientToken: response.clientToken });
  } catch (err) {
    res.status(500).send({ error: 'Failed to generate client token' });
  }
};

// Controller to handle payment and subscription
exports.processPayment = async (req, res) => {
    const { paymentMethodNonce, amount, userId, plan } = req.body;
  
    // Check if required fields are provided
    if (!paymentMethodNonce || !amount || !userId || !plan) {
      return res.status(400).send({ success: false, message: 'Missing required information' });
    }
  
    try {
      // Check if the user already has an active subscription
      const existingSubscription = await Subscription.findOne({ user: userId, isActive: true });
      if (existingSubscription) {
        return res.status(400).send({ success: false, message: 'User already has an active subscription' });
      }
  
      // Process the payment through Braintree
      const result = await gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: paymentMethodNonce,
        options: { submitForSettlement: true },
      });
  
      if (result.success) {
        // Payment successful, now save the subscription with the amount
        const newSubscription = new Subscription({
          user: userId,
          plan: plan,
          amount: amount,  // Save the amount in the subscription
          createdAt: new Date(),
          isActive: true
        });
  
        await newSubscription.save();
  
        res.send({ 
          success: true, 
          transactionId: result.transaction.id,
          subscription: {
            plan: plan,
            amount: amount, // Include the amount in the response
            startDate: newSubscription.createdAt,
            subscriptionId: newSubscription._id
          },
          message: 'Payment processed and subscription saved successfully'
        });
      } else {
        res.status(500).send({ success: false, message: result.message });
      }
    } catch (err) {
      console.error('Error processing payment or saving subscription:', err);
      res.status(500).send({ success: false, message: 'Payment processing or subscription saving failed' });
    }
  };
// Controller to check subscription status
exports.checkSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId);  // Log userId

  try {
    const subscription = await Subscription.findOne({ user: userId, isActive: true });
    if (subscription) {
      res.send({ isSubscribed: true, plan: subscription.plan, subscriptionId: subscription._id });
    } else {
      res.send({ isSubscribed: false });
    }
  } catch (err) {
    console.error('Error checking subscription status:', err);
    res.status(500).send({ success: false, message: 'Failed to check subscription status' });
  }
};
