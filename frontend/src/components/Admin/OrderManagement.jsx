import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

function OrderManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>
  if (error) return <p className="text-center text-red-500">Error: {error}</p>


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">📦 Order Management</h2>
        <NavLink
          to="/admin/totalOrders"
          className="text-blue-600 hover:underline font-medium"
        >
          View Orders Charts →
        </NavLink>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                >
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-4 font-medium text-green-600">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4">
                    <select
                      value={order.status}
                      disabled={order.status === "Delivered" || order.status === "Cancelled"}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className={`
                        px-4 py-2 rounded-lg font-medium text-sm transition 
                        ${order.status === "Delivered" || order.status === "Cancelled"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"}
                      `}
                      disabled={order.status === "Delivered" || order.status === "Cancelled"}
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No Orders Found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderManagement
