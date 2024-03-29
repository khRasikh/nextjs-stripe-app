import Link from "next/link";

const SucceededPayment = () => {
  return (
    <>
      <div className="my-12 mx-12 text-center">
        <h2 className="text-blue-700">
          Payment Has been successfully done!!! Thank you.
        </h2>
        <button
          type="button"
          className="my-6 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          <Link href={"/checkout-card"}>Make Another Payment</Link>
        </button>
      </div>
    </>
  );
};

export default SucceededPayment;
