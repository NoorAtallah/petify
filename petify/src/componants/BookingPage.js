import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PtwMNDFU3RUFuw9iyLgrZjh34FojrWRYEVcJvda7ehL2hgAZ7p1oewGQuavlFGX7ebtrT84YHXjQeLNt7kqZB9H00ZlqPxA9V');

const BookingPage = () => {
    const [meetingLink, setMeetingLink] = useState('');
    const [amount, setAmount] = useState(5000); // Amount in cents
    const [error, setError] = useState(null);

    const handleCreateMeeting = async () => {
        try {
            const { data } = await axios.post('/api/create-zoom-meeting');
            setMeetingLink(data.join_url);
        } catch (err) {
            setError('Error creating Zoom meeting');
        }
    };

    return (
        <div>
            <h1>Book a Consultation</h1>
            <button onClick={handleCreateMeeting}>Create Zoom Meeting</button>
            {meetingLink && <p>Join the meeting <a href={meetingLink} target="_blank" rel="noopener noreferrer">here</a></p>}
            <Elements stripe={stripePromise}>
                <CheckoutForm amount={amount} />
            </Elements>
        </div>
    );
};

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { error, paymentIntent } = await axios.post('/api/create-payment-intent', { amount });

        if (error) {
            console.error(error);
            return;
        }

        const { error: stripeError } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (stripeError) {
            console.error(stripeError);
        } else {
            alert('Payment successful');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay ${amount / 100}</button>
        </form>
    );
};

export default BookingPage;
