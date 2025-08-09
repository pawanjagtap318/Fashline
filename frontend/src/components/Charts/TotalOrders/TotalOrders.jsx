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
  const pieData = totalCount === 0
    ? [{ name: "No Data", count: 1 }]
    : data;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-lg font-semibold text-gray-600">
        Loading Orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-lg font-semibold text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          📊 Orders Status
        </h2>
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="year-select" style={{ marginRight: '10px' }}>Select Year:</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1em'
              }}
            >
              {[2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full h-[400px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                // label
                animationBegin={200}
                animationDuration={1000}
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
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
                  borderRadius: "8px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default TotalOrders;
