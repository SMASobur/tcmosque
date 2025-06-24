import { useProductStore } from "../store/book";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BookDetailsModal from "../components/modals/BookDetailsModal";
import BookEditModal from "../components/modals/BookEditModal";
import BookDeleteModal from "../components/modals/BookDeleteModal";
import BookCreateModal from "../components/modals/BookCreateModal";
import { Button, Text, Spinner, useColorModeValue } from "@chakra-ui/react";
import { generateBooksPDF } from "../utils/pdfGenerator";
import axios from "axios";
import { Link } from "react-router-dom";

import { ArrowForwardIcon } from "@chakra-ui/icons";

const UserBooks = () => {
  const { fetchProducts, products } = useProductStore();
  const { userId } = useParams();
  const { user, token } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchProducts();

        // If no userId provided, show current user's books
        if (!userId) {
          setTargetUser(user);
        }
        // If userId provided and current user is admin or superadmin, fetch that user
        else if (user?.role === "admin" || user?.role === "superadmin") {
          const res = await axios.get(`/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const found = res.data.find((u) => u._id === userId);
          setTargetUser(found || user);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchProducts, userId, user, token]);

  const userBooks = isLoading
    ? []
    : products.filter(
        (book) => book.createdBy?.id === (userId ? targetUser?._id : user?._id)
      );

  const filteredBooks = userBooks.filter((book) => {
    const term = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      String(book.publishYear).includes(term) ||
      String(book.price).includes(term)
    );
  });

  const totalPrice = filteredBooks.reduce(
    (sum, book) => sum + parseFloat(book.price || 0),
    0
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!targetUser && userId) {
    return (
      <div className="text-center mt-10 text-gray-500 text-lg">
        User not found
      </div>
    );
  }

  const displayUser = targetUser || user;

  return (
    <div className="w-full max-w-7xl mx-auto px-2">
      <div className="p-2">
        {user && (
          <div className="text-center mt-6 px-4">
            <Link to="/books" className="inline-block">
              <Button
                colorScheme="blue"
                variant="outline"
                size="md"
                rightIcon={<ArrowForwardIcon />}
                className="hover:shadow-md transition-all duration-200"
              >
                View the List from all users
              </Button>
            </Link>
          </div>
        )}
        <div className="flex justify-between px-4 items-center mb-4">
          <Text
            fontSize="30"
            fontWeight="bold"
            bgColor="orange.400"
            bgClip="text"
          >
            {displayUser?.name}'s {userBooks.length <= 1 ? "Book" : "Books"}{" "}
            List
          </Text>
          {user && <BookCreateModal />}
        </div>

        {userBooks.length > 0 ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-4 gap-4">
              <div className="flex items-center w-full md:w-auto">
                <label className="mr-2 font-medium whitespace-nowrap">
                  Books per page:
                </label>
                <select
                  value={booksPerPage}
                  onChange={(e) => {
                    setBooksPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none border border-gray-300 rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="w-full md:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search books..."
                  className="border border-gray-300 px-3 py-1 rounded w-full"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-2 p-2">
                <thead>
                  <tr>
                    <th className="border-2 border-slate-400 rounded-md">
                      No.
                    </th>
                    <th className="border-2 border-slate-400 rounded-md">
                      Title
                    </th>
                    <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                      Author
                    </th>
                    <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                      Publish Year
                    </th>
                    <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                      Price
                    </th>
                    <th className="border-2 border-slate-400 rounded-md">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book, index) => (
                    <tr key={book._id}>
                      <td className="border border-slate-400 text-center">
                        {(currentPage - 1) * booksPerPage + index + 1}
                      </td>
                      <td className="border border-slate-400 text-center">
                        {book.title}
                      </td>
                      <td className="border border-slate-400 text-center max-md:hidden">
                        {book.author}
                      </td>
                      <td className="border border-slate-400 text-center max-md:hidden">
                        {book.publishYear}
                      </td>
                      <td className="border border-slate-400 text-center max-md:hidden">
                        {book.price}
                      </td>
                      <td className="border border-slate-400 text-center">
                        <div className="flex justify-center gap-x-2">
                          <BookDetailsModal book={book} />
                          {["admin", "user", "superadmin"].includes(
                            user?.role
                          ) && (
                            <>
                              <BookEditModal book={book} />
                              <BookDeleteModal book={book} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="md:hidden">
                    <td colSpan={6} className="pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          Total: ৳ {totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hidden md:table-row">
                    <td
                      colSpan={4}
                      className="text-right font-bold border-none"
                    >
                      Total
                    </td>
                    <td
                      className="text-center font-bold border-none"
                      colSpan={1}
                    >
                      ৳ {totalPrice.toFixed(2)}
                    </td>
                    <td className="border-none"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="md:hidden flex justify-center gap-2 mt-4 mb-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                ⏪︎
              </button>
              <span className="font-semibold">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                ⏩︎
              </button>
              <div className="w-full overflow-x-auto px-4">
                <div className="flex justify-center md:justify-end">
                  <Button
                    onClick={() =>
                      generateBooksPDF(displayUser?.name || "User", userBooks)
                    }
                    colorScheme="orange"
                    variant="outline"
                    isDisabled={userBooks.length === 0}
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    📥 Download as PDF
                  </Button>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-row items-center justify-between gap-4 mt-4 mb-4 px-6">
              <div className="flex items-center justify-center gap-2">
                {totalPages > 3 && (
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    ⏮
                  </button>
                )}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  ⏪︎
                </button>
                <span className="font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  ⏩︎
                </button>
                {totalPages > 3 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    ⏭
                  </button>
                )}
              </div>

              <div className="w-full overflow-x-auto px-4">
                <div className="flex justify-center md:justify-end">
                  <Button
                    onClick={() =>
                      generateBooksPDF(displayUser?.name || "User", userBooks)
                    }
                    colorScheme="orange"
                    variant="outline"
                    isDisabled={userBooks.length === 0}
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    📥 Download as PDF
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center mt-4">
            <p text={useColorModeValue("gray.300", "gray.700")}>
              No books created yet.
            </p>
            {userId && (user?.role === "admin" || user.role === "superadmin") && (
              <Link
                to="/my-books"
                className="text-blue-400 underline hover:text-blue-800 mt-2 inline-block"
              >
                View your own books
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBooks;
