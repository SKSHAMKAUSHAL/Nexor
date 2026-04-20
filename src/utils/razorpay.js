import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';

// Dynamically Load Razorpay Script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processPayment = async ({
  grandTotal,
  orderInfo,
  user,
  name,
  phoneNumber,
  dispatch,
  clearCart,
  toast,
  navigate,
  setLoading,
}) => {
  const res = await loadRazorpay();
  if (!res) {
    toast.error('Razorpay failed to load. Please check your internet connection.');
    setLoading(false);
    return;
  }

  try {
    const orderResponse = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: grandTotal }),
    });
    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderData?.error || orderData?.message || 'Failed to create Razorpay order');
    }

    const orderId = orderData?.order?.id;
    const orderAmount = orderData?.order?.amount;
    const orderCurrency = orderData?.order?.currency;

    if (orderData?.success === false || !orderId || !orderAmount || !orderCurrency) {
      throw new Error('Razorpay order ID missing from backend response');
    }

    const razorpayTestKey = 'rzp_test_SfRQvS1mN6jO7e';

    const options = {
      key: razorpayTestKey,
      amount: orderAmount,
      currency: orderCurrency,
      name: 'ShopUp / Nexor',
      description: 'Test Mode Transaction',
      order_id: orderId,
      
      handler: async (response) => {
        try {
          // Add the successful order to Firebase
          await addDoc(collection(fireDB, 'orders'), {
            ...orderInfo,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            status: 'success',
          });

          dispatch(clearCart());
          toast.success('Test Payment Successful! Order Placed.');
          
          // Small delay before redirecting for smoother UX
          setTimeout(() => {
            navigate('/order');
          }, 800);
        } catch (error) {
          console.error('Order saving failed:', error);
          toast.error('Order saving failed. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: name,
        email: user?.user?.email || 'guest@example.com',
        contact: phoneNumber,
      },
      theme: { color: '#111111' },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (res) => {
      toast.error(`Payment Failed: ${res.error.description}`);
      setLoading(false);
    });

    rzp.open();
  } catch (error) {
    console.error('Payment initialization failed:', error);
    toast.error('Payment initialization failed');
    setLoading(false);
  }
};
