import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../apiUrl";
import axios from "axios";
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [userdata, setuserdata] = useState([]);
  const [rerender, setrerender] = useState(false);
  const [renderCat, setrenderCat] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentItem, setcurrentItem] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllUserData();
  }, [rerender]);

  useEffect(() => {
    getAllCategories();
  }, [renderCat]);

  // getAllCategories
  const getAllCategories = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/user/getAllCategories`)
      if (data.success) {
        setCategories(data.categories)
        setrenderCat(!renderCat)
      }
    } catch (error) {
      console.log("Error", error)
    }

  }
  // input change for category
  const handleInputChange = async (e) => {
    setCategoryInput(e.target.value);
  };

  // add a new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoryInput.trim() !== '') {
      setCategories([...categories, categoryInput.trim()]);
      let category = categoryInput.trim()
      await axios.post(`${apiUrl}/user/addCategory/${category}`)
      setCategoryInput('');
    }
  };
  // remove a category
  const handleRemoveCategory = async (id) => {
    await axios.delete(`${apiUrl}/user/removeCategory/${id}`)
  };

  const changeUserApproval = async (status, userid) => {
    try {
      setloading(true);
      setcurrentItem(userid);
      let { data } = await axios.post(
        `${apiUrl}/admin/ChangeUserApproval/${userid}/${status}`
      );
      console.log("let logs the user data", data);
      if (data.success) {
        setloading(false);
        setrerender(!rerender);
      }
    } catch (error) {
      setloading(false);
      console.log("Err in function changeUserApproval", error);
    }
  };

  const getAllUserData = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/admin/getUserData`);
      console.log("let logs the user data", data);
      setuserdata(data.data);
    } catch (error) {
      console.log("Err in function getAllUserData", error);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setIsNavbarOpen(false);
  };
  const logout = () => {
    localStorage.removeItem("cAdmin");
    window.location.reload();
  };
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="bg-white w-64 flex-shrink-0 md:flex md:flex-col shadow-xl h-[200vh] rounded-xl px-4 border-r-2">
          <div className="p-4 text-2xl font-bold text-blue-500">
            Admin Panel
          </div>
          <div className="md:hidden p-4 flex justify-between items-center h-full">
            <div>Menu</div>
            <button onClick={toggleNavbar}>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"
                />
              </svg>
            </button>
          </div>
          <ul
            className={`p-2 md:p-0 ${isNavbarOpen ? "block" : "hidden"
              } md:block`}
          >
            <li
              className={`py-2 my-2 px-4 cursor-pointer hover:bg-blue-600 hover:rounded-lg hover:text-white ${activeTab === "inbox"
                ? "bg-blue-600 text-white rounded-md shadow-lg"
                : ""
                }`}
              onClick={() => handleTabClick("inbox")}
            >
              Inbox
            </li>
            <li
              className={`py-2 my-2 px-4 cursor-pointer hover:bg-blue-600 hover:text-white hover:rounded-md  ${activeTab === "profiles"
                ? "bg-blue-600 text-white rounded-md shadow-lg"
                : ""
                }`}
              onClick={() => handleTabClick("profiles")}
            >
              Profiles for Approvals
            </li>
            <li
              className={`py-2 px-4 cursor-pointer hover:bg-blue-600 hover:text-white hover:rounded-md ${activeTab === "cards"
                ? "bg-blue-600 text-white rounded-md shadow-lg"
                : ""
                }`}
              onClick={() => handleTabClick("cards")}
            >
              Categories List
            </li>
            {/* Add more dummy options */}
            {/* <li className="py-2 px-4 hover:bg-blue-600">Option 1</li>
            <li className="py-2 px-4 hover:bg-blue-600">Option 2</li>
            <li className="py-2 px-4 hover:bg-blue-600">Option 3</li> */}
            <button
              onClick={logout}
              type="button"
              className="text-white mt-10 bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-bluebg-blue-600/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-bluebg-blue-600/55 me-2 mb-2"
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
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>{" "}
              &nbsp; Logout
            </button>
          </ul>
        </div>
        {/* Content */}
        <div className="flex-grow p-8">
          {/* Content based on active tab */}
          {activeTab === "inbox" && (
            <>
              <h1 className="text-3xl font-bold text-blue-500">Inbox</h1>
              <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
                <div className="flex items-center justify-between pb-6">
                  <div>
                    <h2 className="font-semibold text-gray-700">Users</h2>
                    <span className="text-xs text-gray-500">
                      These users asks help from you!
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="ml-10 space-x-8 lg:ml-40">
                      <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring hover:bg-blue-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                          />
                        </svg>
                        Help People
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-hidden rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                          <th className="px-5 py-3">ID</th>
                          <th className="px-5 py-3">Full Name</th>
                          <th className="px-5 py-3">User Role</th>
                          {/* <th className="px-5 py-3">Created at</th> */}
                          <th className="px-5 py-3">Messages</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-500">
                        <tr>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">3</p>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-full w-full rounded-full"
                                  src="/images/-ytzjgg6lxK1ICPcNfXho.png"
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <p className="whitespace-no-wrap">Besique Monroe</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">Administrator</p>
                          </td>
                          {/* <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap">Sep 28, 2022</p>
                        </td> */}

                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900">
                              Show Message
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">7</p>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-full w-full rounded-full"
                                  src="/images/ddHJYlQqOzyOKm4CSCY8o.png"
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <p className="whitespace-no-wrap">James Cavier</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">Author</p>
                          </td>
                          {/* <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap">Sep 28, 2022</p>
                        </td> */}

                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900">
                              Show Message
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">12</p>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-full w-full rounded-full"
                                  src="/images/oPf2b7fqx5xa3mo68dYHo.png"
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <p className="whitespace-no-wrap">Elvis Son</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">Editor</p>
                          </td>
                          {/* <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap">Sep 28, 2022</p>
                        </td> */}

                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-900">
                              Show Message
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">66</p>
                          </td>
                          <td className="bg-white px-5 py-5 text-sm">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-full w-full rounded-full"
                                  src="/images/fR71TFZIDTv2jhvKsOMhC.png"
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <p className="whitespace-no-wrap">Dana White</p>
                              </div>
                            </div>
                          </td>
                          <td className="bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">Administrator</p>
                          </td>
                          {/* <td className="bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap">Sep 28, 2022</p>
                        </td> */}

                          <td className="bg-white px-5 py-5 text-sm">
                            <span className="rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-900">
                              Show Message
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">12</p>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-full w-full rounded-full"
                                  src="/images/oPf2b7fqx5xa3mo68dYHo.png"
                                  alt=""
                                />
                              </div>
                              <div className="ml-3">
                                <p className="whitespace-no-wrap">Elvis Son</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">Editor</p>
                          </td>
                          {/* <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap">Sep 28, 2022</p>
                        </td> */}

                          <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-900">
                              Show Message
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col items-center border-t bg-white px-5 py-5 sm:flex-row sm:justify-between">
                    <span className="text-xs text-gray-600 sm:text-sm">
                      {" "}
                      Showing 1 to 5 of 12 Entries{" "}
                    </span>
                    <div className="mt-2 inline-flex sm:mt-0">
                      <button className="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">
                        Prev
                      </button>
                      <button className="h-12 w-12 rounded-full border text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-100">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === "cards" && (
            <>
              <h1 className="text-3xl font-bold text-blue-500">Categories List</h1>
              <div className="mt-4">
                <div className="container mx-auto">
                  <h1 className="text-2xl font-bold mb-4">Categories</h1>
                  <form onSubmit={handleSubmit} className="mb-4">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={handleInputChange}
                      placeholder="Enter new category"
                      className="border border-gray-300 px-4 py-2 rounded-md mr-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      Add Category
                    </button>
                  </form>
                  <ul className="flex flex-wrap space-x-5">
                    {categories && categories.map((val, index) => (
                      <div key={index} className="bg-gray-200 rounded-md inline-flex items-center mr-2 mb-2 shadow-xl">
                        <span className="px-4 py-2">{val.category}</span>
                        <button
                          onClick={() => handleRemoveCategory(val._id)}
                          className="flex items-center justify-center text-gray-700 hover:text-gray-900 focus:outline-none pr-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>

                        </button>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {activeTab === "profiles" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                  <h1 className="text-3xl font-bold text-blue-500">
                    Seller Pending Approvals
                  </h1>
                  {userdata &&
                    userdata.map((val, index) => (
                      <div className="max-w-lg my-5">
                        <div className="p-3 flex items-center justify-between border-t cursor-pointer">
                          <div className="flex items-center">
                            <img
                              className="rounded-full h-10 w-10"
                              src={`${apiUrl}/images/${val.profileImg}`}
                            />
                            <div className="ml-2 flex flex-col">
                              <div className="leading-snug text-sm text-gray-900 font-bold">
                                {val.email}
                              </div>
                              <div className="leading-snug text-xs text-gray-600">
                                {val.userType}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              changeUserApproval(
                                val.approved ? false : true,
                                val._id
                              )
                            }
                            className="h-8 px-3 text-md font-bold text-blue-400 border border-blue-400 rounded-full hover:bg-blue-100"
                          >
                            {loading && currentItem === val._id ? (
                              <span className="text-center mx-6">...</span>
                            ) : val.approved ? (
                              "Deactive"
                            ) : (
                              "Approve"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
