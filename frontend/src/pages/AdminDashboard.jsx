import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast, Spinner } from "@chakra-ui/react";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(null);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setIsUpdatingRole(userId);
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);

      toast({
        title: "Role updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to update role", err);
      toast({
        title: "Error updating role",
        description: err.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh list
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);

      toast({
        title: "User deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to delete user", err);
      toast({
        title: "Error deleting user",
        description: err.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (userId) => {
    toast({
      position: "top",
      duration: null, // Persistent until closed
      render: () => (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="font-bold mb-2">Confirm Deletion</p>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => {
                toast.closeAll();
                handleDeleteUser(userId);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => toast.closeAll()}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        toast({
          title: "Error loading users",
          description: err.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (user?.role === "admin" || user?.role === "superadmin") {
      fetchUsers();
    }
  }, [user, token, toast]);

  if (isLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="orange.400"
        size="xl"
      />
    );
  }

  useEffect(() => {
    const query = search.toLowerCase();
    const results = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
    setFilteredUsers(results);
  }, [search, users]);

  if (!(user?.role === "admin" || user?.role === "superadmin")) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg font-semibold">
        Access Denied: Admins only.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-400">
        Admin Dashboard
      </h1>
      <div className="flex justify-center md:justify-end mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded shadow-sm w-full max-w-md"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-2 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 rounded">#</th>
                <th className="border border-gray-300 p-2 rounded">Name</th>
                <th className="border border-gray-300 p-2 rounded hidden md:table-cell">
                  Email
                </th>
                <th className="border border-gray-300 p-2 rounded">Role</th>
                {user.role === "superadmin" && (
                  <th className="border border-gray-300 p-2 rounded">✂️</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u._id}>
                  <td className="border border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 text-center break-words">
                    <Link
                      to={`/user-books/${u._id}`}
                      className=" hover:underline"
                    >
                      {u.name}
                    </Link>
                    {u.role === "superadmin" && (
                      <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                        SUPER
                      </span>
                    )}
                    {u.role === "admin" && (
                      <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                        ADMIN
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 text-center hidden md:table-cell break-words">
                    {u.email}
                  </td>
                  <td className="border border-gray-300 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                      disabled={
                        isUpdatingRole === u._id ||
                        (user.role === "admin" && u.role === "superadmin")
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      {user.role === "superadmin" && (
                        <option value="superadmin">Superadmin</option>
                      )}
                    </select>
                  </td>

                  {user.role === "superadmin" && u._id !== user._id && (
                    <td className="border border-gray-300 text-center">
                      <button
                        onClick={() => confirmDelete(u._id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
