// Demo user for authentication
const DEMO_USER = {
  id: 1,
  name: "Data Coffee Admin",
  username: "admin",
  role: 'admin'
};

export const authService = {
  login: async (credentials) => {
    // Simulate authentication - in production this would validate against real backend
    if (credentials.email === "admin@datacoffee.com" && credentials.password === "admin") {
      return DEMO_USER;
    }
    throw new Error("Invalid credentials");
  },

  logout: async () => {
    localStorage.removeItem('isAuthenticated');
    return true;
  },

  getCurrentUser: async () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true' ? DEMO_USER : null;
  }
};