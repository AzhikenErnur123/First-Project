import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllPosts, getAllCategories, deletePost, updatePost } from './api';
import './styles.css';

export default function Posts({ isAdmin, currentUserId }) {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deletedPostId, setDeletedPostId] = useState(null);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [cartPosts, setCartPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCartPosts, setShowCartPosts] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { success: postSuccess, data: postData } = await getAllPosts();
                const { success: catSuccess, data: catData } = await getAllCategories();

                if (postSuccess) {
                    setPosts(postData);
                }

                if (catSuccess) {
                    setCategories(catData);
                }
            } catch (error) {
                toast.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [deletedPostId]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleDeletePost = async (postId, postAuthorId) => {
        console.log("isAdmin:", isAdmin);
        console.log("currentUserId:", currentUserId);
        console.log("postAuthorId:", postAuthorId);
        if (isAdmin || currentUserId === postAuthorId) {
            try {
                const { success, data } = await deletePost(postId);
                if (success) {
                    console.log(data.message);
                    setDeletedPostId(postId);
                } else {
                    console.error(data);
                    toast.error("You are not authorized to delete this post.");
                }
            } catch (error) {
                toast.error("Unknown error occurred");
            }
        } else {
            toast.error("Only author can delete it.");
        }
    };

    const handleUpdatePost = async (postId, updatedTitle, updatedContent, updatedCategoryId, postAuthorId) => {
        console.log("isAdmin:", isAdmin);
        console.log("currentUserId:", currentUserId);
        console.log("postAuthorId:", postAuthorId);
        if (isAdmin || currentUserId === postAuthorId) {
            try {
                const { success, data } = await updatePost(postId, updatedTitle, updatedContent, updatedCategoryId);
                if (success) {
                    console.log(data.message);
                    toast.success("Updated");
                    navigate(`/posts/${postId}/edit`);
                } else {
                    toast.error("You are not authorized to update this post.");
                }
            } catch (error) {
                toast.error("Unknown error occurred");
            }
        } else {
            toast.error("Only author can update this post.");
        }
    };

    const handleFavoritePost = (postId) => {
        if (favoritePosts.includes(postId)) {
            setFavoritePosts(favoritePosts.filter(id => id !== postId));
        } else {
            setFavoritePosts([...favoritePosts, postId]);
        }
    };

    const handleCartPost = (postId) => {
        if (cartPosts.includes(postId)) {
            setCartPosts(cartPosts.filter(id => id !== postId));
        } else {
            setCartPosts([...cartPosts, postId]);
        }
    };

    const filteredPosts = posts.filter(post => {
        return (
            (selectedCategory ? post.categoryId === selectedCategory : true) &&
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const displayedPosts = showCartPosts
        ? filteredPosts.filter(post => cartPosts.includes(post.id))
        : filteredPosts;

    return (
        <div className="posts-container">
            <div className="categories">
                <h1>Categories</h1>
                {categories.map(category => (
                    <button key={category.id} onClick={() => handleCategoryChange(category.id)}>
                        {category.name}
                    </button>
                ))}
                <button onClick={() => handleCategoryChange(null)}>All</button>
                <button onClick={() => setShowCartPosts(!showCartPosts)}>
                    {showCartPosts ? 'Show All Posts' : 'Show Cart Posts'}
                </button>
                <Link to={`/posts/create`} className='post-title'>CreateForm</Link>
                {isAdmin && (
                    <Link to={`/categories`} className='post-title'>Category Manager</Link>
                )}
            </div>
            <h1>Posts</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="posts">
                {displayedPosts.map(post => (
                    <div key={post.id} className="post">
                        <Link to={`/posts/${post.id}`} className="post-title"><h2>{post.title}</h2></Link>
                        <div className="post-buttons">
                            <button type="button" onClick={() => handleDeletePost(post.id, post.userId)}>Delete</button>
                            <button type="button" onClick={() => handleUpdatePost(post.id, post.title, post.content, post.categoryId, post.userId)}>Update</button>
                            <button
                                type="button"
                                className={favoritePosts.includes(post.id) ? "favorite-btn active" : "favorite-btn"}
                                onClick={() => handleFavoritePost(post.id)}
                            >
                                Favorite
                            </button>
                            <button
                                type="button"
                                className={cartPosts.includes(post.id) ? "cart-btn active" : "cart-btn"}
                                onClick={() => handleCartPost(post.id)}
                            >
                                Add to Cart
                            </button>
                        </div>
                        {deletedPostId === post.id && <p>Post deleted successfully!</p>}
                    </div>
                ))}
            </div>
            <h1>Favorites</h1>
            <div className="favorites">
                {favoritePosts.length > 0 ? (
                    posts.filter(post => favoritePosts.includes(post.id)).map(post => (
                        <div key={post.id} className="post">
                            <Link to={`/posts/${post.id}`} className="post-title"><h2>{post.title}</h2></Link>
                        </div>
                    ))
                ) : (
                    <p>No favorite posts</p>
                )}
            </div>
            <Outlet />
        </div>
    );
}
