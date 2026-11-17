import { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    if (token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization'];
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading] = useState(false);
  const syncedUserIdRef = useRef(null);

  const updateUser = useCallback((userData) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const storeAuthenticatedUser = (data) => {
    syncedUserIdRef.current = data._id;
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const currentUserIdRef = useRef(user?._id ?? null);
  useEffect(() => {
    currentUserIdRef.current = user?._id ?? null;
  }, [user?._id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = user?._id;

    if (!token || !userId || syncedUserIdRef.current === userId) return;

    syncedUserIdRef.current = userId;

    axiosClient.get('/auth/me').then(({ data }) => {

      if (currentUserIdRef.current !== userId) return;
      if (data.totalSpent !== undefined || data.tier !== undefined) {
        updateUser({ totalSpent: data.totalSpent, tier: data.tier });
      }
    }).catch((error) => {

      if (currentUserIdRef.current !== userId) return;
      if (error.response?.status === 401) {
        syncedUserIdRef.current = null;
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        delete axiosClient.defaults.headers.common['Authorization'];
      } else {
        console.warn('Không thể đồng bộ dữ liệu người dùng (server local):', error.message);
      }
    });

  }, [user?._id]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await axiosClient.post('/auth/login', { email, password });
      storeAuthenticatedUser(data);
      toast.success('Đăng nhập thành công!');
      return { success: true, user: data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Đăng nhập thất bại.' };
    }
  }, []);

  const googleLogin = useCallback(async (credential) => {
    try {
      const { data } = await axiosClient.post('/auth/google', { credential });
      storeAuthenticatedUser(data);
      toast.success('Đăng nhập bằng Google thành công!');
      return { success: true, user: data };
    } catch (error) {
      console.error('Google login error chi tiết:', error);
      const detailMessage =
        error.response?.data?.message ||
        (error.message?.includes('Network Error') ? 'Không thể kết nối đến máy chủ backend (Port 5000).' : '') ||
        error.message ||
        'Đăng nhập Google không thành công.';
      return {
        success: false,
        message: detailMessage,
      };
    }
  }, []);

  const devGoogleLogin = useCallback(async (email) => {
    try {
      const { data } = await axiosClient.post('/auth/google/dev-simulate', { email });
      storeAuthenticatedUser(data);
      toast.success('Đăng nhập Google (Chế độ phát triển) thành công!');
      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Giả lập đăng nhập Google không thành công.',
      };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await axiosClient.post('/auth/register', { name, email, password });
      storeAuthenticatedUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Đăng ký thất bại.' };
    }
  }, []);

  const logout = useCallback(() => {
    syncedUserIdRef.current = null;
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization'];
    toast.success('Đăng xuất thành công!');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, devGoogleLogin, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

