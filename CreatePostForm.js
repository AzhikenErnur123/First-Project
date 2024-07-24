import React, { useState, useEffect } from 'react';
import { createPost, getAllCategories } from './api'; 
import { useNavigate } from 'react-router-dom';
import './Edit.css';

export default function CreateForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tegi, setTegi] = useState('');
    const [platform, setPlatform] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories(); 
                if (response.success) {
                    setCategories(response.data);
                } else {
                    console.error('Failed to fetch categories:', response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };
        fetchCategories();
    }, []); 

    const handleChangeTitle = (ev) => {
        setTitle(ev.target.value);
    };

    const handleChangeContent = (ev) => {
        setContent(ev.target.value);
    };

    const handleChangeQuantity = (ev) => {
        setTegi(ev.target.value);
    };

    const handleChangeAuthor = (ev) => {
        setPlatform(ev.target.value);
    };

    const handleChangeCategoryId = (ev) => {
        setCategoryId(parseInt(ev.target.value));
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const response = await createPost(title, content, tegi, platform, categoryId); // Исправлен вызов функции createPost
        if (response.success) {
            navigate("/posts", { state: { message: response.data, title: "Created successfully" } });
        } else {
            console.error('Failed to create post:', response.data);
        }
    };
    

    return (
        <div className="form-container">
        <h1>CreateForm</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={handleChangeTitle} placeholder="Title" />
            <input type="text" value={content} onChange={handleChangeContent} placeholder="Content" />
            <input type="number" value={tegi} onChange={handleChangeQuantity} placeholder="Quantity" />
            <input type="text" value={platform} onChange={handleChangeAuthor} placeholder="Author" />
            <select value={categoryId} onChange={handleChangeCategoryId}>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="submit">Add</button>
        </form>
    </div>
    );
}
