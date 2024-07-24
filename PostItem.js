import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { getPostById } from "./api";
import './styles.css';

export default function PostItem() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (!postId) return;
                const { success, data, error } = await getPostById(postId);
                if (success) {
                    setPost(data);
                } else {
                    setError(error);
                }
            } catch (error) {
                setError('Failed to fetch post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!post) {
        return <div>No post found</div>;
    }

    return (
        <div className="post-item">
            <h1>{post.title}</h1>
            {post.url && <img src={post.url} alt={post.title} className="post-image" />}
            <h2>О {post.title}</h2>
            <h3>{post.content}</h3><br/>
            <h2>Теги:</h2>
            <h3>{post.tegi}</h3><br/>
            <h2>Изобрел:</h2>
            <h3>{post.platform}</h3>
            <Link to="/posts">Back to Posts</Link>
        </div>
    );
}
