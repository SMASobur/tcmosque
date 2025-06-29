import { create } from "zustand";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const useSchoolStore = create((set) => ({
  donors: [],
  donations: [],
  expenses: [],
  expenseCategories: [],

  setDonors: (donors) => set({ donors }),
  setExpenseCategories: (expenseCategories) => set({ expenseCategories }),
  setDonations: (donations) => set({ donations }),
  setExpenses: (expenses) => set({ expenses }),

  fetchAllSchoolData: async () => {
    try {
      const res = await fetch("/api/school");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log("Fetched categories:", data.expenseCategories);

      set({
        donors: (data.donors || []).map((d) => ({
          ...d,
          id: d._id || d.id,
        })),
        donations: (data.donations || []).map((d) => ({
          ...d,
          id: d._id || d.id,
        })),
        expenses: (data.expenses || []).map((e) => ({
          ...e,
          id: e._id || e.id,
        })),
        expenseCategories: (data.expenseCategories || []).map((c) => ({
          ...c,
          id: c._id || c.id,
        })),
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to fetch school data:", error);
      return { success: false, message: "Error loading data" };
    }
  },

  createDonor: async (name, user, token) => {
    try {
      const res = await fetch("/api/school/donors", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          name,
          createdBy: {
            id: user?.id,
            name: user?.name,
          },
        }),
      });

      const data = await res.json();
      console.log("API Response:", data); // Add this for debugging

      if (!res.ok) {
        console.error("API Error:", data);
        return {
          success: false,
          message: data.message || "Error creating donor",
        };
      }

      // Ensure the response contains data.data with _id
      const donor = {
        ...data.data,
        id: data.data._id || data.data.id,
      };

      set((state) => ({ donors: [...state.donors, donor] }));
      return { success: true, data: donor };
    } catch (error) {
      console.error("Network Error:", error);
      return { success: false, message: "Network error creating donor" };
    }
  },
  updateDonor: async (id, data, token) => {
    try {
      const response = await fetch(`/api/school/donors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  createDonation: async (donation, token) => {
    try {
      const res = await fetch("/api/school/donations", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(donation),
      });

      const data = await res.json();
      console.log("Donation Response:", data); // Debugging

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Error creating donation",
        };
      }

      // Handle response more safely
      const newDonation = {
        ...data.data,
        id: data.data?.id || data.data?._id, // Safe property access
      };

      if (!newDonation.id) {
        throw new Error("Donation ID missing in response");
      }

      set((state) => ({
        donations: [...state.donations, newDonation],
      }));

      return { success: true, data: newDonation };
    } catch (error) {
      console.error("Error creating donation:", error);
      return {
        success: false,
        message: error.message || "Error creating donation",
      };
    }
  },

  createExpense: async (expense, token) => {
    try {
      const res = await fetch("/api/school/expenses", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(expense),
        // body: JSON.stringify({
        //   description: expense.description,
        //   amount: expense.amount,
        //   date: expense.date,
        //   category: expense.category,
        //   createdBy: expense.createdBy,
        // }),
      });

      const data = await res.json();
      console.log("Expense Response:", data);

      if (!res.ok) return { success: false, message: data.message };

      const newExpense = {
        ...data.data,
        id: data.data._id || data.data.id,
      };

      set((state) => ({
        expenses: [...state.expenses, newExpense],
      }));

      return { success: true, data: newExpense };
    } catch (error) {
      console.error("Error creating expense:", error);
      return { success: false, message: "Error creating expense" };
    }
  },

  updateExpense: async (id, data, token) => {
    try {
      const response = await fetch(`/api/school/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  createCategory: async (name, user, token) => {
    try {
      const res = await fetch("/api/school/expense-categories", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          name,
          createdBy: {
            id: user?.id,
            name: user?.name,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Error creating category",
        };
      }

      return {
        success: true,
        data: {
          ...data.data,
          id: data.data._id || data.data.id,
        },
      };
    } catch (error) {
      console.error("Error creating category:", error);
      return { success: false, message: "Network error creating category" };
    }
  },

  deleteExpense: async (expenseId, token) => {
    try {
      const res = await fetch(`/api/school/expenses/${expenseId}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== expenseId),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting expense:", error);
      return { success: false, message: "Error deleting expense" };
    }
  },
  deleteDonor: async (donorId, token) => {
    try {
      const res = await fetch(`/api/school/donors/${donorId}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      set((state) => ({
        donors: state.donors.filter((d) => d.id !== donorId),
        donations: state.donations.filter((d) => d.donorId !== donorId),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting donor:", error);
      return { success: false, message: "Error deleting donor" };
    }
  },

  deleteDonation: async (donationId, token) => {
    try {
      const res = await fetch(`/api/school/donations/${donationId}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      set((state) => ({
        donations: state.donations.filter((d) => d.id !== donationId),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting donation:", error);
      return { success: false, message: "Error deleting donation" };
    }
  },
  deleteCategory: async (categoryId, token) => {
    try {
      const res = await fetch(`/api/school/expense-categories/${categoryId}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, message: data.message };

      set((state) => ({
        expenseCategories: state.expenseCategories.filter(
          (c) => c.id !== categoryId
        ),
        expenses: state.expenses.filter(
          (e) => e.category !== categoryId && e.category?._id !== categoryId
        ),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, message: "Error deleting category" };
    }
  },
}));
