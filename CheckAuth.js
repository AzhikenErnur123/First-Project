import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckAuth = ({ isLoggedIn, isAdmin, children }) => {
  const navigate = useNavigate();

  // Проверяем, авторизован ли пользователь и имеет ли права администратора
  if (!isLoggedIn) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    navigate('/login');
    return null;
  }

  if (children && isAdmin) {
    // Если пользователь авторизован и имеет права администратора, возвращаем дочерние компоненты
    return <>{children}</>;
  }

  // Если пользователь авторизован, но не имеет прав администратора, перенаправляем на главную страницу
  navigate('/');
  return null;
};

export default CheckAuth;
