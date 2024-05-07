import React from "react";

const Services = () => {
  let oneclickIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-10 h-10 text-blue-600"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
      />
    </svg>
  );

  let commIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-10 h-10 text-blue-500"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );

  return (
    <div className="p-10 m-auto grid grid-cols-2 md:grid-cols-4 place-items-center gap-10">
      <div className="flex space-x-2">
  {oneclickIcon}
  <div>
    <h1 className="text-lg font-bold">Book Instant Service</h1>
    <p>Providers at glance rate</p>
  </div>
</div>

<div className="flex space-x-2">
  {commIcon}
  <div>
    <h1 className="text-lg font-bold">Book Communication Service</h1>
    <p>Providers at glance rate</p>
  </div>
</div>

<div className="flex space-x-2">
  {commIcon}
  <div>
    <h1 className="text-lg font-bold">Book Design Service</h1>
    <p>Providers at glance rate</p>
  </div>
</div>

<div className="flex space-x-2">
  {commIcon}
  <div>
    <h1 className="text-lg font-bold">Book Development Service</h1>
    <p>Providers at glance rate</p>
  </div>
</div>

    </div>
  );
};

export default Services;
