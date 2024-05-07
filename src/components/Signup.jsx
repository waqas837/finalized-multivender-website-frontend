import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../apiUrl";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { UserSignupDetails } from "./Redux/actions";

const Signup = () => {
  const [sData, setsData] = useState(null);
  const [sRad, setsRad] = useState("seller");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signup = async (e) => {
    try {
      e.preventDefault();
      if (sData.password !== sData.cpassword) {
        toast.error("Passwords must be same");
        return;
      }
      if (sData) {
        let { data } = await axios.post(`${apiUrl}/user/signup/${sRad}`, {
          sData,
        });
        if (data.success) {
          localStorage.setItem("cUser", JSON.stringify(data.data));
          dispatch(UserSignupDetails(data.data));
          toast.success("Account created successfully.");
          setTimeout(() => {
            toast("Redirecting to your profile...");
            if (sRad === "buyer")
              navigate(`/buyer/${data.data._id}`, {
                state: { userVisit: false },
              });
            if (sRad === "seller")
              navigate(`/seller/${data.data._id}`, {
                state: { userVisit: false },
              });
          }, 1000);

          return;
        }
        if (data.message === "Duplicate email") {
          toast.error("Email is already in use.");
          return;
        }
      } else {
        toast.error("Please fill all fields");
        return;
      }
    } catch (error) {
      toast.error("Internal server error");
      console.log("error in signup", error);
    }
  };
  return (
    <>
      <Toaster />
      <div>
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
                  Create and account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={signup}>
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
                  <div>
                    <label
                      for="confirm-password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm password
                    </label>
                    <input
                      onChange={(e) =>
                        setsData({ ...sData, cpassword: e.target.value })
                      }
                      type="confirm-password"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <h1>Create account as:</h1>
                  <div className="flex items-center mb-4">
                    <input
                      defaultChecked
                      onChange={(e) => setsRad(e.target.value)}
                      id="default-radio-1"
                      type="radio"
                      value="seller"
                      name="default-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="default-radio-1"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Seller
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      onChange={(e) => setsRad(e.target.value)}
                      id="default-radio-2"
                      type="radio"
                      value="buyer"
                      name="default-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="default-radio-2"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Buyer
                    </label>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        for="terms"
                        className="font-light text-gray-500 dark:text-gray-300"
                      >
                        I accept the{" "}
                        <a
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                          href="#"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Create an account
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Signup;
