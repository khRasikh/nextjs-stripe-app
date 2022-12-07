import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Apple from "../public/images/apple.png";

export function Index() {
  const router = useRouter();

  const list = [
    {
      id: 100,
      name: "Apple One",
      href: "/propsa",
      alt: "Nature",
      address: Apple,
      price: 10,
      currency: "EURO",
      details:
        "Props is one of the basic topic and crucial to learn in TypeScript Programming Language. In this practice, I've used it...",
    },
    {
      id: 100,
      name: "Apple Two",
      href: "/propsb",
      alt: "Nature",
      address: Apple,
      price: 20,
      currency: "EURO",
      details:
        "Props is one of the basic topic and crucial to learn in TypeScript Programming Language. In this practice, I've used it...",
    },
  ];
  const [picture, setPicture] = useState(Apple);
  return (
    <>
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify text-center gap-6">
          {list.map((item) => (
            <div key={item.id} className="flex justify-center">
              <div className="rounded-lg shadow-lg bg-white max-w-lg">
                <div className="l px-3 my-5">
                  <Image src={picture} alt={"Apple"} />
                  <div className="flex justify-between">
                    <div className="text-gray-900 text-xl font-medium mb-2">
                      {item.name}
                    </div>
                    <div className="text-gray-900 text-xl font-medium mb-2">
                      {item.currency == "EURO" ? "€" : "$"} {item.price}
                    </div>
                  </div>
                  <div className="text-gray-700 text-base mb-4 justify ">
                    {item.details}
                  </div>
                  <div className="flex justify-center mb-6">
                    <button
                      type="button"
                      onClick={() => router.push("/checkout-card")}
                      className="flex bg-green-600 py-1 px-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                      <div className="w-full h-5 pt-1 mx-2">Purchase</div>
                    </button>
                    {/* <Link href={"/checkout-card"}>Purchase</Link> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Index;
