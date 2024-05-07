import React from "react";
import { Link } from "react-router-dom";

const PendingApproval = () => {
  return (
    <div className="mt-5">
      <div
        id="alert-additional-content-4"
        className="h-[50vh] p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            Your account is under approval by admin !
          </h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          Your account is under approval by admin. Whie your account is not
          approved you can not create your products and gigs. Please wait while
          your account is approved by admin. While your account is pending
          approval, you may not be able to create new products or gigs until an
          administrator reviews and approves your account. This waiting period
          can vary depending on the platform's policies and the workload of the
          administrators. During this time, it's a good idea to review the
          platform's terms of service and guidelines to ensure your offerings
          comply with their rules. Additionally, you might consider reaching out
          to the platform's support team if you have any questions or concerns
          about the approval process or the status of your account. Once your
          account is approved, you should be able to proceed with creating
          products or gigs and engaging with the platform's community.
        </div>
        <div className="flex">
          <Link
            to="/"
            type="button"
            className="text-yellow-800 bg-transparent border border-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-gray-800 dark:focus:ring-yellow-800"
            data-dismiss-target="#alert-additional-content-4"
            aria-label="Close"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
