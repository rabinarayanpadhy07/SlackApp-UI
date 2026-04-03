import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCaptureOrder } from "@/hooks/apis/payments/useCaptureOrder";

const loadRazorpayScript = (src) => {
    return new Promise((res) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log('Razorpay script loaded');
            res(true);
        };
        script.onerror = () => {
            console.log('Error in loading Razorpay script');
            res(false);
        };
        document.body.appendChild(script);
    })
}

export const RenderRazorpayPopup = ({ 
    orderId,
    keyId,
    currency,
    amount,
 }) => {
    const navigate = useNavigate();

    const { captureOrderMutation } = useCaptureOrder();

    useEffect(() => {
        let isMounted = true;

        const display = async () => {
            const scriptResponse = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
            if(!scriptResponse || !isMounted) {
                return;
            }

            const rzp = new window.Razorpay({
                key: keyId,
                amount,
                currency,
                name: "RABI NARAYAN PADHY",
                description: "Test Transaction",
                order_id: orderId,
                handler: async (response) => {
                    const result = await captureOrderMutation({
                        orderId,
                        status: 'success',
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature
                    });

                    if (result) {
                        navigate('/home');
                    }
                }
            });

            rzp.on('payment.failed', async (response) => {
                toast.error('Payment failed', {
                    description: response?.error?.description || 'Please try again.'
                });
                await captureOrderMutation({
                    orderId,
                    status: 'failed',
                    paymentId: '',
                });
            });

            rzp.open();
        };

        display();

        return () => {
            isMounted = false;
        };
    }, [amount, captureOrderMutation, currency, keyId, navigate, orderId]);

    return null;
};
