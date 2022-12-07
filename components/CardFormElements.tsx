import React, { useState, FC } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";

import * as config from "../config";
import PrintObject from "./PrintObject";
import CustomInputs from "./CustomInputs";
import {
  formatAmountForDisplay,
  formatAmountFromStripe,
} from "../utils/stripe-helpers";
import { fetchPostJSON } from "../utils/api-helpers";

const CardFormElements: FC<{
  paymentIntent?: PaymentIntent | null;
}> = ({ paymentIntent = null }) => {
  const defaultAmout = paymentIntent
    ? formatAmountFromStripe(paymentIntent.amount, paymentIntent.currency)
    : Math.round(config.DEFAULT_AMOUNT);

  const [input, setInput] = useState({
    customDonation: defaultAmout,
    cardholderName: "",
  });
  const [paymentType, setPaymentType] = useState("");
  const [payment, setPayment] = useState({ status: "initial" });
  const [errorMessage, setErrorMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case "processing":
        return <h2>Processing payment....</h2>;

      case "requires_payment_method":
        return <h2>Proccessing paymnet method...</h2>;

      case "requires_confirmation":
        return <h2>Processing...</h2>;

      case "requires_action":
        return <h2>Authenticating...</h2>;

      case "succeeded":
        return <h2>Payment Succeeded 🥳</h2>;

      case "error":
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        );

      default:
        return null;
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // Abort if form isn't valid
    if (!e.currentTarget.reportValidity()) return;
    if (!elements) return;
    setPayment({ status: "processing" });

    // Create a PaymentIntent with the specified amount.
    const response = await fetchPostJSON("/api/payment_intents", {
      amount: input.customDonation,
      payment_intent_id: paymentIntent?.id,
    });
    setPayment(response);

    if (response.statusCode === 500) {
      setPayment({ status: "error" });
      setErrorMessage(response.message);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error } = await stripe!.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success-payment`,
        payment_method_data: {
          billing_details: {
            name: input.cardholderName,
          },
        },
      },
    });

    if (error) {
      setPayment({ status: "error" });
      setErrorMessage(error.message ?? "An unknown error occurred");
    } else if (paymentIntent) {
      setPayment(paymentIntent);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 md:grid md:grid-cols-2 md:gap-4">
          <div className="bg-gray-100 px-6 py-6 rounded-md">
            <CustomInputs
              className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              name="customDonation"
              value={input.customDonation}
              min={config.MIN_AMOUNT}
              max={config.MAX_AMOUNT}
              step={config.AMOUNT_STEP}
              currency={config.CURRENCY}
              onChange={handleInputChange}
            />
          </div>
          <div className="bg-gray-100 px-6 py-6 rounded-md">
            <fieldset className="">
              <legend>Your payment details:</legend>
              {paymentType === "card" ? (
                <input
                  placeholder="Cardholder name"
                  className="placeholder:base placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 p-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                  type="Text"
                  name="cardholderName"
                  onChange={handleInputChange}
                  required
                />
              ) : null}
              <div className="">
                <PaymentElement
                  onChange={(e) => {
                    setPaymentType(e.value.type);
                  }}
                />
              </div>
            </fieldset>
            <button
              className="my-6 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              type="submit"
              disabled={
                !["initial", "succeeded", "error"].includes(payment.status) ||
                !stripe
              }
            >
              Make Payment{" "}
              {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
            </button>
          </div>
        </div>
      </form>
      <PaymentStatus status={payment.status} />
      <PrintObject content={payment} />
    </>
  );
};

export default CardFormElements;
