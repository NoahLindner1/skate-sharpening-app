import { useEffect, useState } from "react";
import { getCustomersByStore } from "../firebase/customers";
import { useAuth } from "../context/AuthContext";

const useCustomers = () => {
  const { store } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!store) return;

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomersByStore(store);
        setCustomers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [store]);

  return {
    customers,
    setCustomers,
    loading,
    error
  };
};

export default useCustomers;
