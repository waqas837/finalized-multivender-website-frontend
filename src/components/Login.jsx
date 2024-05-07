import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../apiUrl";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { SocketContext } from "./Socketio/SocketContext";

const Login = () => {
  const [sData, setsData] = useState(null);
  const socket = useContext(SocketContext); // use the socket connection...

  const navigate = useNavigate();
  const loginIntoAccount = async (e) => {
    try {
      e.preventDefault();
      if (sData) {
        let { data } = await axios.post(`${apiUrl}/user/login`, {
          sData,
        });
        if (data.success) {
          localStorage.setItem("cUser", JSON.stringify(data.data));
          // dispatch(UserSignupDetails(data.data));

          setTimeout(() => {
            // toast("Redirecting to your profile...");
            if (data.data.userType === "buyer") {
              navigate(`/buyer/${data.data._id}`, {
                state: { userVisit: false },
              });
              toast.success("LoggedIn successfully.");
            }

            if (data.data.userType === "seller") {
              navigate(`/seller/${data.data._id}`, {
                state: { userVisit: false },
              });
              toast.success("LoggedIn successfully.");
            }

            if (data.data.userType === "admin")
              toast.error("Invalid credentials");
            return;
          }, 1000);
          return;
        }
        if (data.success === false) {
          toast.error("Invalid credentials.");
          return;
        }
      }
    } catch (error) {
      toast.error("Internal server error");
      console.log("error in signup", error);
    }
  };

  return (
    <div>
      <Toaster />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="w-8 h-8 mr-2" src="file.jpg" alt="logo" />
            Ecomm
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={loginIntoAccount}
              >
                <div>
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    onChange={(e) =>
                      setsData({ ...sData, email: e.target.value })
                    }
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) =>
                      setsData({ ...sData, password: e.target.value })
                    }
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        for="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
