import React from "react";
import Checkoutform from "./Checkoutform";
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
import { Link, useLocation } from "react-router-dom";

const Payment = () => {
  let location = useLocation()
  const stripePromise = loadStripe("pk_test_51PC4pkIZenX8hPrmh6DZ9tucXeYTM7LIR7vsO0UYgJtUibabcAJgEZR6gqotAILmlPH8vK027qA4slNmWLm1ypyq002zLDR6MR");

  const options = {
    mode: "payment",
    amount: 1099,
    currency: "usd",

  };
  return (
    <div>
      <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
      <Elements stripe={stripePromise} options={options}>
        <Checkoutform price={location.state.price * 100} />
      </Elements>
    </div>
  );
};

export default Payment;
