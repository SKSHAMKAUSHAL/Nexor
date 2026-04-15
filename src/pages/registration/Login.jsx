import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import myContext from '../../context/data/myContext'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../firebase/FirebaseConfig';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

function Login() {
    const context = useContext(myContext)
    const { loading, setLoading } = context;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill all fields");
            return;
        }
        
        setLoading(true)
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            
            let profileDoc = null;
            let role = 'user'; // Default role
            let name = result.user.displayName || '';

            try {
                // Fetch directly by document ID (which matches the Auth UID now)
                const userDocRef = doc(fireDB, 'users', result.user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    profileDoc = userDocSnap.data();
                    role = profileDoc.role?.trim() || 'user';
                    name = profileDoc.name || name;
                } else {
                    role = 'user';
                }
            } catch (firestoreError) {
                console.error('Firestore Error:', firestoreError);
                toast.error("Warning: Could not fetch your admin role due to Firebase Permissions.");
            }

            toast.success("Login successful!");
            const userPayload = {
                user: {
                    uid: result.user.uid,
                    email: result.user.email,
                },
                profile: {
                    name: name,
                    role: role,
                }
            };

            localStorage.setItem('user', JSON.stringify(userPayload));
            navigate('/')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Firebase Error Code:", error.code);
            console.error("Firebase Error Message:", error.message);
            if (error.code === 'auth/invalid-credential') {
                toast.error("Invalid email or password");
            } else if (error.code === 'auth/user-not-found') {
                toast.error("Account not found. Please sign up first.");
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Wrong password. Please try again.");
            } else {
                toast.error(error.message || "Login failed. Please try again.");
            }
        }
    }
   
    return (
        <div className='bg-white min-h-screen flex flex-col'>
            {loading && <Loader/>}
            
            <div className='flex flex-1 items-center justify-center px-4'>
                <div className='w-full max-w-[450px]'>
                    
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <Link to="/" className="inline-block mb-8 hover:opacity-70 transition-opacity">
                            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                        </Link>
                        <h1 className="text-[32px] font-oswald font-medium text-[#111111] mb-3">
                            Sign In
                        </h1>
                        <p className="text-[#757575] text-[15px]">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={login} className="space-y-5 mb-8">
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
                                placeholder="Password"
                                autoComplete="current-password"
                                className='w-full px-4 py-3 bg-[#F5F5F5] text-[#111111] rounded-none border border-[#E5E5E5] focus:border-[#111111] focus:outline-none transition-colors text-[15px]'
                                required
                            />
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full py-3 bg-[#111111] text-white font-medium text-[15px] hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full'
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center border-t border-[#E5E5E5] pt-6">
                        <p className="text-[#757575] text-[15px]">
                            Don&apos;t have an account?{' '}
                            <Link 
                                to="/signup" 
                                className='text-[#111111] font-medium hover:underline'
                            >
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-[#E5E5E5] text-center text-[#757575] text-[13px] space-y-3">
                        <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
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

export default Login
