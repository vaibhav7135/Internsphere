import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load user session from localStorage + backend
  useEffect(() => {
    const savedUser = localStorage.getItem('internsphere_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Fetch fresh session details from the Spring Boot server
        fetch(`/api/users/${parsedUser.id}`)
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error('User session not found');
          })
          .then((freshUser) => {
            delete freshUser.password;
            setUser(freshUser);
            localStorage.setItem('internsphere_user', JSON.stringify(freshUser));
          })
          .catch(() => {
            // Keep localStorage user as fallback if server is offline or unreachable
          })
          .finally(() => {
            setLoading(false);
          });
      } catch {
        localStorage.removeItem('internsphere_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('internsphere_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const errorText = await response.text();
        return { success: false, message: errorText || 'Invalid email or password' };
      }
    } catch (err) {
      return { success: false, message: 'Server is currently offline. Please try again later.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('internsphere_user');
  };

  const updateProfile = async (updates) => {
    // Standard update triggers state change
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('internsphere_user', JSON.stringify(updated));
  };

  // Student specific API submissions
  const submitAssignment = async (assignmentId, githubUrl, notes) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/students/${user.id}/assignments/${assignmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl, notes }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('internsphere_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to submit assignment to Spring Boot server:', err);
    }
  };

  const submitAssessment = async (assessmentId, score) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/students/${user.id}/assessments/${assessmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('internsphere_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to submit assessment score to Spring Boot server:', err);
    }
  };

  const submitProject = async (projectData) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/students/${user.id}/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('internsphere_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to submit Capstone project to Spring Boot server:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        submitAssignment,
        submitAssessment,
        submitProject,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
