import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Posts from './Posts';
import Navigation from './Navigation';
import LoginForm from './LoginForm';
import CreatePostForm from './CreatePostForm';
import EditPostPage from './EditPostPage';
import Register from './Register';
import PostItem from './PostItem';
import Categori from './CategoryManager';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const handleLogin = (userId, isAdmin) => {
    setCurrentUserId(userId);
    setIsAdmin(isAdmin);
  };

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/*" element={<Posts isAdmin={isAdmin} currentUserId={currentUserId} />} />
        <Route
          path="/posts/create"
          element={isAdmin ? <CreatePostForm /> : <Navigate to="/posts" />}
        />
        <Route path="/posts/:postId/*" element={<PostItem />} />
        <Route path="/posts/:postId/edit" element={<EditPostPage />} />
        {isAdmin && <Route path="/categories" element={<Categori />} />}
      </Routes>
    </Router>
  );
}
