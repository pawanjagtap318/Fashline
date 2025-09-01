import { useEffect, useState } from 'react'
import { addUser, deleteUser, fetchUsers, updateUser } from '../../redux/slices/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";

function UserManagement() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { users, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(fetchUsers());
        }
    }, [dispatch, user]);

    const [formData, setFormData] = useState({
        name: "",
        email: '',
        password: "",
        role: "customer",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUser(formData));

        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer",
        });
    };

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, role: newRole }));
    };

    const handleDeletedUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId));
        };
    };

    const exportToExcel = () => {
        const formattedData = users.map(u => ({
            UserID: u._id,
            Name: u.name,
            Email: u.email,
            Role: u.role,
            CreatedAt: new Date(u.createdAt).toLocaleString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "users_data.xlsx");
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-800">
                    👥 User Management
                </h2>
                <button
                    onClick={exportToExcel}
                    className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                    📥 Export Excel
                </button>
            </div>

            {loading && <p className="text-blue-600">Loading users...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {/* Add User Form */}
            <div className="p-6 rounded-xl mb-8 bg-white shadow-lg border">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    ➕ Add New User
                </h3>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring focus:ring-green-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-white focus:ring focus:ring-green-200"
                            required
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition shadow"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl border">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((u, idx) => (
                                <tr
                                    key={u._id}
                                    className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-gray-100 transition`}
                                >
                                    <td className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                        {u.name}
                                    </td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="p-2 border rounded bg-white focus:ring focus:ring-green-200"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDeletedUser(u._id)}
                                            className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition shadow text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center p-6 text-gray-500 italic"
                                >
                                    No users found 🚫
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement
