import axios from 'axios';

// 1. Define the base URL using the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Create a single, configured axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Add an interceptor to automatically attach the auth token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 4. A single, consistent error handler
const handleError = (error, context) => {
    const errMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected API error occurred';
    console.error(`API Error on ${context}:`, errMsg);
    throw new Error(errMsg);
};


// 5. Export your complete, upgraded apiService object
export const apiService = {
    // ===================================
    // ## Auth Services
    // ===================================
    
    // ✅ UPDATED: Login now sends the messName
    async login(credentials) {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            handleError(error, 'POST /auth/login');
        }
    },

    // ✅ NEW: Function to register a manager
    async registerManager(userData) {
        try {
            const response = await axiosInstance.post('/auth/register/manager', userData);
            return response.data;
        } catch (error) {
            handleError(error, 'POST /auth/register/manager');
        }
    },

    // ✅ NEW: Function to register a member
    async registerMember(userData) {
        try {
            const response = await axiosInstance.post('/auth/register/member', userData);
            return response.data;
        } catch (error) {
            handleError(error, 'POST /auth/register/member');
        }
    },

    async getProfile() {
        try {
            const response = await axiosInstance.get('/auth/profile');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /auth/profile');
        }
    },
    async editProfile(profileData) {
        try {
            const response = await axiosInstance.put('/auth/profile', profileData);
            return response.data;
        } catch (error) {
            handleError(error, 'PUT /auth/profile');
        }
    },

    // ===================================
    // ## User Management Services
    // ===================================
    async getAllUsers() {
        try {
            const response = await axiosInstance.get('/users');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /users');
        }
    },
    async updateUserRole(userId, role) {
        try {
            const response = await axiosInstance.put(`/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            handleError(error, `PUT /users/${userId}/role`);
        }
    },

    // ===================================
    // ## Meal Services
    // ===================================
    async addMeal(mealData) {
        try {
            const response = await axiosInstance.post('/meals', mealData);
            return response.data;
        } catch (error) {
            handleError(error, 'POST /meals');
        }
    },
    async getAllMeals() {
        try {
            const response = await axiosInstance.get('/meals/all');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /meals/all');
        }
    },
    async updateMeal(mealId, mealData) {
        try {
            const response = await axiosInstance.put(`/meals/${mealId}`, mealData);
            return response.data;
        } catch (error) {
            handleError(error, `PUT /meals/${mealId}`);
        }
    },
    async deleteMeal(mealId) {
        try {
            const response = await axiosInstance.delete(`/meals/${mealId}`);
            return response.data;
        } catch (error) {
            handleError(error, `DELETE /meals/${mealId}`);
        }
    },
    async saveDailyMeals(data) {
        try {
            const response = await axiosInstance.post('/meals/daily-entry', data);
            return response.data;
        } catch (error) {
            handleError(error, 'POST /meals/daily-entry');
        }
    },
    async updateUserMeals(userId, newTotalMeals) {
        try {
            const response = await axiosInstance.put('/meals/user-meals', { userId, newTotalMeals });
            return response.data;
        } catch (error) {
            handleError(error, 'PUT /meals/user-meals');
        }
    },

    // ===================================
    // ## Expense Services
    // ===================================
    async addExpense(expenseData) {
        try {
            const response = await axiosInstance.post('/expenses', expenseData);
            return response.data;
        } catch (error) {
            handleError(error, 'POST /expenses');
        }
    },
    async getExpenses() {
        try {
            const response = await axiosInstance.get('/expenses');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /expenses');
        }
    },
    async updateExpense(expenseId, expenseData) {
        try {
            const response = await axiosInstance.put(`/expenses/${expenseId}`, expenseData);
            return response.data;
        } catch (error) {
            handleError(error, `PUT /expenses/${expenseId}`);
        }
    },
    async deleteExpense(expenseId) {
        try {
            const response = await axiosInstance.delete(`/expenses/${expenseId}`);
            return response.data;
        } catch (error) {
            handleError(error, `DELETE /expenses/${expenseId}`);
        }
    },

    // ===================================
    // ## Bazar Schedule Services
    // ===================================
    async createSchedule(scheduleData) {
        try {
            const response = await axiosInstance.post('/schedule', scheduleData);
            return response.data;
        } catch (error) {
            handleError(error, 'POST /schedule');
        }
    },
    async getSchedule() {
        try {
            const response = await axiosInstance.get('/schedule');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /schedule');
        }
    },
    async updateSchedule(scheduleId, scheduleData) {
        try {
            const response = await axiosInstance.put(`/schedule/${scheduleId}`, scheduleData);
            return response.data;
        } catch (error) {
            handleError(error, `PUT /schedule/${scheduleId}`);
        }
    },
    async deleteSchedule(scheduleId) {
        try {
            const response = await axiosInstance.delete(`/schedule/${scheduleId}`);
            return response.data;
        } catch (error) {
            handleError(error, `DELETE /schedule/${scheduleId}`);
        }
    },
    async getUpcomingSchedule() {
        try {
            const response = await axiosInstance.get('/schedule/upcoming');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /schedule/upcoming');
        }
    },

    // ===================================
    // ## Notices Services
    // ===================================

    // ✅ NEW: Add these two functions for the notice board
    async getNotices() {
        try {
            const response = await axiosInstance.get('/notices');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /notices');
        }
    },
    async postNotice(content) {
        try {
            const response = await axiosInstance.post('/notices', { content });
            return response.data;
        } catch (error) {
            handleError(error, 'POST /notices');
        }
    },

    // ===================================
    // ## Settlement Services
    // ===================================
    async getSettlement() {
        try {
            const response = await axiosInstance.get('/settlement');
            return response.data;
        } catch (error) {
            handleError(error, 'GET /settlement');
        }
    },
    async startNewMonth() {
        try {
            const response = await axiosInstance.delete('/settlement/new-month');
            return response.data;
        } catch (error) {
            handleError(error, 'DELETE /settlement/new-month');
        }
    },
};