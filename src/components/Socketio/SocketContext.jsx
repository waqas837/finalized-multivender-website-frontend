// SocketContext.js
import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { apiUrl } from "../../apiUrl";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  let userdata = localStorage.getItem("cUser");
  let userdataparsed = JSON.parse(userdata);

  const newSocket = io(`${apiUrl}`);
  useEffect(() => {
    if (userdataparsed) {
      // we should save socket id at navbar or app loaded again and 
      // newSocket.emit("saveUserID", { userdata: userdataparsed });
    }
    setSocket(newSocket);
    // return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
