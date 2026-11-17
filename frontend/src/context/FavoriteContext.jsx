import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    if (!user) {
      setTimeout(() => setFavoriteIds(new Set()), 0);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const { data } = await axiosClient.get('/auth/favorites');
        setFavoriteIds(new Set(data.map((f) => f._id)));
      } catch (error) {
        console.error('Không thể tải danh sách yêu thích:', error);
      }
    };
    fetchFavorites();
  }, [user]);

  const addFavorite = useCallback(async (food) => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để thêm yêu thích!');
      return;
    }

    if (favoriteIds.has(food._id)) {
      toast.info('Món ăn đã tồn tại trong danh sách yêu thích');
      return;
    }

    setFavoriteIds((prev) => new Set([...prev, food._id]));

    try {
      const { data } = await axiosClient.post(`/auth/favorites/${food._id}`);
      toast.success('Thêm vào danh sách yêu thích thành công');
      setFavoriteIds(new Set(data.favoriteFoods));
    } catch (error) {

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(food._id);
        return next;
      });
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  }, [user, favoriteIds]);

  const removeFavorite = useCallback(async (food) => {
    if (!user) return;

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(food._id);
      return next;
    });

    try {
      const { data } = await axiosClient.delete(`/auth/favorites/${food._id}`);
      toast.info('Đã xóa khỏi yêu thích');
      setFavoriteIds(new Set(data.favoriteFoods));
    } catch {

      setFavoriteIds((prev) => new Set([...prev, food._id]));
      toast.error('Có lỗi xảy ra khi xóa');
    }
  }, [user]);

  const isFavorited = useCallback((foodId) => favoriteIds.has(foodId), [favoriteIds]);

  const toggleFavorite = useCallback(async (food) => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để lưu món yêu thích!');
      return;
    }
    if (favoriteIds.has(food._id)) {
      await removeFavorite(food);
    } else {
      await addFavorite(food);
    }
  }, [user, favoriteIds, addFavorite, removeFavorite]);

  return (
    <FavoriteContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, toggleFavorite, isFavorited }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);

