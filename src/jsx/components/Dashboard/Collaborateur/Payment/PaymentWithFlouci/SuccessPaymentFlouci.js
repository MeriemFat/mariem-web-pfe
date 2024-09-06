import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from "@mui/material";
import { useAuthContext } from "../../../../../../services/useAuthContext";
import queryString from 'query-string';
import {toast} from "react-toastify";

const SuccessContainer = styled('div')`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const SuccessTitle = styled('h2')`
    color: #00a859;
    font-size: 28px;
    margin-bottom: 20px;
`;

const SuccessMessage = styled('p')`
    font-size: 18px;
    line-height: 1.6;
`;

const IconWrapper = styled('div')`
    color: #00a859;
    font-size: 48px;
    margin-bottom: 20px;
`;

const SuccessPaymentFlouci = () => {
    const { USER } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const { payment_id: paymentId } = queryString.parse(location.search);


    const sendSMS = async () => {
        try {
            const response = await fetch(`http://localhost:3000/Payment/payment-success?payment_id=${paymentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: USER.phone }),
            });

            if (response.ok) {
                toast.success('SMS sent successfully');
            } else {
                toast.error('Failed to send SMS');
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
        }
    };

    useEffect(() => {
        if (paymentId) {
            sendSMS();
        }

        const timeoutId = setTimeout(() => {
            navigate('/payment-flouci');
        }, 6000);

        return () => clearTimeout(timeoutId);
    }, [USER.phone, paymentId, navigate]);

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <SuccessContainer>
                <IconWrapper>
                    <i className="fas fa-check-circle"></i>
                </IconWrapper>
                <SuccessTitle>Payment Successful!</SuccessTitle>
                <SuccessMessage>
                    Thank you for your payment. Your transaction was successful.
                    In case of any inquiries, contact support at <br />
                    <strong>support@STMicroelectronics.com</strong>
                </SuccessMessage>
            </SuccessContainer>
        </>
    );
};

export default SuccessPaymentFlouci;
