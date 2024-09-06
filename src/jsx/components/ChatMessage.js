import React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material';
import { useAuthContext } from '../../services/useAuthContext';

const MessageHeader = styled('div')`
    display: flex;
    justify-content: space-between;

    .sender {
        display: block;
        margin-bottom: 4px;
    }
`;

const MessageContainer = styled('div')`
    padding: 15px 20px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    border-radius: 8px;

    .text {
        flex: 1;
    }

    .timestamp {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 10px;
    }

    .square-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
    }
`;

const ChatMessage = ({ sender, message, timestamp, senderEmail, avatar }) => {
    const { USER } = useAuthContext();

    const isMyMessage = senderEmail === USER.email;

    return (
        <div type="slideUp">
            <MessageHeader>
                <span className="sender text-12 text-600">{isMyMessage ? senderEmail : sender}</span>
                <span className="timestamp text-10">{dayjs(timestamp).format('HH:mm')}</span>
            </MessageHeader>
            <MessageContainer>
                {!isMyMessage && <img className="square-avatar" src={avatar} alt={sender} />}
                <p className="text">{message}</p>
                {isMyMessage && <img className="square-avatar" src={USER.avatar} alt={sender} />}
            </MessageContainer>
        </div>
    );
};

export default ChatMessage;
