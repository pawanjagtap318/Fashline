import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../../redux/slices/adminOrderSlice";

const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF4444"];
const DEFAULT_COLOR = "#d1d5db";

function TotalOrders() {
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const getStatusData = (orders) => {
    const statusCounts = {
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      const date = new Date(order.deliveredAt || order.createdAt);
      const year = date.getFullYear();

      if (year == selectedYear) {
        if (statusCounts[order.status] !== undefined) {
          statusCounts[order.status]++;
        }
      }
    });

    return Object.keys(statusCounts).map((status) => ({
      name: status,
      count: statusCounts[status],
    }));
  };

  const data = getStatusData(orders);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const pieData = totalCount === 0 ? [{ name: "No Data", count: 1 }] : data;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-lg font-semibold text-gray-600 animate-pulse">
        Loading Orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-lg font-semibold text-red-600">
        ❌ Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 shadow-2xl rounded-2xl p-6 w-full max-w-5xl transition-transform transform hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-black mb-6 tracking-wide">
          📊 Orders Status Overview
        </h2>

        {/* Year Selector */}
        <div className="flex justify-center mb-6">
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-700 font-medium"
          >
            {[2024, 2025, 2026, 2027, 2028].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Pie Chart */}
        <div className="w-full h-[400px] flex items-center justify-center">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                animationBegin={200}
                animationDuration={1200}
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      totalCount !== 0
                        ? COLORS[index % COLORS.length]
                        : DEFAULT_COLOR
                    }
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={40} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {totalCount === 0 && (
          <p className="text-center text-gray-500 font-medium mt-4">
            📉 No order data available for {selectedYear}.
          </p>
        )}
      </div>
    </div>
  );
}

export default TotalOrders;
