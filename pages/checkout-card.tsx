import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";
import getStripe from "../utils/get-stripejs";
import * as config from "../config";
import CardLayout from "../components/CardLayout";
import CardFormElements from "../components/CardFormElements";
import { fetchPostJSON } from "../utils/api-helpers";

const CheckoutPage: NextPage = () => {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  useEffect(() => {
    fetchPostJSON("/api/payment_intents", {
      amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    }).then((data: any) => {
      setPaymentIntent(data);
    });
  }, [setPaymentIntent]);

  return (
    <CardLayout title="Make my Payment">
      <div>
        {paymentIntent && paymentIntent.client_secret ? (
          <Elements
            stripe={getStripe()}
            options={{
              appearance: {
                variables: {
                  colorIcon: "#6772e5",
                  fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                },
              },
              clientSecret: paymentIntent.client_secret,
            }}
          >
            <CardFormElements paymentIntent={paymentIntent} />
          </Elements>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div></div>
    </CardLayout>
  );
};

export default CheckoutPage;
