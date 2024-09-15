import React, { useEffect, useRef, useState } from "react";
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import profile from "../../../../images/profile/small/placeholder.webp";
import PageTitle from "../../../layouts/PageTitle";
import { useFindUserChats } from "../../../../Hooks/useFindUserChats";
import { useCreateChat } from "../../../../Hooks/useCreateChat";
import { useDispatch } from "react-redux";
import { nanoid } from "nanoid";
import { addChat, toggleCollapse } from "../../../../features/chats/chatSlice";
import { useForm, Controller } from "react-hook-form";
import CustomMultiSelect from "../../../../ui/CustomMultiSelect";
import useMeasure from "react-use-measure";
import {useAuthContext} from "../../../../services/useAuthContext";
import io from "socket.io-client";
import dayjs from 'dayjs';
import {LuSendHorizonal} from "react-icons/lu";
import ChatMessage from "../../ChatMessage";
import './style.css'
import Unauthorized from "../../../pages/Unauthorized";
import axios from "axios";
const ChatList = ({ userChats, onSelectChat }) => {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm({
        defaultValues: {
            owner: null,
            label: '',
            type: 'group',
        }
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
    const [users, setUsers] = useState([]);
    const [fetchingUsers, setFetchingUsers] = useState(true);
    const [headerRef, { height: headerHeight }] = useMeasure();






    const onSubmit = async data => {
        const id = nanoid(5);
        dispatch(addChat({
            type: data.type.value,
            label: data.label,
            expanded: false
        }));
        let participants = [];
        data.participants.forEach(user => {
            const participant = user.value;
            participants.push(participant);
        });
        const Chat = {
            label: data.label,
            owner: null,
            participants: participants,
            type: data.type.value,
            messages: [],
        };
        await createNewChat(Chat);
        setFormVisible(false);
        setTimeout(() => dispatch(toggleCollapse({ id })), 300);
        data.participants = null;
        reset();
        setFetchingUsers(true);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/User/for-chat`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                const data = response.data;  
                console.log('Role request data:', data);
                
            } catch (error) {
                console.error('Error fetching users:', error);
                
                throw error; 
            }
        };
        



        fetchUsers().then((json) => {
            const data = json.data.map(user => ({
                value: user.email,
                label: user.fullname ? user.fullname + " ( " + user.email + " ) " : user.email,
            }));


            setUsers(data);
            setFetchingUsers(false);
        }).catch(e => {
            setUsers([]);
            setFetchingUsers(false);
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
                <h3 ref={headerRef}>
                    Chat List
                </h3></div>
            <div className="card-body pt-3">
                <div className="profile-news">
                    {userChats && userChats.length > 0 ? (
                        userChats.map((chat, index) => (
                            <div
                                key={index}
                                className={`media pt-3 pb-3 ${chat === selectedChat ? 'selected-chat' : ''}`}
                                onClick={() => toggleSelected(chat)}
                                style={{cursor: "pointer"}}
                            >
                                {chat.participants.length > 0 ? (
                                    <>
                                        <img
                                            src={chat.participants[0].avatar || profile}
                                            alt=""
                                            className="me-3 rounded"
                                            width={75}
                                        />
                                        <div className="media-body">
                                            <h5>{chat.participants[0].email}</h5>
                                            <p>{chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].message : 'No messages'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p>No participants</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No chats available</p>
                    )}
                </div>
            </div>
            <div className="card-footer" style={{paddingTop: 20}}>
                <button className="btn w-100" onClick={() => setFormVisible(true)} disabled={formVisible}>
                    Create new chat
                </button>
                {formVisible && (
                    <form className="d-flex flex-column g-20" onSubmit={handleSubmit(onSubmit)}
                          style={{padding: '20px 30px 10px'}}>
                        <input type="text" placeholder="Chat name" {...register('label', {required: true})}  className="form-control" />
                        <Controller
                            className="form-control"
                            name="type"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <select {...field} className="form-control">
                                <option value="group">Group</option>
                                    <option value="private">Private</option>
                                </select>
                            )}
                        />
                        <Controller
                            className="form-control"
                            name="participants"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) =>
                                fetchingUsers ? <div className="box"></div> :
                                    <CustomMultiSelect
                                        className="form-control"
                                        defaultValue={[]}
                                        name="participants"
                                        options={users}
                                        onChange={field.onChange}
                                    />
                            }
                        />
                        <div className="d-grid col-2 g-20 " >

                            <button className="btn" style={{marginTop:"200px",width:"370px",marginLeft:"-50px"}}>Submit</button>
                            <button className="btn btn-danger" type="reset" style={{width:"370px",marginLeft:"-50px",marginTop:"10px" ,backgroundColor:"black",color:"white"}} onClick={onReset}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


const MessageSection = ({ selectedChat: propsSelectedChat }) => {
    const dispatch = useDispatch();
    const { getChats } = useFindUserChats();
    const { USER } = useAuthContext();

    const [sending, setSending] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSelectedChatId(propsSelectedChat?._id);
    }, [propsSelectedChat]);

    useEffect(() => {
        let socketInstance;
        try {
            socketInstance = io({ transports: ['websocket'] });
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


    const sendMessage = async (data) => {
        setSending(true);
        socket.emit('message', data);
    };

    useEffect(() => {
        async function fetchData() {
            await getChats();
        }

        fetchData();

        if (socket) {
            socket.on('received', async (data) => {
                await fetchData();
                setSending(false);
            });
        }

        return () => {
            if (socket) {
                socket.off('received');
            }
        };
    }, [socket]);

    const { handleSubmit, register, reset } = useForm({
        defaultValues: {
            message: '',
            senderEmail: USER?.email || null,
            timestamp: Date.now(),
            avatar: USER?.avatar || '',
            chat: null,
        },
    });

    const onSubmit = async (data) => {
        if (selectedChatId) {
            data.timestamp = Date.now();
            data.chat = selectedChatId;
            await sendMessage(data);
            reset();
        }
    };

    const messages = propsSelectedChat ? propsSelectedChat.messages : [];

    const uniqueDates = [...new Set(messages.map((item) => dayjs(item.timestamp).format('DD.MM.YY')))];
    const [footerRef, { height: footerHeight }] = useMeasure();
    const [headerRef, { height: headerHeight }] = useMeasure();

    const messagesByDate = uniqueDates.map((date) => {
        return messages.filter((item) => dayjs(item.timestamp).format('DD.MM.YY') === date);
    });
    messagesByDate.sort((a, b) => {
        const dateA = dayjs(a[0].timestamp, 'DD.MM.YY');
        const dateB = dayjs(b[0].timestamp, 'DD.MM.YY');
        return dateB - dateA;
    });

    return (
        <div className="card h-2 d-flex flex-column justify-content-between">
            <h3 ref={headerRef}>
                Chat
            </h3>
            <div height={headerHeight + footerHeight} bg="widget-bg" isCompact={true}>
                <div >
                    {uniqueDates.map((date, index) => {
                        const isToday = dayjs().format('DD.MM.YY') !== date;
                        return (
                            <div key={index}>
                                <div >
                                    {messagesByDate[index].map((message, idx) => (
                                        <ChatMessage key={idx} index={idx} {...message} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {propsSelectedChat && (
                <div className="card_footer" ref={footerRef} style={{ paddingTop: 20 }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px 30px 10px' }}>
                        <div className="d-flex flex-row g-20">
                            <input
                                type="text"
                                placeholder="Send message..."
                                {...register('message', { required: true })}
                            />
                            <button type="submit" disabled={sending} className="btn">
                                {sending ? <span ></span> : <LuSendHorizonal />}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};



const Chat = () => {
    const { userChats } = useFindUserChats();
    const [selectedChat, setSelectedChat] = useState(null);
    const {USER} = useAuthContext();


    return (
        USER ?

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
                                <div className="cover-photo rounded">
                                </div>
                            </div>
                            <div className="profile-info">
                                <div className="profile-photo">
                                    <img src={USER.avatar} className="img-fluid rounded-circle" alt="profile" />
                                </div>
                                <div className="profile-details">
                                    <div className="profile-name px-3 pt-2">
                                        <h4 className="text-primary mb-0">{USER.fullname}</h4>
                                        <p>
                                            {USER.roles===20 ? (
                                                <p>Fournisseur</p>
                                            ) : USER.roles===30 ? (
                                                <p>Collaborateur</p>
                                            ) : USER.roles===10  ? (
                                                <p>Admin</p>
                                            ) : (
                                                <p>Client</p>
                                            )
                                            }
                                        </p>
                                    </div>
                                    <div className="profile-email px-2 pt-2">
                                        <h4 className="text-muted mb-0">{USER.email}</h4>
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
                    <ChatList userChats={userChats} onSelectChat={setSelectedChat} />
                </div>
                <div className="col-xl-8">
                    <MessageSection selectedChat={selectedChat} />
                </div>
            </div>
        </div>
        : (
            <div>
                <>
                    <Unauthorized/>
                </>
            </div>
        )
    );
};

export default Chat;
