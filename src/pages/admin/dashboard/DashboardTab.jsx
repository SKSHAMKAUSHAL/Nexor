import { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { AiFillShopping, AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

function DashboardTab() {
    const context = useContext(myContext);
    const { mode, product, edithandle, deleteProduct, order, deleteOrder, user } = context;
    const navigate = useNavigate();

    const themeColors = {
        bg: mode === 'dark' ? 'bg-gray-800' : 'bg-white',
        text: mode === 'dark' ? 'text-white' : 'text-gray-800',
        mutedText: mode === 'dark' ? 'text-gray-400' : 'text-gray-500',
        border: mode === 'dark' ? 'border-gray-700' : 'border-gray-200',
        headerBg: mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
    };

    return (
        <div className="font-sans">
            <Tabs defaultIndex={0} className="w-full">
                <TabList className="flex flex-wrap gap-4 mb-8">
                    {[
                        { title: 'Products', icon: <MdOutlineProductionQuantityLimits size={20} /> },
                        { title: 'Orders', icon: <AiFillShopping size={20} /> },
                        { title: 'Users', icon: <FaUser size={20} /> }
                    ].map((tab, i) => (
                        <Tab
                            key={i}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 
                            ${mode === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-white hover:bg-blue-500'}
                            border outline-none ${themeColors.border}`}
                            selectedClassName={`border-none shadow-md bg-blue-600 text-white`}
                        >
                            {tab.icon}
                            {tab.title}
                        </Tab>
                    ))}
                </TabList>

                {/* Products Tab Panel */}
                <TabPanel>
                    <div className={`${themeColors.bg} rounded-2xl shadow-sm border ${themeColors.border} overflow-hidden`}>
                        <div className={`${themeColors.border} border-b px-6 py-5 flex flex-wrap items-center justify-between gap-4`}>
                            <div>
                                <h2 className={`text-xl font-bold ${themeColors.text}`}>Product Details</h2>
                                <p className={`text-sm mt-1 ${themeColors.mutedText}`}>Manage your store products</p>
                            </div>
                            <Link to='/addproduct'>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                                    <AiOutlinePlus /> Add Product
                                </button>
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`text-sm uppercase font-semibold tracking-wider ${themeColors.headerBg} ${themeColors.mutedText}`}>
                                    <tr>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Type/Category</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${themeColors.border}`}>
                                    {product.map((item, index) => (
                                        <tr key={index} className={`hover:${mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors`}>
                                            <td className="px-6 py-4">
                                                <img 
                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200" 
                                                    src={item.imageUrl} 
                                                    alt={item.title} 
                                                />
                                            </td>
                                            <td className={`px-6 py-4 font-medium ${themeColors.text}`}>{item.title}</td>
                                            <td className="px-6 py-4 font-semibold text-green-600">₹{item.price}</td>
                                            <td className={`px-6 py-4 ${themeColors.mutedText}`}>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <button onClick={() => { edithandle(item); window.scrollTo(0,0); navigate('/updateproduct'); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium">Edit</button>
                                                    <button onClick={() => deleteProduct(item)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPanel>

                {/* Orders Tab Panel */}
                <TabPanel>
                    <div className={`${themeColors.bg} rounded-2xl shadow-sm border ${themeColors.border} overflow-hidden`}>
                        <div className={`${themeColors.border} border-b px-6 py-5`}>
                            <h2 className={`text-xl font-bold ${themeColors.text}`}>Order Details</h2>
                            <p className={`text-sm mt-1 ${themeColors.mutedText}`}>View and manage customer orders</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`text-sm uppercase font-semibold tracking-wider ${themeColors.headerBg} ${themeColors.mutedText}`}>
                                    <tr>
                                        <th className="px-6 py-4">S.No</th>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Customer Info</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${themeColors.border}`}>
                                    {order.map((allorder, index) => (
                                        <tr key={index} className={`hover:${mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors`}>
                                            <td className={`px-6 py-4 ${themeColors.text} font-medium`}>{index + 1}</td>
                                            <td className={`px-6 py-4 ${themeColors.text} font-medium`}>{allorder.paymentId || allorder.payMantId || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-3">
                                                    {allorder.cartItems.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="flex gap-3 items-center">
                                                            <img 
                                                                className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200" 
                                                                src={item.imageUrl} 
                                                                alt={item.title} 
                                                            />
                                                            <div>
                                                                <p className={`font-semibold ${themeColors.text} text-sm line-clamp-1`}>{item.title}</p>
                                                                <div className="flex gap-2 items-center mt-1">
                                                                    <p className={`text-xs font-medium text-green-600`}>₹{item.price}</p>
                                                                    <p className={`text-xs ${themeColors.mutedText}`}>Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${themeColors.mutedText}`}>
                                                <p className={`font-semibold ${themeColors.text}`}>{allorder.addressInfo.name}</p>
                                                <p className="mt-1">{allorder.addressInfo.pincode}</p>
                                                <p>{allorder.addressInfo.date}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mode === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                                    {allorder.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => deleteOrder(allorder)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPanel>

                {/* Users Tab Panel */}
                <TabPanel>
                    <div className={`${themeColors.bg} rounded-2xl shadow-sm border ${themeColors.border} overflow-hidden`}>
                        <div className={`${themeColors.border} border-b px-6 py-5`}>
                            <h2 className={`text-xl font-bold ${themeColors.text}`}>User Details</h2>
                            <p className={`text-sm mt-1 ${themeColors.mutedText}`}>A list of all registered users</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`text-sm uppercase font-semibold tracking-wider ${themeColors.headerBg} ${themeColors.mutedText}`}>
                                    <tr>
                                        <th className="px-6 py-4">S.No</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">UID</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${themeColors.border}`}>
                                    {user.map((item, index) => (
                                        <tr key={index} className={`hover:${mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors`}>
                                            <td className={`px-6 py-4 ${themeColors.text}`}>{index + 1}</td>
                                            <td className={`px-6 py-4 font-semibold ${themeColors.text}`}>{item.name}</td>
                                            <td className={`px-6 py-4 ${themeColors.mutedText}`}>{item.email}</td>
                                            <td className={`px-6 py-4 font-mono text-xs ${themeColors.mutedText}`}>{item.uid}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    item.role === 'admin' 
                                                    ? (mode === 'dark' ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700')
                                                    : (mode === 'dark' ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-700')
                                                }`}>
                                                    {item.role || 'user'}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 ${themeColors.mutedText}`}>{item.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default DashboardTab;
