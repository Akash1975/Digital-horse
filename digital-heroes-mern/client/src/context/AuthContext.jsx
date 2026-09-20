import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser as serviceLogout,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check logged-in user when application starts
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        const loadCurrentUser = async () => {
            try {
                const response = await getCurrentUser();

                const currentUser =
                    response.user || response.data || response;

                setUser(currentUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser)
                );
            } catch (error) {
                console.error(
                    "Authentication verification failed:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadCurrentUser();
    }, []);

    // Register
    const register = async (userData) => {
        const response = await registerUser(userData);

        if (response.token) {
            localStorage.setItem("token", response.token);
        }

        if (response.user) {
            setUser(response.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );
        }

        return response;
    };

    // Login
    const login = async (loginData) => {
        const response = await loginUser(loginData);

        const loggedInUser =
            response.user || response.data?.user;

        if (loggedInUser) {
            setUser(loggedInUser);

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );
        }

        return response;
    };

    // Logout
    const logout = () => {
        setUser(null);
        serviceLogout();
    };

    const isAuthenticated = Boolean(
        user && localStorage.getItem("token")
    );

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}

export default AuthContext;