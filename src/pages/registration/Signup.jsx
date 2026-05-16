import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    const signup = async (e) => {
        e.preventDefault();
        
        if (name === "" || email === "" || password === "") {
            return toast.error("All fields are required");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address");
        }

        setLoading(true);
        try {
            const users = await createUserWithEmailAndPassword(auth, email, password);

            const user = {
                name: name,
                uid: users.user.uid,
                email: users.user.email,
                role: 'user', // Default is user. Promote to admin manually in Firebase Console.
                date: new Date().toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                }),
                time: Timestamp.now()
            }
            await setDoc(doc(fireDB, "users", users.user.uid), user);

            // AUTO-LOGIN LOGIC:
            // Store the same structure that the Login page uses
            const userPayload = {
                user: {
                    uid: users.user.uid,
                    email: users.user.email,
                },
                profile: {
                    name: name,
                    role: 'user', // Default is user
                }
            };
            
            // This is what the rest of the app looks for to consider a user "logged in"
            localStorage.setItem('user', JSON.stringify(userPayload));

            toast.success("Account created successfully! Redirecting...");
            setName("");
            setEmail("");
            setPassword("");
            setLoading(false);
            
            // Redirect to home immediately as a logged-in user
            navigate('/');

        } catch (error) {
            setLoading(false);
            console.error("Firebase Error Code:", error.code);
            console.error("Firebase Error Message:", error.message);
            
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email already in use. Please log in.");
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password is too weak. Use a stronger password.");
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email address.");
            } else if (error.code === 'auth/operation-not-allowed') {
                toast.error("Email/password signup is not enabled. Please contact support.");
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many signup attempts. Please try again later.");
            } else {
                toast.error(error.message || "Signup failed. Please try again.");
            }
        }
    }

    return (
        <div className='bg-white min-h-screen flex flex-col'>
            {loading && <Loader />}
            
            <div className='flex flex-1 items-center justify-center px-4'>
                <div className='w-full max-w-[450px]'>
                    
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <Link to="/" className="inline-block mb-8 hover:opacity-70 transition-opacity">
                            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                        </Link>
                        <h1 className="text-[32px] font-oswald font-medium text-[#111111] mb-3">
                            Create Account
                        </h1>
                        <p className="text-[#757575] text-[15px]">
                            Join us and start shopping today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={signup} className="space-y-5 mb-8">
                        {/* Full Name */}
                        <div>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                autoComplete="name"
                                className='w-full px-4 py-3 bg-[#F5F5F5] text-[#111111] rounded-none border border-[#E5E5E5] focus:border-[#111111] focus:outline-none transition-colors text-[15px]'
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                autoComplete="email"
                                className='w-full px-4 py-3 bg-[#F5F5F5] text-[#111111] rounded-none border border-[#E5E5E5] focus:border-[#111111] focus:outline-none transition-colors text-[15px]'
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password (min. 6 characters)"
                                autoComplete="new-password"
                                className='w-full px-4 py-3 bg-[#F5F5F5] text-[#111111] rounded-none border border-[#E5E5E5] focus:border-[#111111] focus:outline-none transition-colors text-[15px]'
                                required
                            />
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full py-3 bg-[#111111] text-white font-medium text-[15px] hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full'
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="text-center border-t border-[#E5E5E5] pt-6">
                        <p className="text-[#757575] text-[15px]">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className='text-[#111111] font-medium hover:underline'
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-[#E5E5E5] text-center text-[#757575] text-[13px] space-y-3">
                        <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.338 7.59a6.998 6.998 0 1111.242-1.408A6.964 6.964 0 0110 15a6.964 6.964 0 01-4.662-1.818zm2.621-2.21a1 1 0 011.414 1.414L7.414 9l1.96 1.96a1 1 0 01-1.414 1.414L6 10.414l-1.96 1.96a1 1 0 01-1.414-1.414L4.586 9 2.626 7.04a1 1 0 111.414-1.414L6 7.586l1.96-1.96z" clipRule="evenodd" />
                            </svg>
                            Secure & Encrypted
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
