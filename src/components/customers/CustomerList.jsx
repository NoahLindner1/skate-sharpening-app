import { useNavigate } from "react-router-dom";

const CustomerList = ({ customers }) => {
  const navigate = useNavigate();

  if (customers.length === 0) {
    return <p>No customers yet.</p>;
  }

  return (
    <table width="100%" cellPadding="12">
      <thead>
        <tr>
          <th align="left">Name</th>
          <th align="left">Remaining</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr
            key={customer.id}
            onClick={() => navigate(`/customer/${customer.id}`)}
            style={{ cursor: "pointer" }}
          >
            <td>{customer.name}</td>
            <td>{customer.remaining}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomerList;
