import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MyContext from './myContext'
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../firebase/FirebaseConfig';

const INITIAL_PRODUCT_STATE = {
  title: null,
  price: null,
  imageUrl: null,
  images: [],
  category: null,
  description: null,
  type: '',
  sizes: [],
  colors: [],
};

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function MyState(props) {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'dark') {
      document.body.style.backgroundColor = 'rgb(15, 23, 42)';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
    }

    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  const [products, setProducts] = useState(INITIAL_PRODUCT_STATE)
  const [product, setProduct] = useState([]);

  const addProduct = async () => {
    if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
      toast.error('Please fill all fields', { autoClose: 5000 });
      return false;
    }

    const duplicate = product.find((p) =>
      p?.title?.toLowerCase().trim() === products?.title?.toLowerCase().trim() &&
      p?.category?.toLowerCase().trim() === products?.category?.toLowerCase().trim()
    );
    if (duplicate) {
      toast.error('Product already exists with this title and category!', {
        position: 'top-center',
        autoClose: 3000,
      });
      return false;
    }

    const productRef = collection(fireDB, 'products')
    setLoading(true)
    try {
      await addDoc(productRef, products)
      toast.success('Product added successfully! 🎉', {
        position: 'top-center',
        autoClose: 3000,
      })

      setLoading(false)
      setProducts({
        ...INITIAL_PRODUCT_STATE,
        time: Timestamp.now(),
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })
      })
      return true;
    } catch (error) {
      toast.error('Failed to add product: ' + error.message, {
        position: 'top-center',
        autoClose: 10000,
      })
      setLoading(false)
      return false;
    }
  }

  const getProductData = () => {
    setLoading(true)
    try {
      const q = query(collection(fireDB, 'products'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productsArray = [];
        querySnapshot.forEach((snapshotDoc) => {
          productsArray.push({ ...snapshotDoc.data(), id: snapshotDoc.id });
        });
        setProduct(productsArray)
        setLoading(false);
      }, (error) => {
        toast.error('Failed to load products: ' + error.message)
        setLoading(false)
      });

      return unsubscribe;
    } catch (error) {
      toast.error('Failed to load products: ' + error.message)
      setLoading(false)
      return null;
    }
  }

  const edithandle = (item) => {
    setProducts({
      ...item,
      sizes: item.sizes || [],
      colors: item.colors || []
    });
  }

  const updateProduct = async () => {
    setLoading(true)
    try {
      await setDoc(doc(fireDB, 'products', products.id), products);
      toast.success('Product updated successfully');
      setLoading(false)
      setProducts(INITIAL_PRODUCT_STATE)
      return true;
    } catch (error) {
      toast.error('Failed to update product')
      setLoading(false)
      return false;
    }
  }

  const deleteProduct = async (item) => {
    try {
      setLoading(true)
      await deleteDoc(doc(fireDB, 'products', item.id));
      toast.success('Product deleted successfully')
      setLoading(false)
    } catch (error) {
      toast.error('Failed to delete product')
      setLoading(false)
    }
  }

  const [order, setOrder] = useState([]);

  const getOrderData = async () => {
    setLoading(true)
    try {
      const result = await getDocs(collection(fireDB, 'orders'))
      const ordersArray = [];
      result.forEach((snapshotDoc) => {
        ordersArray.push({ ...snapshotDoc.data(), id: snapshotDoc.id });
      });
      setOrder(ordersArray);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
      setLoading(false)
    }
  }

  const deleteOrder = async (item) => {
    if (!item?.id) {
      toast.error('Unable to delete order: missing id');
      return;
    }

    try {
      setLoading(true)
      await deleteDoc(doc(fireDB, 'orders', item.id));
      setOrder((prev) => prev.filter((orderItem) => orderItem.id !== item.id));
      toast.success('Order deleted successfully')
      setLoading(false)
    } catch (error) {
      toast.error('Failed to delete order')
      setLoading(false)
    }
  }

  const [user, setUser] = useState([]);

  const getUserData = async () => {
    setLoading(true)
    try {
      const result = await getDocs(collection(fireDB, 'users'))
      const usersArray = [];
      result.forEach((snapshotDoc) => {
        usersArray.push({ ...snapshotDoc.data(), id: snapshotDoc.id });
      });
      setUser(usersArray);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load users');
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = getProductData();
    const localUser = parseStoredUser();
    const isAdmin = localUser?.profile?.role === 'admin';

    if (isAdmin) {
      getOrderData();
      getUserData();
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const [wishlist, setWishlist] = useState([]);

  const getWishlistData = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const q = query(
        collection(fireDB, 'wishlist'),
        where('userId', '==', userId)
      );
      const result = await getDocs(q);
      const wishlistArray = [];
      result.forEach((snapshotDoc) => {
        wishlistArray.push({ ...snapshotDoc.data(), id: snapshotDoc.id });
      });
      setWishlist(wishlistArray);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load wishlist');
      setLoading(false);
    }
  };

  const addToWishlistBackend = async (wishlistProduct, userId) => {
    setLoading(true);
    try {
      const existingQuery = query(
        collection(fireDB, 'wishlist'),
        where('userId', '==', userId),
        where('productId', '==', wishlistProduct.id)
      );

      const result = await getDocs(existingQuery);
      const exists = !result.empty;

      if (!exists) {
        await addDoc(collection(fireDB, 'wishlist'), {
          userId,
          productId: wishlistProduct.id,
          product: wishlistProduct,
          time: Timestamp.now(),
          date: new Date().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })
        });
        toast.success('Added to wishlist ❤️');
        getWishlistData(userId);
      } else {
        toast.info('Already in wishlist');
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to add to wishlist');
      setLoading(false);
    }
  };

  const removeFromWishlistBackend = async (wishlistItemId, userId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, 'wishlist', wishlistItemId));
      toast.info('Removed from wishlist');
      getWishlistData(userId);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      setLoading(false);
    }
  };

  const [searchkey, setSearchkey] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')
  const [filterSize, setFilterSize] = useState([])
  const [filterColor, setFilterColor] = useState([])

  return (
    <MyContext.Provider value={{
      mode, toggleMode, loading, setLoading,
      products, setProducts, addProduct, product,
        edithandle, updateProduct, deleteProduct, order, deleteOrder, getOrderData, getUserData,
      user, searchkey, setSearchkey, filterType, setFilterType,
      filterPrice, setFilterPrice, filterSize, setFilterSize, filterColor, setFilterColor,
      wishlist, getWishlistData, addToWishlistBackend, removeFromWishlistBackend
    }}>
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState

MyState.propTypes = {
  children: PropTypes.node.isRequired,
};