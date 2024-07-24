import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, createCategory, deleteCategory, updateCategory } from './api';
import { toast } from 'react-toastify';
import './SSS.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await getAllCategories();
    if (response.success) {
      setCategories(response.data);
    } else {
      toast.error(response.data);
    }
  };

  const handleCreateCategory = async () => {
    if (newCategoryName.trim() === '') {
      toast.error('Введите имя категории');
      return;
    }

    const response = await createCategory(newCategoryName.trim());
    if (response.success) {
      toast.success(response.data.message);
      setNewCategoryName('');
      fetchCategories();
    } else {
      toast.error(response.data);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const response = await deleteCategory(categoryId);
    if (response.success) {
      toast.success(response.data.message);
      fetchCategories();
    } else {
      toast.error(response.data);
    }
  };

  const handleEditCategory = async () => {
    if (editCategoryId === null || editCategoryName.trim() === '') {
      toast.error('Выберите категорию для редактирования и введите новое имя');
      return;
    }

    const response = await updateCategory(editCategoryId, editCategoryName.trim());
    if (response.success) {
      toast.success(response.data.message);
      setEditCategoryId(null);
      setEditCategoryName('');
      fetchCategories();
    } else {
      toast.error(response.data);
    }
  };

  const handleEditClick = (categoryId, categoryName) => {
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/posts");
  };

  return (
    <div className="category-manager-container">
      <h2>Управление категориями</h2>
      <div>
        <h3>Создать категорию</h3>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Новая категория"
        />
        <button onClick={handleCreateCategory}>Создать</button>
        <form onSubmit={handleSubmit}>
          <button type="submit">Назад</button>
        </form>
      </div>
      <div>
        <h3>Существующие категории</h3>
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              {editCategoryId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <button onClick={handleEditCategory}>Сохранить</button>
                  <button onClick={handleCancelEdit}>Отмена</button>
                </>
              ) : (
                <>
                  {category.name}
                  <button onClick={() => handleEditClick(category.id, category.name)}>Редактировать</button>
                  <button onClick={() => handleDeleteCategory(category.id)}>Удалить</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
