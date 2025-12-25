import { useState } from "react";
import useCustomers from "../hooks/useCustomers";
import SearchBar from "../components/customers/SearchBar";
import CustomerList from "../components/customers/CustomerList";

const Home = () => {
  const { customers, loading, error } = useCustomers();
  const [search, setSearch] = useState("");

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>{error}</p>;

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 16 }}>
      <SearchBar value={search} onChange={setSearch} />
      <CustomerList customers={filteredCustomers} />
    </div>
  );
};

export default Home;
