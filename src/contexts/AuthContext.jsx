import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [studentClass, setStudentClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('tn_studymate_user');
    const savedClass = localStorage.getItem('tn_studymate_class');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedClass) {
      setStudentClass(savedClass);
    }
    setLoading(false);
  }, []);

  const login = (userData, selectedClass) => {
    const userInfo = {
      name: userData.name || userData.email || userData.phone || 'Student',
      email: userData.email || '',
      phone: userData.phone || '',
      avatar: userData.name ? userData.name.charAt(0).toUpperCase() : 'S',
      uid: userData.uid || Date.now().toString(),
    };
    setUser(userInfo);
    setStudentClass(selectedClass);
    localStorage.setItem('tn_studymate_user', JSON.stringify(userInfo));
    localStorage.setItem('tn_studymate_class', selectedClass);
  };

  const updateClass = (newClass) => {
    setStudentClass(newClass);
    localStorage.setItem('tn_studymate_class', newClass);
  };

  const logout = () => {
    setUser(null);
    setStudentClass(null);
    localStorage.removeItem('tn_studymate_user');
    localStorage.removeItem('tn_studymate_class');
  };

  return (
    <AuthContext.Provider value={{
      user,
      studentClass,
      loading,
      login,
      logout,
      updateClass,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
