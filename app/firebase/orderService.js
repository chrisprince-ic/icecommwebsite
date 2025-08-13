import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Save order to Firebase
export const saveOrderToFirebase = async (orderData) => {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date(),
      status: 'pending',
      orderNumber: generateOrderNumber()
    });
    
    return {
      success: true,
      orderId: orderRef.id,
      orderNumber: orderData.orderNumber
    };
  } catch (error) {
    console.error('Error saving order to Firebase:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId) => {
  try {
    // First try with ordering
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return {
        success: true,
        orders
      };
    } catch (indexError) {
      // If index doesn't exist, fall back to query without ordering
      console.warn('Composite index not found, falling back to simple query:', indexError.message);
      
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort manually in JavaScript
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      return {
        success: true,
        orders
      };
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      error: error.message,
      orders: []
    };
  }
};

// Get all orders (for admin)
export const getAllOrders = async () => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      orders
    };
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return {
      success: false,
      error: error.message,
      orders: []
    };
  }
};

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
