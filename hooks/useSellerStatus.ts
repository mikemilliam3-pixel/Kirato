import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export type SellerStatus = 'none' | 'pending' | 'approved' | 'rejected';

export const useSellerStatus = () => {
  const { isLoggedIn, user } = useApp();
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setSellerStatus('none');
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSellerStatus(data.sellerStatus || 'none');
      } else {
        setSellerStatus('none');
      }
      setLoading(false);
    }, (error) => {
      console.warn("Seller status fetch error:", error.message);
      setLoading(false);
    });

    return () => unsub();
  }, [isLoggedIn, user]);

  return { sellerStatus, loading };
};