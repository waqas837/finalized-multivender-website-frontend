import React, { useState, useEffect } from 'react';

const RemainingTime = ({ remainTime }) => {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(remainTime));

  useEffect(() => {
    const timerId = setInterval(() => {
      const updatedRemainingTime = calculateRemainingTime(remainTime);
      setRemainingTime(updatedRemainingTime);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainTime]);

  function calculateRemainingTime(bookedDateTime) {
    const bookingDateTime = new Date(bookedDateTime);
    const currentTime = new Date();
    let remainingTime = bookingDateTime - currentTime;

    if (remainingTime < 0) return 'Booking has expired';

    const seconds = Math.floor(remainingTime / 1000);
    remainingTime -= seconds * 1000;
    const minutes = Math.floor(seconds / 60);
    remainingTime -= minutes * 60 * 1000;
    const hours = Math.floor(minutes / 60);
    remainingTime -= hours * 60 * 60 * 1000;
    const days = Math.floor(hours / 24);

    let remainingTimeString = '';
    if (days > 0) remainingTimeString += `${days} days, `;
    if (hours > 0) remainingTimeString += `${hours % 24} hours, `;
    if (minutes > 0) remainingTimeString += `${minutes % 60} minutes, `;
    if (seconds > 0) remainingTimeString += `${seconds % 60} seconds`;
    if (remainingTime < 0) {
      // Send notification if delivery time is expired
      // sendNotificationToUser();
    }
    if (days === 0 && hours === 1) {
      // Send notification if last hour remaining
      // sendNotificationToUser();
    }
    return remainingTimeString;
  }

  return (
    <div className='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400'>{remainingTime}</div>
  );
};

export default RemainingTime;
