import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../apiUrl';
import StarRatings from "react-star-ratings"

const GigDetailsPage = () => {
  const { gigId } = useParams();
  const [gigDetails, setGigDetails] = useState([]);

  useEffect(() => {
    getSingleGigDetails();
  }, []);
  const getSingleGigDetails = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/user/getSingleProduct/${gigId}`);
      setGigDetails(data.data);

      console.log("Products must be ", data);
    } catch (error) {
      console.log("Err in function getSingleGigDetails", error);
    }
  };

  return (
    <div>
      <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
      <h1 className='my-10 text-xl font-bold text-center text-gray-500'>{gigDetails && gigDetails.title}</h1>
      <div className="text bg-white rounded-lg overflow-hidden shadow-lg ring-opacity-40 max-w-sm m-auto">
        <div className="relative cursor-pointer">
          <img
            width={500}
            height={500}
            src={`${apiUrl}/images/${gigDetails && gigDetails.productimg}`}
            alt="Product Image"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">{gigDetails && gigDetails.title}</h3>
          <h3 className="text-lg font-medium mb-2">
            {gigDetails && gigDetails.category}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {gigDetails && gigDetails.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">
              Price ${gigDetails && gigDetails.price}
            </span>
            <span className="font-bold">
              Order Completed ({gigDetails && gigDetails.completedOrders})
            </span>
          </div>
        </div>
      </div>
      {/* Comments and Ratings Section */}
      <h2 class="mt-20 font-black text-black text-center text-3xl leading-none uppercase max-w-2xl mx-auto  ">Customer Reviews</h2>
      <section class="bg-white px-4 py-12 md:py-24 flex flex-wrap justify-center">
        {gigDetails && gigDetails.commentsAndRating && gigDetails.commentsAndRating.map((val, index) => (
          <div class="max-w-md mx-2 my-4 md:mx-4 md:my-6" key={index}>
            <div class="bg-gray-200 rounded-lg p-6 md:p-8 text-center">
              <p class="font-bold uppercase">{val.buyerId.email}</p>
              <p class="text-xl font-light italic text-gray-700">{val.comments}</p>
              <div class="flex items-center justify-center space-x-2 mt-4">
                <StarRatings
                  disable
                  starRatedColor="#8B8000"
                  numberOfStars={5}
                  rating={val.rating}
                />
              </div>
              <span className='text-gray-600'> Date Posted:</span> <p>{val.createdAt.split('T')[0]}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
};

export default GigDetailsPage;
