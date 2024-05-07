import React, { useState, useMemo } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiUrl } from "../../apiUrl";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import countryList from 'react-select-country-list'

const PaymentForm = ({ price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { token, error } = await stripe.createToken(elements.getElement(CardElement));

    if (error) {
      console.error(error);
      setPaymentError('Payment failed');
    } else {
      // Send token to your server
      const response = await fetch(`${apiUrl}/user/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price, // replace with the actual amount
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment on the client-side
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // Include any additional billing details if needed
          },
        },
      });

      if (result.error) {
        console.error(result.error);
        setPaymentError('Payment failed');
      } else if (result.paymentIntent.status === 'succeeded') {
        toast.success("Payment succeeded")
        // Payment succeeded
        setPaymentError(null);
        setPaymentSuccess(true)
        setTimeout(() => {
          navigate(-1)
        }, 1000);
      }
    }
  };
  const styles = {
    form: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    },
    cardContainer: {
      marginBottom: '20px',
    },
    payButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    error: {
      color: '#ff0000',
      marginTop: '10px',
    },
    successMessage: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      textAlign: 'center',
      margin: '20px auto',
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        color: '#333',
        '::placeholder': {
          color: '#999',
        },
      },
      invalid: {
        color: '#ff0000',
      },
    },
  };
  return (
    <><Toaster />
      <h1 className='text-2xl text-center my-3 font-bold'>Stripe Paymethod</h1>
      <h1 className='text-lg text-center my-3 underline'>Enter Payment Details</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.cardContainer}>
          <CardElement options={cardStyle} /><br />
          <Select options={options} value={value} onChange={changeHandler} />
        </div>
        <button type="submit" style={styles.payButton}>Pay</button>
        {paymentError && <div style={styles.error}>{paymentError}</div>}
        {paymentSuccess && <div style={styles.error}>{paymentSuccess}</div>}
      </form>
    </>
  );
};

export default PaymentForm;