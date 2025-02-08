"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Swal from "sweetalert2";
import ProRoute from "@/app/components/ProRoute";


interface Order {
  Status: string | number | readonly string[] | undefined;
  _id: string;
  name: string;
  phone: number;
  email: string;
  address: string;
  city: string;
  cartItems: Item[];
  total: number;
  status: string;
}

interface Item {
  productName: string;
  
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((order: { _id: string; name: string; phone: number; email: string; address: string; items: string[]; totalPriceWithVat: string; status: string }) => ({
          _id: order._id,
          name: order.name,
          phone: order.phone,
          email: order.email,
          address: order.address,
          total: order.totalPriceWithVat,
          status: order.status, // ✅ Directly assign status as a string
        }));
        
        setOrders(formattedData);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders = orders.filter((order) =>
    filter === "All"
      ? true
      : order.status && order.status.toLowerCase() === filter.toLowerCase()
  );
  
  

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const order = await client.getDocument(orderId);
      if (!order) {
        Swal.fire("Error!", "Order not found!", "error");
        return;
      }
  
      await client.patch(orderId).set({ status: newStatus }).commit();
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
  
      Swal.fire("Success!", `Order moved to ${newStatus}.`, "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Something went wrong while updating the status.", "error");
    }
  };
  
  
  

  return (
    <ProRoute>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
        {/* Sidebar Toggle Button (Mobile) */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:relative inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
          <div className="flex flex-col space-y-3">
            {["All", "Pending", "Dispatch", "Success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? "bg-white text-blue-600 font-bold"
                    : "text-white hover:bg-blue-500"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="mt-60 px-4 py-2 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all w-full"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              window.location.href = "/admin"; // Redirect to login page
            }}
          >
            Logout
          </button>
        </aside>

        {/* Main Content - Orders */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Orders
          </h2>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg font-semibold">
                No orders in {filter.toLowerCase()}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
                <thead className="bg-blue-50 font-bold text-left text-blue-700">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Address</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr
                        className="cursor-pointer hover:bg-blue-50 transition-all"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <td className="px-6 py-4 text-gray-700">{order._id}</td>
                        <td className="px-6 py-4 text-gray-700">{order.name}</td>
                        <td className="px-6 py-4 text-gray-700 hidden lg:table-cell">
                          {order.address}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700">${order.total}</td>
                        <td className="px-6 py-4">
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-gray-600 p-1 rounded text-center text-white"
                        >
                           <option value="Pending">Pending</option>
                            <option value="Dispatch">Dispatch</option>
                           <option value="Success">Completed</option>
                        </select>

                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order._id);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {selectedOrderId === order._id && (
                        <tr>
                          <td colSpan={7} className="bg-blue-50 p-6 transition-all animate-fadeIn">
                            <h3 className="font-bold text-blue-700 mb-4">Order Details</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-600">
                                  <strong>Phone:</strong> {order.phone}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Email:</strong> {order.email}
                                </p>
                                <p className="text-gray-600">
                                  <strong>City:</strong> {order.city}
                                </p>
                              </div>
                             
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </ProRoute>
  );
}