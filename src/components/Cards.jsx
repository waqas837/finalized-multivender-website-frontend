import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../apiUrl";
import { Link, useNavigate } from "react-router-dom";
import StarRatings from 'react-star-ratings';

const Cards = () => {
  let arr = [0, 1, 2, 3, 4];
  const [allGigs, setallGigs] = useState([]);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getAllGigs();
  }, []);
  let userdata = localStorage.getItem("cUser");
  let userdataparsed = JSON.parse(userdata);
  let userid = userdataparsed?._id;

  const getAllGigs = async () => {
    try {
      setloading(true);

      // let userid = userdataparsed._id;
      let { data } = await axios.get(`${apiUrl}/user/getGigsRandom`);
      setallGigs(data.data || []);
      // dispatch(UserSignupDetails(data.data));
      // localStorage.setItem("userstatus", userType);
      // localStorage.setItem("cUser", JSON.stringify(data.data));
      console.log("let all gigs which are random", data);
      setloading(false);
    } catch (error) {
      console.log("Err in function getAllProductsData", error);
    }
  };

  const gotoSellerAccountByUserVisit = async (userid) => {
    try {
      navigate(`/seller/${userid}`, { state: { userVisit: true } });
      console.log("let logs the data", data);
    } catch (error) {
      console.log("Err in function getAllProductsData", error);
    }
  };
  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl mb-10 font-bold underline text-blue-600">
        All Best Sellers
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 place-items-center">
        {loading
          ? arr.map((val) => (
            <div
              role="status"
              className="max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
            >
              <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                <svg
                  className="w-10 h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                </svg>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="flex items-center mt-4">
                <svg
                  className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          ))
          : allGigs &&
          allGigs.map((val) => (
            <>
              {/* // if not loading but seller data */}
              {val &&
                val.userInfo &&
                val.userInfo.email &&
                val.userInfo._id !== userid ? (
                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                  <div className="flex justify-end px-4 pt-4">
                    <button
                      id="dropdownButton"
                      data-dropdown-toggle="dropdown"
                      className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                      type="button"
                    >
                      <span className="sr-only">Open dropdown</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 3"
                      >
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                      </svg>
                    </button>
                    <div
                      id="dropdown"
                      className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul className="py-2" aria-labelledby="dropdownButton">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Export Data
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col items-center pb-10">
                    <img
                      className="w-24 h-24 mb-3 rounded-full shadow-lg"
                      src={`${apiUrl}/images/${val.userInfo.profileImg}`}
                      alt="Seller image"
                    />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                      {val &&
                        val.userInfo &&
                        val.userInfo.email.split("@")[0]}
                    </h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {val.category}
                    </span>
                    <div className="flex mt-4 md:mt-6">
                      <button
                        onClick={() =>
                          gotoSellerAccountByUserVisit(val.userInfo._id)
                        }
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >

                        <span>Profile</span>
                      </button>
                      <Link
                        to={`/orderBook/${val.userInfo._id}/${val._id}`}
                        className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        <div className="flex justify-between w-[130px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 5.25a2.25 2.25 0 0 0-2.012-2.238A2.25 2.25 0 0 0 13.75 1h-1.5a2.25 2.25 0 0 0-2.238 2.012c-.875.092-1.6.686-1.884 1.488H11A2.5 2.5 0 0 1 13.5 7v7h2.25A2.25 2.25 0 0 0 18 11.75v-6.5ZM12.25 2.5a.75.75 0 0 0-.75.75v.25h3v-.25a.75.75 0 0 0-.75-.75h-1.5Z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Zm6.874 4.166a.75.75 0 1 0-1.248-.832l-2.493 3.739-.853-.853a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.154-.114l3-4.5Z"
                              clip-rule="evenodd"
                            />
                          </svg>

                          <span>Request order</span>
                        </div>
                      </Link>
                    </div>
                    <p className="mt-5 flex justify-between items-center space-x-2">
                      {val.commentsAndRating && val.commentsAndRating.map((ratingObj, index) => (
                        <StarRatings
                          key={index}
                          disable
                          starRatedColor="#8B8000"
                          numberOfStars={5}
                          rating={ratingObj.rating}
                        />
                      ))}
                      <p className="text-xl">({val.completedOrders})</p>
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default Cards;
