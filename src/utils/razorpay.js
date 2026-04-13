import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';

// ✅ Dynamically Load Razorpay Script
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
    toast.error('Razorpay failed to load. Please check your connection.');
    setLoading(false);
    return;
  }

  try {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_1DP5mmOlF5G5ag', // Fallback to hardcoded test key if env is missing
      amount: Math.floor(grandTotal * 100),
      currency: 'INR',
      name: 'ShopUp / Nexor', // Updated to match store identity
      description: 'Secure Payment',
      handler: async (response) => {
        try {
          await addDoc(collection(fireDB, 'orders'), {
            ...orderInfo,
            paymentId: response.razorpay_payment_id,
            status: 'success',
          });

          dispatch(clearCart());
          toast.success('Payment Successful');
          
          // Small delay before redirecting for smoother UX
          setTimeout(() => {
            navigate('/order');
          }, 800);
        } catch (error) {
          console.error('Order saving failed:', error);
          toast.error('Order saving failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: name,
        email: user?.user?.email || 'guest@example.com',
        contact: phoneNumber,
      },
      theme: { color: '#000000' },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (res) => {
      toast.error(`Payment Failed: ${res.error.description}`);
      setLoading(false);
    });

    rzp.open();
  } catch (error) {
    console.error('Payment initialization failed:', error);
    toast.error('Payment init failed');
    setLoading(false);
  }
};
