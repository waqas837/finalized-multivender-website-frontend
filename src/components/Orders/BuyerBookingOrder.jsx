import React, { useEffect, useState } from "react";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../apiUrl";
import RemainingTime from "./RemainingTime";

function BookingOrder({ fromMyProfile }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [project, setProject] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [price, setPrice] = useState("");
  const [Order, setOrder] = useState(false);
  const { sellerid, gigid } = useParams();
  const [OrderDetails, setOrderDetails] = useState(null);
  const [render, setrender] = useState(false);
  const [ShowFile, setShowFile] = useState(false);
  const [OrderId, setOrderId] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    let buyer = localStorage.getItem("cUser");
    if (!buyer) {
      toast("Please Login to book an order");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    getAllOrder();
  }, [render]);

  // Function to get today's date in the correct format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month or day is less than 10
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

  const getAllOrder = async () => {
    let buyer = localStorage.getItem("cUser");
    let buyerParseddata = JSON.parse(buyer);
    let { data } = await axios.get(
      `${apiUrl}/user/getAllBueryOrders/${buyerParseddata._id}`
    );
    if (data.success) {
      console.log("data.allOrders", data.allOrders);
      setOrderDetails(data.allOrders);
    }
  };

  const projectMarkAscompletedByBuyer = async (OrderId, price) => {
    try {
      let { data } = await axios.get(
        `${apiUrl}/user/buyerOrderCompleted/${OrderId}`
      );
      if (data.success) {
        console.log("data.allOrders", data.allOrders);
        navigate("/payment", { state: { OrderId, price } });
      }
    } catch (error) {
      console.log("error in projectMarkAscompletedByBuyer", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let buyer = localStorage.getItem("cUser");
    if (!buyer) return;
    let buyerParseddata = JSON.parse(buyer);
    // Validate form fields
    if (!project || !deliveryTime || !price) {
      toast.error("Please fill in all fields");
      return;
    }
    // Submit the form data
    // onBook({ project, deliveryTime, price });
    setIsProcessing(true);
    // Clear form fields
    setProject("");
    setDeliveryTime("");
    setPrice("");
    let Adata = { proejctDesc: project, deliveryTime, price };
    // Simulate order request
    let { data } = await axios.post(
      `${apiUrl}/user/orderRequestByBuyer/${buyerParseddata._id}/${sellerid}/${gigid}`,
      Adata
    );
    if (data.success) {
      setrender(!render);
      console.log("data", data);
      setIsProcessing(false);
      setOrderStatus(
        "Your order has been Requested! Return to this page to see the order status while seller accepts your offer."
      );
      setOrder(true);
    }
  };

  // rate the Seller contains start rating and add a comment
  const rateSeller = async (orderid, gigId, sellerId, buyerId) => {
    navigate(`/rateProject/${orderid}/${gigId}/${sellerId}/${buyerId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Link className="text-sm text-blue-500" to={"/"}>
        &larr; Home
      </Link>
      <Toaster />
      {!Order && (
        <div>
          {!fromMyProfile && (
            <>
              <h1 className="text-3xl font-bold mb-4 text-center">
                Book Your Order
              </h1>
              <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="project"
                  >
                    Project Description
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="project"
                    rows="4"
                    placeholder="Briefly describe your project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="deliveryTime"
                  >
                    Delivery Time
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="deliveryTime"
                    type="date"
                    min={getTodayDate()}
                    placeholder="Estimated delivery time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="price"
                    type="number"
                    placeholder="Price in USD"
                    min={10}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                {isProcessing ? (
                  <p className="text-blue-500 font-semibold mt-4">
                    Processing your order...
                  </p>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 inline-block"
                  >
                    Request Order
                  </button>
                )}
                {orderStatus && (
                  <p className="text-green-500 font-semibold mt-4">
                    {orderStatus}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      )}
      {/*  if order offer accepted*/}
      <section class="py-24 relative">
        <div class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
          <h2 class="font-manrope font-bold text-4xl leading-10 text-black text-center">
            Your Offer Order List
          </h2>
          <p class="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
            Your order with other sellers shown below with their respective
            status
          </p>
          <div class="m-auto font-bold">
            <h1 className="text-2xl text-center">Orders List</h1>
          </div>
          {OrderDetails &&
            OrderDetails.map((val, index) => (
              <div
                key={index}
                class="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full shadow-lg"
              >
                <div class="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200"></div>
                <div class="w-full px-3 min-[400px]:px-6">
                  <div class="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                    <div class="img-box max-lg:w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                        />
                      </svg>
                    </div>
                    <div class="flex flex-row items-center w-full ">
                      <div class="grid grid-cols-1 lg:grid-cols-2 w-full">
                        <div class="flex items-center">
                          <div class="">
                            <h2 class="font-semibold text-xl leading-8 text-black mb-3">
                              {val.projectDesc}
                            </h2>
                            <button
                              onClick={() =>
                                navigate(`/seller/${val.sellerId._id}`, {
                                  state: { userVisit: true },
                                })
                              }
                              class="font-normal text-lg leading-8 text-gray-500 mb-3 "
                            >
                              Seller: {val.sellerId.email}
                            </button>
                            <div class="flex items-center">
                              <p class="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                <p>Note:Pay on completed project</p>
                                <button
                                  onClick={() =>
                                    val.acceptedBySeller &&
                                    val.markAsCompleteBySeller &&
                                    setShowFile(true)
                                  }
                                  class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
                                >
                                  <div className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      class="w-6 h-6"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                                      />
                                    </svg>

                                    {val.acceptedBySeller &&
                                    !val.markAsCompleteBySeller
                                      ? "Offer Accepted"
                                      : !val.acceptedBySeller &&
                                        !val.markAsCompleteBySeller
                                      ? "Offer is on the way"
                                      : val.acceptedBySeller &&
                                        val.markAsCompleteBySeller
                                      ? "Collect the project files And Rate The Seller"
                                      : ""}
                                  </div>
                                </button>
                              </p>
                              {/* {val.pojectCompleted && <Link
                              to={"/payment"}
                              type="button"
                              class="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-5 h-5"
                              >
                                <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              Pay Now
                            </Link>} */}
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-5">
                          <div class="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                            <div class="flex gap-3 lg:block">
                              <p class="font-medium text-sm leading-7 text-black">
                                price
                              </p>
                              <p class="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                                ${val.Price}
                              </p>
                            </div>
                          </div>
                          <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                            <div class="flex gap-3 lg:block">
                              <p class="font-medium text-sm leading-7 text-black">
                                Status
                              </p>
                              <p class="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 bg-emerald-50 text-emerald-600">
                                {val.markAsCompleteBySeller &&
                                !val.markAsCompleteByBuyer
                                  ? "Seller Delivered Project"
                                  : val.markAsCompleteBySeller &&
                                    val.markAsCompleteByBuyer
                                  ? "Project Completed & Closed"
                                  : "Pending"}
                              </p>
                              <br />
                            </div>
                          </div>
                          <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                            <div class="flex gap-3 lg:block">
                              <p class="font-medium text-sm whitespace-nowrap leading-6 text-black">
                                Expected Delivery Time
                              </p>
                              <p class="font-medium text-base leading-7 lg:mt-3 text-emerald-500">
                                {val.acceptedBySeller ? (
                                  <RemainingTime
                                    remainTime={val.deliveryTime}
                                  />
                                ) : (
                                  "Waiting for seller"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {ShowFile && val.markAsCompleteBySeller && (
                    <div className="my-3 shadow-lg border-2 rounded-md text-center">
                      <h1 className="text-lg font-bold">
                        Project Files sent by Seller
                      </h1>
                      <h2>Please collect the delivery</h2>
                      <section className="">
                        {val.projectFilePaths.map((val, index) => (
                          <div key={index}>
                            <div className="flex justify-center items-center">
                              {val}{" "}
                              <a
                                download={`${apiUrl}/images/${val}`}
                                href={`${apiUrl}/images/${val}`}
                              >
                                <div className="flex justify-around w-32">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-6 h-6"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      className="text-blue-400"
                                      d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                  <span>Download</span>
                                </div>
                              </a>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-around">
                          <button
                            onClick={() =>
                              projectMarkAscompletedByBuyer(val._id, val.Price)
                            }
                            type="submit"
                            className="my-2 w-4/12 text-white bg-yellow-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            <div className="flex justify-center items-center space-x-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>

                              <span>Project Mark As Complete and PAY</span>
                            </div>
                          </button>
                          <button
                            onClick={() =>
                              rateSeller(
                                val._id,
                                val.gigId,
                                val.sellerId._id,
                                val.buyerId
                              )
                            }
                            className="my-2 w-4/12 text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            <div className="flex justify-center items-center space-x-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                />
                              </svg>
                              <span>Rate The Seller Now</span>
                            </div>
                          </button>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default BookingOrder;
