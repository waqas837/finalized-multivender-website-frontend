import React, { useEffect, useState } from "react";
import { apiUrl } from "../../apiUrl";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import RemainingTime from "./RemainingTime";

function OrderListPage() {
  const { sellerId } = useParams();
  const [setOrderList, setsetOrderList] = useState([])
  const [render, setrender] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllOrderForSeller()
  }, [render]);

  const getAllOrderForSeller = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/user/getSellersOrder/${sellerId}`);
      console.log("let logs the user data", data);
      if (data.success) {
        setsetOrderList(data.allOrders);
        console.log("data.allOrders", data.allOrders);
      } else {
        toast.error("Internal server error")
      }

    } catch (error) {
      console.log("Err in function getAllUserData", error);
    }
  };

  // also for Deliver Now
  const handleAcceptOffer = async (orderId, buyerid, sellerid, projectStatus) => {
    try {

      if (projectStatus === "Deliver now") {
        navigate(`/projectDeliver/${orderId}`)
        // let { data } = await axios.patch(`${apiUrl}/user/offerAcceptedBySeller/delivernow/${orderId}`);
        if (data.success) {
          setrender(!render)
        }
      }
      else if (projectStatus === "Accept Offer") {
        let { data } = await axios.patch(`${apiUrl}/user/offerAcceptedBySeller/${orderId}`);
        if (data.success) {
          setrender(!render)
        }
      };

    } catch (error) {
      console.log("error", error)
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
      <h1 className="text-3xl font-bold mb-8 underline text-center">All Seller Sales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center p-5">
        {setOrderList && setOrderList.map((order, index) => (
          <div
            key={order.id}
            className="bg-white rounded-lg overflow-hidden shadow-xl border-2 text-center md:text-left"
          >
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold mb-2">Order #{index + 1}</h2>
              <p className="text-gray-600 mb-2">Project: {order.projectDesc}</p>
              <p className="text-gray-600 mb-2">
                Delivery Time: {order.acceptedBySeller ? <RemainingTime remainTime={order.deliveryTime} /> : order.deliveryTime}
              </p>
              <p className="text-gray-600 mb-2">
                Price: ${order.Price}
              </p>
              <button className="text-gray-600 mb-2" onClick={() => navigate(`/buyer/${order.buyerId._id}`, { state: { userVisit: true } })}>
                Offered by: {order.buyerId.email}
              </button>
            </div>
            <div className="px-6 pb-4 flex justify-between items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                {order.acceptedBySeller && !order.markAsCompleteBySeller ? "Order Started" : order.markAsCompleteBySeller && order.acceptedBySeller && !order.markAsCompleteByBuyer ? "Waiting for Buyer to accept order" : order.markAsCompleteBySeller && order.markAsCompleteByBuyer ? "Order Completed" : "Accept Order"}
              </span>
              <button
                onClick={() => handleAcceptOffer(order._id, order.buyerId._id, order.sellerId, !order.acceptedBySeller ? "Accept Offer" : "Deliver now")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                disabled={order.markAsCompleteBySeller && order.acceptedBySeller}
              >
                {order.markAsCompleteBySeller && order.acceptedBySeller && !order.markAsCompleteByBuyer ? "You delivered" : !order.markAsCompleteBySeller && !order.acceptedBySeller ? "Accept Offer" : !order.markAsCompleteBySeller && order.acceptedBySeller ? "Deliver Now" : order.markAsCompleteBySeller && order.markAsCompleteByBuyer ? "Order Completed" : ""}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}

export default OrderListPage;
