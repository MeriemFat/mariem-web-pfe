import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from "@mui/material/styles";

const CancelContainer = styled('div')`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const CancelTitle = styled('h2')`
    color: #ff0000;
    font-size: 28px;
    margin-bottom: 20px;
`;

const CancelMessage = styled('p')`
    font-size: 18px;
    line-height: 1.6;
`;

const IconWrapper = styled('div')`
    color: #ff0000;
    font-size: 48px;
    margin-bottom: 20px;
`;

const CancelPaymentFlouci = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const redirectToPayment = () => {
            navigate('/payment-flouci');
        };

        const timeoutId = setTimeout(redirectToPayment, 3000);

        return () => clearTimeout(timeoutId);
    }, [navigate]);

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <CancelContainer>
                <IconWrapper>
                    <i
                        className="fa fa-times-circle"
                        aria-hidden="true"
                    />
                </IconWrapper>
                <CancelTitle>Payment Canceled</CancelTitle>
                <CancelMessage>
                    Your payment has been canceled. If you have any questions, please contact our support at{" "}
                    <strong>support@STMicroelectronics.com</strong>
                </CancelMessage>
            </CancelContainer>
        </>
    );
}

export default CancelPaymentFlouci;
