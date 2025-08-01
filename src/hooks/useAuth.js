
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('shootingTracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('shootingTracker_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userSession = { id: user.id, email: user.email, name: user.name };
      setUser(userSession);
      localStorage.setItem('shootingTracker_user', JSON.stringify(userSession));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('shootingTracker_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('shootingTracker_users', JSON.stringify(users));
    
    const userSession = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userSession);
    localStorage.setItem('shootingTracker_user', JSON.stringify(userSession));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shootingTracker_user');
  };

  return { user, login, register, logout, loading };
}
