import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../apiUrl";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { UserSignupDetails } from "../Redux/actions";
import PendingApproval from ".././PendingApproval";
import { SocketContext } from "../Socketio/SocketContext";

const SellerProfile = () => {
  const location = useLocation();
  let { userid } = useParams();
  const [allProducts, setallProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [rerender, setrerender] = useState(null);
  const [HideAddBtn, setHideAddBtn] = useState(true);
  const [filePreview, setfilePreview] = useState(null);
  const [userdata, setuserdata] = useState(null);
  const [categories, setCategories] = useState([]);
  const gotUserData = useSelector((state) => state.userReducer.userdata);
  const navigate = useNavigate();
  let userdatal = localStorage.getItem("cUser");
  let userdataparsed = JSON.parse(userdatal);
  let buyerId = userdataparsed?._id;
  const socket = useContext(SocketContext); // use the socket connection...
  useEffect(() => {
    getAllCategories();
  }, []);
  // getAllCategories
  const getAllCategories = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/user/getAllCategories`);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  // These ids for the chat, but i will need other userid for to do the message to him.
  let alsoLoggedInUserId = userdataparsed?._id;
  let otherUserID = userid;
  console.log("redux data::", gotUserData);
  let dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
    productImg: "",
  });

  let userstatus = localStorage.getItem("userstatus");
  useEffect(() => {
    let userdata = localStorage.getItem("cUser");
    let userdataparsed = JSON.parse(userdata);
    if (socket) {
      socket.emit("saveUserID", { userdata: userdataparsed });
    }
  }, [socket]);

  useEffect(() => {
    getAllUserData();
    getAllProductsData();
  }, [rerender]);

  const switchToBuyer = async () => {
    try {
      let userType = "buyer";
      let { data } = await axios.post(
        `${apiUrl}/user/switchAccount/${userid}/${userType}`
      );
      dispatch(UserSignupDetails(data.data));
      localStorage.setItem("userstatus", userType);
      localStorage.setItem("cUser", JSON.stringify(data.data));
      navigate(`/buyer/${userid}`, { state: { userVisit: false } });
      console.log("let logs the data", data);
    } catch (error) {
      console.log("Err in function getAllProductsData", error);
    }
  };

  const getAllProductsData = async () => {
    try {
      let userdata = localStorage.getItem("cUser");
      let userdataparsed = JSON.parse(userdata);
      let userId = userdataparsed._id;
      if (location.state.userVisit) {
        let { data } = await axios.get(
          `${apiUrl}/user/getAllProducts/${userid}`
        );
        setallProducts(data.data.products);
        console.log("Products must be ", data);
      } else {
        let { data } = await axios.get(
          `${apiUrl}/user/getAllProducts/${userId}`
        );
        setallProducts(data.data.products);
        console.log("let logs the data", data);
      }
    } catch (error) {
      console.log("Err in function getAllProductsData", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("cUser");
    navigate("/login");
  };

  const getAllUserData = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/user/getUserData/${userid}`);
      console.log("let logs the user data", data);
      setuserdata(data.data);
      // localStorage.setItem("cUser", JSON.stringify(data.data));
      // dispatch(UserSignupDetails(data.data));
    } catch (error) {
      console.log("Err in function getAllUserData", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a new FormData object
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("category", inputs.category);
    formData.append("file", file); // here also name should be the same
    formData.append("price", inputs.price); // here also name should be the same
    // let userdata = localStorage.getItem("cUser");
    // let userdataparsed = JSON.parse(userdata);
    // let userid = userdataparsed._id;
    await axios.post(`${apiUrl}/user/createProduct/${userid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setrerender(!rerender);
    toast.success("New Gig added below.");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setfilePreview(selectedFile.name);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const onprofileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile2(selectedFile);
  };
  const emailPrefix = userdata && userdata.email.split("@")[0];
  // user profile update
  const userProfileUpdateSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(); // Create FormData object to send file
      formData.append("file", file2);
      setFile2(false);
      let userdata = localStorage.getItem("cUser");
      let userdataparsed = JSON.parse(userdata);
      let userid = userdataparsed._id;
      let { data } = await axios.patch(
        `${apiUrl}/user/userProfileImage/${userid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setrerender(!rerender);
    } catch (error) {
      console.log("error in userProfileUpdate", error);
    }
  };

  const addParticipant = async (alsoLoggedInUserId, otherUserID) => {
    try {
      if (!alsoLoggedInUserId) {
        toast.error("Please Login to perform this action!");
        return;
      }
      if (!otherUserID) {
        toast.error("Please Login to perform this action!");
        return;
      }

      let { data } = await axios.patch(
        `${apiUrl}/user/addParticipant/${alsoLoggedInUserId}/${otherUserID}`
      );
      if (data.success) {
        navigate(`/buyer/inbox/${alsoLoggedInUserId}`, {
          state: { otherUserID: otherUserID },
        });
      }
    } catch (error) {
      console.log("error in userProfileUpdate", error);
    }
  };
  return (
    <>
      {userdata && userdata.approved === false ? (
        <PendingApproval />
      ) : (
        <div>
          <Toaster />
          <div className="flex justify-around items-center">
            <Link className="text-sm text-blue-500" to={"/"}>
              &larr; Home
            </Link>
            <h1 className="py-5 text-3xl font-bold text-center text-gray-500 underline">
              {location.state.userVisit
                ? `${emailPrefix}'s Profile`
                : "Seller Dashboard"}
            </h1>

            {!location.state.userVisit && (
              <Link
                to={`/sellerOrders/${userid}`}
                type="button"
                class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                All Sales
              </Link>
            )}

            {!location.state.userVisit && (
              <>
                <button
                  onClick={() =>
                    navigate(`/seller/inbox/${userid}`, {
                      state: { sellerid: buyerId },
                    })
                  }
                  type="button"
                  class="relative inline-flex items-center p-3 text-sm font-medium text-center text-white   rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border"
                >
                  <svg
                    class="w-5 h-5 text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                  <span class="sr-only">Notifications</span>
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-purple-600 font-semibold rounded-md border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-2 place-items-center">
            <div className="w-[70%] mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <div className="border-b px-4 pb-6">
                <div className="text-center my-4">
                  <label
                    for="userprofile"
                    className="inline-flex items-center justify-center w-32 h-32 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full cursor-pointer my-6"
                  >
                    {userdata && (
                      <img
                        className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                        src={`${apiUrl}/images/${userdata.profileImg}`}
                        alt=""
                      />
                    )}
                  </label>
                  <form onSubmit={userProfileUpdateSubmit}>
                    <input
                      disabled={location.state.userVisit}
                      onChange={onprofileChange}
                      type="file"
                      name="file"
                      id="userprofile"
                      className="sr-only"
                      required
                    />

                    {/* User image */}
                    {file2 && (
                      <button
                        type="submit"
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                      >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          Upload image!
                        </span>
                      </button>
                    )}
                  </form>
                  <div className="py-2">
                    {!location.state.userVisit && (
                      <>
                        <h1 className="text-2xl">
                          {userstatus === "buyer"
                            ? "Current account is buyer..."
                            : "Seller Account"}
                        </h1>
                      </>
                    )}
                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                      {emailPrefix}
                    </h3>
                    <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                      <svg
                        className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          className=""
                          d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                        />
                      </svg>
                      New York, NY
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 px-2">
                  {!location.state.userVisit && (
                    <button
                      onClick={switchToBuyer}
                      className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
                    >
                      Switch To Buyer
                    </button>
                  )}
                  <button
                    onClick={() =>
                      addParticipant(alsoLoggedInUserId, otherUserID)
                    }
                    className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
                  >
                    Message
                  </button>
                </div>
              </div>
              <div className="px-4 py-4">
                <div className="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">
                  <h1 className="text-xl font-bold">Graphic Designer</h1>
                </div>
                <div className="flex">
                  <div className="flex justify-end mr-2">
                    <span className="flex">
                      <svg
                        className="h-6 w-6 text-gray-600 dark:text-gray-400"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                          />
                        </svg>
                      </svg>
                      <strong className="text-black dark:text-white">
                        &nbsp;24/7&nbsp;
                      </strong>
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {HideAddBtn && (
                <>
                  {alsoLoggedInUserId && (
                    <>
                      <h2 className="text-2xl text-gray-400 my-10">
                        Add a New Product.
                      </h2>
                      <button
                        className=""
                        onClick={() => setHideAddBtn(false)}
                        disabled={location.state.userVisit}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-20 h-20 text-gray-600"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              )}
              {!HideAddBtn && (
                <>
                  <div className="flex items-center justify-center w-full">
                    <div className="mx-auto w-full max-w-[550px] bg-white">
                      <form className="py-4 px-9" onSubmit={handleSubmit}>
                        <div className="mb-5">
                          <label
                            for="email"
                            className="mb-3 block text-base font-medium text-[#07074D]"
                          >
                            Attractive Title:
                          </label>
                          <input
                            onChange={handleInputChange}
                            name="title"
                            placeholder=""
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            required
                          />
                        </div>

                        <div className="mb-5">
                          <label
                            for="email"
                            className="mb-3 block text-base font-medium text-[#07074D]"
                          >
                            Description
                          </label>
                          <textarea
                            required
                            onChange={handleInputChange}
                            name="description"
                            placeholder="Best description"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                          />
                        </div>

                        <div className="mb-6 pt-4">
                          <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                            Product image
                          </label>

                          <div className="mb-8">
                            <input
                              onChange={handleFileChange}
                              type="file"
                              name="file"
                              id="file"
                              className="sr-only"
                              required
                            />
                            <label
                              for="file"
                              className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                            >
                              <div>
                                {filePreview ? (
                                  filePreview
                                ) : (
                                  <>
                                    <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                      Drop files here
                                    </span>
                                    <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                      Or
                                    </span>
                                    <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                      Browse
                                    </span>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="my-8">
                          <h1 className="my-3">Select a category</h1>
                          <select
                            name="category"
                            value={inputs.dropdownValue}
                            onChange={handleInputChange}
                            className="block w-full text-sm font-medium transition duration-75 border border-gray-800 rounded-lg shadow-sm h-9 focus:border-blue-600 focus:ring-1 focus:ring-inset focus:ring-blue-600 bg-none"
                          >
                            <option value="-Select">--Select</option>
                            {categories &&
                              categories.map((val) => (
                                <option value={val.category}>
                                  {val.category}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <h1 className="my-2">Price In Dollars</h1>
                          <input
                            onChange={handleInputChange}
                            type="number"
                            name="price"
                            id="price"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md mb-5"
                            required
                          />
                        </div>
                        <div>
                          <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                            Publish
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Show gigs */}
          <div>
            <h1 className="underline text-2xl font-bold text-gray-500 my-20 text-center">
              {location.state.userVisit ? "Seller Products" : "Your Products"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 place-content-center px-20">
              {/* gigs cards*/}
              {allProducts &&
                allProducts.map((val) => (
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg ring-opacity-40 max-w-sm">
                    <div
                      className="relative cursor-pointer"
                      onClick={() => navigate(`/details/${val._id}`)}
                    >
                      <img
                        width={500}
                        height={500}
                        src={`${apiUrl}/images/${val.productimg}`}
                        alt="Product Image"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">{val.title}</h3>
                      <h3 className="text-lg font-medium mb-2">
                        {val.category}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {val.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          Price ${val.price}
                        </span>
                        {!location.state.userVisit ? (
                          <button
                            onClick={() => navigate(`/editgig/${val._id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:ring"
                          >
                            Edit
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                      Order completed ({val.completedOrders})
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerProfile;
