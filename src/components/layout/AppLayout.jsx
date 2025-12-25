import TopBanner from "./TopBanner";
import { useState } from "react";
import AddCustomerModal from "../customers/AddCustomerModal";

const AppLayout = ({ children }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  return (
    <>
      <TopBanner onAddCustomer={() => setShowAddCustomer(true)} />
      <main>{children}</main>

      {showAddCustomer && (
        <AddCustomerModal onClose={() => setShowAddCustomer(false)} />
      )}
    </>
  );
};

export default AppLayout;
