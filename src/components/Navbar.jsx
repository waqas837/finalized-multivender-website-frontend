import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiUrl } from "../apiUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SocketContext } from "./Socketio/SocketContext";
import ChatBot from 'react-simple-chatbot';


const Navbar = () => {
  const [showdropdown, setshowdropdown] = useState(false);
  const [dropdownvalue, setdropdownvalue] = useState("All Categories");
  const [searchInput, setsearchInput] = useState()
  const [showChat, setshowChat] = useState(false)
  const [categories, setCategories] = useState([]);
  const [activeLink, setActiveLink] = useState('/'); // State to track active link

  const navigate = useNavigate();
  const socket = useContext(SocketContext); // use the socket connection...
  useEffect(() => {
     let userdata = localStorage.getItem("cUser");
    let userdataparsed = JSON.parse(userdata);
    if (socket) {
      socket.emit("saveUserID", { userdata: userdataparsed });
    }
  }, [socket]);
  const location = useLocation();
  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);
  const handleClick = (link) => {
    setActiveLink(link); // Update state with clicked link
    navigate(link); // Assuming you have a 'navigate' function for routing
  };

  // getAllCategories
  const getAllCategories = async () => {
    try {
      let { data } = await axios.get(`${apiUrl}/user/getAllCategories`)
      if (data.success) {
        setCategories(data.categories)
       }
    } catch (error) {
      console.log("Error", error)
    }

  }
  const steps = [
    {
      id: '0',
      message: 'Welcome to react chatbot!',
      trigger: '1',
    },
    {
      id: '1',
      message: 'Bye!',
      end: true,
    },
  ];
  const handleDropDownClick = (value) => {
    setdropdownvalue(value);
    setshowdropdown(false);
  };
  let userDetails = localStorage.getItem("cUser");
  let userstatus = localStorage.getItem("userstatus");

  console.log("userDetails", JSON.parse(userDetails));
  // console.log("userstatus", JSON.parse(userstatus));

  const gotoSellerAccount = async () => {
    let userid = JSON.parse(userDetails)._id;
    try {
      let userType = "seller";
      localStorage.setItem("userstatus",userType)
      let { data } = await axios.post(
        `${apiUrl}/user/switchAccount/${userid}/${userType}`
      );
      // dispatch(UserSignupDetails(data.data));
      localStorage.setItem("userstatus", userType);
      localStorage.setItem("cUser", JSON.stringify(data.data));
      navigate(`/seller/${userid}`, { state: { userVisit: false } });
      console.log("let logs the data", data);
    } catch (error) {
      console.log("Err in function getAllProductsData", error);
    }
  };

  const gotoBuyerAccount = async () => {
    let userid = JSON.parse(userDetails)._id;
    try {
      let userType = "buyer";
      localStorage.setItem("userstatus",userType)
      let { data } = await axios.post(
        `${apiUrl}/user/switchAccount/${userid}/${userType}`
      );
      // dispatch(UserSignupDetails(data.data));
      localStorage.setItem("userstatus", userType);
      localStorage.setItem("cUser", JSON.stringify(data.data));
      navigate(`/buyer/${userid}`, { state: { userVisit: false } });
      console.log("let logs the data", data);
    } catch (error) {
      console.log("Err in function getAllProductsData", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("cUser");
    navigate("/login");
  };

  const searchForGig = async() =>{
    let searchParms = {searchText:searchInput.search, dropdownvalue};
    navigate(`/search-results`,{state:{searchParms}})
  }

   
  return (
    <>
      <div className="md:flex md:justify-around items-center py-14">
        <div className="items-center space-x-3 rtl:space-x-reverse">
          <img
            src="file.jpg"
            className="h-8 hidden md:inline-block"
            alt="Logo"
          />
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Ecomm
          </span> */}
          {/* small screen search engine*/}
          <div className="md:hidden">
            {/* search input */}
             
  <div className="flex">
    <label
      htmlFor="search-dropdown"
      className="mb-2 text-lg font-medium text-white sr-only dark:text-white"
    >
      Your Email
    </label>
    <button
      onClick={() => setshowdropdown(true)}
      id="dropdown-button"
      data-dropdown-toggle="dropdown"
      className="flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-lg font-medium text-center bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:text-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
      type="button"
    >
      {!dropdownvalue ? "All categories" : dropdownvalue}
      <svg
        className="w-2.5 h-2.5 ms-2.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>
    {/* small screen search box */}
    <div
      className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
    >
      <ul
        className={`py-2 ${
          showdropdown || (dropdownvalue && "hidden")
        } text-lg text-gray-700 dark:text-gray-200`}
        aria-labelledby="dropdown-button"
      >
        {categories && categories.map((val)=>(
          <li>
          <button
            onClick={() => handleDropDownClick(val.category)}
            className="block px-4 py-2 hover:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {val.category}
          </button>
        </li>
        ))}
      </ul>
    </div>
    <div className="relative w-full">
      <input
        type="search"
        id="search-dropdown"
        className="border-red-400 block p-4 w-full z-20 bg-gray-50 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-gray-700 dark:focus:border-blue-500 text-xl"
        placeholder="Search By Skills..."
        onChange={(e)=>setsearchInput({...searchInput,search:e.target.value})}
        required
      />
      <button
        onClick={searchForGig}
        className="absolute top-0 right-0 p-2.5 h-full text-lg font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Search
      </button>
    </div>
    
  </div>


            {/* dropdown */}
          </div>

          {/*  end small screen search enigne*/}
        </div>
        {/* search engine for the big devices */}
        <div className="hidden md:block w-[50%]">
         
            <div className="flex">
              <label
                for="search-dropdown"
                className="mb-2 text-lg font-medium text-white sr-only dark:text-white"
              >
                Your Email
              </label>
              <button
                onClick={() => setshowdropdown(true)}
                id="dropdown-button"
                data-dropdown-toggle="dropdown"
                className="flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-lg font-medium text-center  bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:text-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                type="button"
              >
                {!dropdownvalue ? "All categories" : dropdownvalue}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdown"
                className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul
                  className={`py-2 ${
                    showdropdown || (dropdownvalue && "hidden")
                  }  text-lg text-gray-700 dark:text-gray-200`}
                  aria-labelledby="dropdown-button"
                >
                {categories && categories.map((val) => (
                  <li>
                    <button
                      onClick={() => handleDropDownClick(val.category)}
                      className="block px-4 py-2 hover:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {val.category}
                    </button>
                  </li>
                ))}

                </ul>
              </div>
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="border-red-400 block p-4 w-full z-20 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-gray-700 dark:focus:border-blue-500 text-xl"
                  placeholder="Search By Skills..."
                  onChange={(e)=>setsearchInput({...searchInput,search:e.target.value})}
                  required
                />
                <button
                  onClick={searchForGig}
                  className="absolute top-0 end-0 p-2.5 h-full text-lg font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </div>
          
        </div>
        {/* will be hidden for mobile devices */}
        <div className="flex justify-between items-center ml-3 mt-5 md:flex md:justify-between w-[70px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-blue-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <div>
          {!JSON.parse(userDetails) && <Link to="/login">Login</Link>}
          </div>
          {/* {JSON.parse(userDetails) && <>{JSON.parse(userDetails).email}</>} */}
          {JSON.parse(userDetails) && (
            <div className="py-8 px-8 mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
              <div className="text-center space-y-2 sm:text-left">
                <button
                  onClick={gotoSellerAccount}
                  className="text-slate-500 font-medium text-xs underline text-center py-2 cursor-pointer"
                >
                  Goto seller account 
                </button>
                <button
                  onClick={gotoBuyerAccount}
                  className="text-slate-500 font-medium text-xs underline text-center py-2 cursor-pointer"
                >
                   Buyer Dashboard 
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* second nav */}
      <nav className="px-10 bg-blue-700 dark:bg-gray-900 w-full z-20 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
          {/* replace something else here */}
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link
              to="/login"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get started
            </Link>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-lg text-gray-500 rounded-lg md:hidden hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
          <button
            onClick={() => handleClick('/')}
            style={{ borderRadius: 0 }}
            className={`block py-2 px-3 text-white rounded ${
              activeLink === '/' ? 'border-b-2' : ''
            } md:bg-transparent md:p-0`}
            aria-current={activeLink === '/' ? 'page' : null}
          >
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => handleClick('/About')}
            style={{ borderRadius: 0 }}
            className={`block py-2 px-3 text-white rounded ${
              activeLink === '/About' ? 'border-b-2' : ''
            } md:bg-transparent md:p-0`}
            aria-current={activeLink === '/About' ? 'page' : null}
          >
            About
          </button>
        </li>
        <li>
          <button
            onClick={() => handleClick('/Services')}
            style={{ borderRadius: 0 }}
            className={`block py-2 px-3 text-white rounded ${
              activeLink === '/Services' ? 'border-b-2' : ''
            } md:bg-transparent md:p-0`}
            aria-current={activeLink === '/Services' ? 'page' : null}
          >
            Services
          </button>
        </li>
        <li>
          <button
            onClick={() => handleClick('/contact')}
            style={{ borderRadius: 0 }}
            className={`block py-2 px-3 text-white rounded ${
              activeLink === '/contact' ? 'border-b-2' : ''
            } md:bg-transparent md:p-0`}
            aria-current={activeLink === '/contact' ? 'page' : null}
          >
            Contact
          </button>
        </li>
            </ul>
          </div>
        </div>
      </nav>
      <div
        x-data="{ isVisible: false }"
        // x-init="window.addEventListener('scroll', () => { isVisible = window.scrollY > 100; })"
        className="fixed bottom-6 right-6 z-50"
        x-show="isVisible"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform translate-y-2"
        x-transition:enter-end="opacity-100 transform translate-y-0"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 transform translate-y-0"
        x-transition:leave-end="opacity-0 transform translate-y-2"
      >
        <button
          title="Scroll to top"
          aria-label="Scroll to top"
          className="rounded-lg shadow-sm"
          onClick={()=>setshowChat(!showChat)}
        >
          {showChat? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
:<span>Need any help? </span>}
          
          {!showChat&&<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-20 h-20 text-blue-500"
          >
            <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
            <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
          </svg>}
        </button>
        {showChat && <ChatBot steps={steps} />}
        
      </div>
    </>
  );
};

export default Navbar;
