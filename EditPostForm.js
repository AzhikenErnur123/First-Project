import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  getAllCategories } from './api'; 
import './form.css'

const EditPostForm = ({ post, onUpdatePost }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [tegi, settegi] = useState(post.tegi);
    const [platform, setplatform] = useState(post.platform);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(post.categoryId);
    const navigate = useNavigate();
    useEffect(() => {
        
        setTitle(post.title);
        setContent(post.content);
        setContent(post.content);
        setContent(post.content);
        setCategoryId(post.categoryId);
       
            const fetchCategories = async () => {
                try {
                    const response = await getAllCategories(); 
                    if (response.success) {
                        setCategories(response.data);
                    } else {
                        toast('Failed to fetch categories:', response.data);
                    }
                } catch (error) {
                    toast('Error fetching categories:', error.message);
                }
            };
            fetchCategories();
        
    }, [post]);

    const handleUpdatePost = async () => {
        onUpdatePost({ title, content, categoryId });
        navigate("/posts");
        toast("Edit Form !!!")

    };

    return (
        <div className="post-form">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))}>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
        <button onClick={handleUpdatePost}>Update</button>
    </div>
    
    );
};

export default EditPostForm;
