import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { SocketContext } from "../Socketio/SocketContext";
import { apiUrl } from "../../apiUrl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const SellerInbox = () => {
  const [messageText, setmessageText] = useState(null);
  const [Room, setRoom] = useState(null);
  const [Email, setEmail] = useState(null);
  const [rerender, setrerender] = useState(false);
  const ScrollMe = useRef();
  const [Participants, setParticipants] = useState([]);
  const [selectedChatList, setselectedChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(false);
  const { userid: buyerid } = useParams(); // me as buyer id
  let location = useLocation();
  let sellerid = location.state.sellerid;
  const socket = useContext(SocketContext); // use the socket connection...
  let alsoLoggedInUserId = buyerid;
  let userdata = localStorage.getItem("cUser");
  let userdataparsed = JSON.parse(userdata)
  useEffect(() => {
    let userdata = localStorage.getItem("cUser");
    let userdataparsed = JSON.parse(userdata);
    if (socket) {
      socket.emit("saveUserID", { userdata: userdataparsed });
    }
  }, [socket]);

  useEffect(() => {
    loadParticipantForLoggedInUser(alsoLoggedInUserId);
  }, [rerender]);

  useEffect(() => {
    if (socket) {
      socket.on("recieveMessage", (data) => {
        console.log("recieveMessage", data)
        setActiveChatId(data.senderid);
        selectChat(data.senderid);
        setselectedChatList((prevList) => [...prevList, data]);
        window.scrollTo(0, document.body.scrollHeight);
      });
      if (ScrollMe.current) {
        ScrollMe.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [socket, selectedChatList]);

  const loadParticipantForLoggedInUser = async (alsoLoggedInUserId) => {
    try {
      let { data } = await axios.get(
        `${apiUrl}/user/loadParticipants/${alsoLoggedInUserId}`
      );
      if (data.success) {
        setParticipants(data.data[0].messagers);
        setActiveChatId(data.data[0].messagers[0]._id);
        selectChat(
          data.data[0].messagers[0]._id,
          data.data[0].messagers[0].email
        );
      }
    } catch (error) {
      console.log("error in loadParticipantForLoggedInUser", error);
    }
  };
  // with current other user (get this user and append at the top arr)
  // we have to get the data from database while page re-loading
  const sendMessage = () => {
    if (messageText) {
      socket.emit("messageSent", {
        senderid: buyerid, // these are actually opposite
        recieverId: activeChatId ? activeChatId : sellerid,
        messageText,
        Room: Room ? Room : "",
      });

      let foramat = {
        _id: null,
        unread: true,
        messagesItself: {
          messagesItself: { [alsoLoggedInUserId]: messageText },
        },
        createdAt: null,
        updatedAt: null,
        __v: 0,
      };

      toast("Message Sent");
      setselectedChatList((prevList) => [...prevList, foramat]);
      setActiveChatId(activeChatId);
      selectChat(activeChatId, userdataparsed.email);
      window.scrollTo(0, document.body.scrollHeight);
      setmessageText("");
      setrerender(!rerender);
    } else {
      setmessageText("");
      toast.error("Please write something");
    }
  };

  const loadParticipantchatForSelectedUser = async (
    otherUserID,
    alsoLoggedInUserId
  ) => {
    try {
      let { data } = await axios.get(
        `${apiUrl}/user/loadParticipantsChat/${alsoLoggedInUserId}/${otherUserID}`
      );
      console.log("selectedChatList", data.messages);
      setselectedChatList(data.messages);
      if (data.success) {
      }
    } catch (error) {
      console.log("error in loadParticipantForLoggedInUser", error);
    }
  };

  const selectChat = async (userid, email) => {
    setActiveChatId(userid);
    setEmail(email?.split("@")[0]);
    // also get the messages data
    // we have 2 things select userid and loggedin user and then we load their chats.
    let otherUserID = userid;
    await loadParticipantchatForSelectedUser(otherUserID, alsoLoggedInUserId);
  };
  return (
    <div>
      <Toaster />
      <main className="flex w-full h-full shadow-lg rounded-3xl">

        <section className="flex flex-col pt-3 w-3/12 bg-gray-50 h-full overflow-y-scroll fixed">
          {/* list for participants of the users, select one then we load the chat */}
          <ul className="mt-6">
            <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
            <h1 className="text-center text-lg font-bold text-gray-500 my-2 underline">
              <span className="flex justify-evenly items-center w-[150px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path d="M3.505 2.365A41.369 41.369 0 0 1 9 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 0 0-.577-.069 43.141 43.141 0 0 0-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 0 1 5 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914Z" />
                  <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 0 0 1.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0 0 14 6Z" />
                </svg>

                <span>Chat List</span>
              </span>
            </h1>
            {Participants &&
              Participants.map(
                (val, index) =>
                  alsoLoggedInUserId !== val._id && (
                    <>
                      <div
                        onClick={() => selectChat(val._id, val.email)}
                        className={`${val._id === activeChatId &&
                          "bg-blue-500 shadow-lg rounded-lg text-white"
                          } py-3 border-b px-3 transition hover:bg-indigo-100 cursor-pointer my-1`}
                        key={index + 1}
                      >
                        <h3 className="text-lg font-semibold">
                          {val.email.split("@")[0]}
                        </h3>
                      </div>
                    </>
                  )
              )}
          </ul>
        </section>
        <section className="w-6/12 px-4 flex flex-col bg-white rounded-r-3xl ml-96">
          {selectedChatList &&
            selectedChatList.map((val, index) => (
              <div key={index}>
                {val.messagesItself[alsoLoggedInUserId] && (
                  <section className="mb-20">
                    <p className="mb-3">Me</p>
                    <p className="shadow-md w-2/12 p-3 inline bg-slate-400 text-white rounded-lg ">
                      {val.messagesItself[alsoLoggedInUserId]}
                    </p>
                  </section>
                )}
                {val.messagesItself[activeChatId] && (
                  <section className="text-right my-8">
                    <p className="mb-3 my-3">{Email && Email}</p>
                    <p className="shadow-md w-2/12 p-3 inline bg-slate-400 text-white rounded-lg my-2">
                      {val.messagesItself[activeChatId]}
                    </p>
                  </section>
                )}
              </div>
            ))}
          <section className="mt-6 border rounded-xl bg-gray-50 mb-3">
            <input
              className="w-full bg-gray-50 p-2 rounded-xl"
              placeholder="Type your message here..."
              onChange={(e) => setmessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents the default behavior of the Enter key (submitting the form)
                  sendMessage();
                }
              }}
              value={messageText}
            ></input>
            <div className="flex items-center justify-between p-2">
              <button
                onClick={sendMessage}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
                <span ref={ScrollMe}></span>
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default SellerInbox;
