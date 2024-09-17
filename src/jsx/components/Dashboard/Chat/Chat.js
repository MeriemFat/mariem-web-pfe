import React, { useEffect, useRef, useState } from "react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import { Link } from "react-router-dom";
import profile from "../../../../images/profile/small/placeholder.webp";
import PageTitle from "../../../layouts/PageTitle";
import { toast } from "react-toastify";

import { useCreateChat } from "../../../../Hooks/useCreateChat";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { addChat, toggleCollapse } from "../../../../features/chats/chatSlice";
import { useForm, Controller } from "react-hook-form";
import CustomMultiSelect from "../../../../ui/CustomMultiSelect";
import useMeasure from "react-use-measure";
import { useAuthContext } from "../../../../services/useAuthContext";
import io from "socket.io-client";
import dayjs from "dayjs";
import { LuSendHorizonal } from "react-icons/lu";
import ChatMessage from "../../ChatMessage";
import "./style.css";
import Unauthorized from "../../../pages/Unauthorized";
import axios from "axios";
const ChatList = ({ userChats, onSelectChat }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: "",
      type: "group",
    },
  });
  const [selectedChat, setSelectedChat] = useState(null); // State to manage selected chat

  const toggleSelected = (chat) => {
    setSelectedChat(chat === selectedChat ? null : chat);
    onSelectChat(chat);
  };

  const [formVisible, setFormVisible] = useState(false);
  const trackRef = useRef(null);
  const { createNewChat } = useCreateChat();
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [headerRef, { height: headerHeight }] = useMeasure();
  const token = localStorage.getItem("token");
  const onSubmit = async (data) => {
    createGroup(data)
      .then((data) => {
        setGroups((prev) => [...prev, data]);
        toast.success("Group has been created successfully.");
        onReset();
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };
  const getListGroup = async () => {
    try {
      const response = await axios.get(`/api/chat/group`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);

      throw error;
    }
  };

  const createGroup = async (data) => {
    try {
      const response = await axios.post(`/api/chat/group/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const apiDeleteGroup = async (id) => {
    try {
      const response = await axios.delete(`/api/chat/group/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);

      throw error;
    }
  };
  const apiJoinGroup = async (data) => {
    try {
      const response = await axios.post(`/api/chat/participant`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error JOIN users:", error);

      throw error;
    }
  };

  const apiLeaveGroup = async (id) => {
    try {
      const response = await axios.delete(`/api/chat/participant/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);

      throw error;
    }
  };
  const deleteGroup = async (id) => {
    apiDeleteGroup(id).then((data) => {
      toast.success(data);
    });
  };
  const joinGroup = async (id) => {
    apiJoinGroup({ groupId: id }).then((data) => {
      toast.success(data);
    });
  };
  const leaveGroup = async (id) => {
    apiLeaveGroup(id).then((data) => {
      toast.success(data);
    });
  };
  useEffect(() => {
    getListGroup()
      .then((data) => {
        setGroups(data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  const onReset = () => {
    reset();
    setFormVisible(false);
  };

  useEffect(() => {
    trackRef.current && trackRef.current.scrollTo(0, 0);
  }, [formVisible]);

  return (
    <div className="card">
      <div className="card-header border-0 pb-0">
        <h3 ref={headerRef}>Chat List</h3>
      </div>
      <div className="card-body pt-3">
        <div className="profile-news">
          {groups && groups.length > 0 ? (
            groups.map((group, index) => (
              <div
                key={index}
                className={`media pt-3 pb-3 ${
                  group === selectedChat ? "selected-chat" : ""
                }`}
                onClick={() => group?.participant_id && toggleSelected(group)}
                style={{ cursor: "pointer" }}
              >
                {groups.length > 0 ? (
                  <>
                    <div className="media-body">
                      <h5>{group.label}</h5>
                      <div>
                        <Link to={"#"}>
                          <i
                            className={
                              group?.participant_id
                                ? "fa fa-sign-out-alt text-blue"
                                : "fa fa-user-plus text-blue"
                            }
                            style={{ fontSize: "24px", marginRight: "10px" }}
                            onClick={() => {
                              group?.participant_id
                                ? leaveGroup(group.participant_id)
                                : joinGroup(group._id);
                            }}
                          />
                        </Link>
                        <Link to={"#"}>
                          <i
                            className="fa fa-trash text-danger"
                            style={{ fontSize: "24px" }}
                            onClick={() => deleteGroup(group._id)}
                          />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>No Groups</p>
                )}
              </div>
            ))
          ) : (
            <p>No chats available</p>
          )}
        </div>
      </div>
      <div className="card-footer" style={{ paddingTop: 20 }}>
        <button
          className="btn w-100"
          onClick={() => setFormVisible(true)}
          disabled={formVisible}
        >
          Create new chat
        </button>
        {formVisible && (
          <form
            className="d-flex flex-column g-20"
            onSubmit={handleSubmit(onSubmit)}
            style={{ padding: "20px 30px 10px" }}
          >
            <input
              type="text"
              placeholder="Chat name"
              {...register("label", { required: true })}
              className="form-control"
            />

            <div className="d-grid col-2 g-20 ">
              <button
                className="btn"
                style={{
                  marginTop: "200px",
                  width: "370px",
                  marginLeft: "-50px",
                }}
              >
                Submit
              </button>
              <button
                className="btn btn-danger"
                type="reset"
                style={{
                  width: "370px",
                  marginLeft: "-50px",
                  marginTop: "10px",
                  backgroundColor: "black",
                  color: "white",
                }}
                onClick={onReset}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const MessageSection = ({ selectedChat: propsSelectedChat }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { USER } = useAuthContext();

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    setSelectedChatId(propsSelectedChat?._id);
  }, [propsSelectedChat]);
  const apiListOfMesssageGroup = async (id) => {
    try {
      const response = await axios.get(`/api/chat/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);

      throw error;
    }
  };
  useEffect(() => {
    let socketInstance;
    try {
      socketInstance = io({ transports: ["websocket"] });
    } catch (error) {
      console.log("Socket couldn't connect, ERROR:", error.message);
    }
    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);
  const apiSendMessageInGroup = async (data) => {
    try {
      const response = await axios.post(`/api/chat/message`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const sendMessage = async (data) => {
    apiSendMessageInGroup(data).then((data) => {
      setMessageList((prev) => [...prev, data]);
      scrollToBottom();
      console.log(data);
    });
  };
  const getlistOfMessage = async (id) => {
    apiListOfMesssageGroup(id)
      .then((data) => {
        setMessageList(data);
        scrollToBottom();
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (!!selectedChatId) {
      getlistOfMessage(selectedChatId);
    }
  }, [selectedChatId]);

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      message: "",

      timestamp: Date.now(),
    },
  });

  const onSubmit = async (data) => {
    if (selectedChatId) {
      data.timestamp = Date.now();
      data.group_id = selectedChatId;
      data.participant_id = propsSelectedChat?.participant_id;
      await sendMessage(data);
      reset();
    }
  };
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };
  const [footerRef, { height: footerHeight }] = useMeasure();
  const [headerRef, { height: headerHeight }] = useMeasure();
  // const messages = propsSelectedChat ? propsSelectedChat.messages : [];

  const uniqueDates = [
    ...new Set(
      messageList.map((item) => dayjs(item.timestamp).format("DD.MM.YY"))
    ),
  ];

  const messagesByDate = uniqueDates.map((date) =>
    messageList.filter(
      (item) => dayjs(item.timestamp).format("DD.MM.YY") === date
    )
  );

  return (
    <div className="card h-2 d-flex flex-column justify-content-between">
      <h3 ref={headerRef}>Chat</h3>

      {/* Scrollable message container */}
      <div
        ref={messageContainerRef}
        style={{
          height: `calc(100vh - ${headerHeight + footerHeight + 120}px)`,
          overflowY: "auto", // Enable vertical scrolling
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messagesByDate.map((messages, dateIndex) => (
          <div key={dateIndex}>
            <h5
              style={{
                textAlign: "center",
                margin: "20px 0",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#666",
                borderBottom: "1px solid #ddd",
                paddingBottom: "5px",
              }}
            >
              {uniqueDates[dateIndex]}
            </h5>
            <div>
              {messages.map((message, idx) => (
                <div key={idx}>
                  <ChatMessage
                    index={idx}
                    {...message}
                    myParticipationId={propsSelectedChat.participant_id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {propsSelectedChat && (
        <div className="card_footer" ref={footerRef} style={{ paddingTop: 20 }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ padding: "20px 30px 10px" }}
          >
            <div className="d-flex flex-row g-20">
              <input
                type="text"
                placeholder="Send message..."
                {...register("message", { required: true })}
                style={{ flexGrow: 1 }}
              />
              <button type="submit" className="btn">
                <LuSendHorizonal />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { USER } = useAuthContext();

  return (
    <div>
      <PageTitle
        activeMenu="Messangerie"
        motherMenu="Advanced"
        pageContent="Post Details"
      />
      <div className="row">
        <div className="col-lg-12">
          <div className="profile card card-body px-3 pt-3 pb-0">
            <div className="profile-head">
              <div className="photo-content">
                <div className="cover-photo rounded"></div>
              </div>
              <div className="profile-info">
                <div className="profile-photo">
                  <img
                    src={USER?.avatar}
                    className="img-fluid rounded-circle"
                    alt="profile"
                  />
                </div>
                <div className="profile-details">
                  <div className="profile-name px-3 pt-2">
                    <h4 className="text-primary mb-0">{USER?.fullname}</h4>
                    <p>
                      {USER?.roles === 20 ? (
                        <p>Fournisseur</p>
                      ) : USER?.roles === 30 ? (
                        <p>Collaborateur</p>
                      ) : USER?.roles === 10 ? (
                        <p>Admin</p>
                      ) : (
                        <p>Client</p>
                      )}
                    </p>
                  </div>
                  <div className="profile-email px-2 pt-2">
                    <h4 className="text-muted mb-0">{USER?.email}</h4>
                    <p>Email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4">
          <ChatList onSelectChat={setSelectedChat} />
        </div>
        <div className="col-xl-8">
          <MessageSection selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
