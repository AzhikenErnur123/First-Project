import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyPosts } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

export default function MyPosts() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            const { success, data } = await getMyPosts();
            if (success) {
                setPosts(data);
            } else {
                navigate("/login", { state: { message: data } });
            }
        };

        loadPosts();
    }, []);

    return (
        <div className="container">
            {posts.map((post) => {
                return (
                    <div key={post.id} className="my-post">
                        <Link to={`/posts/${post.id}`}>
                            {post.title}
                        </Link>
                    </div>
                );
            })}
            <div><Outlet /></div>
        </div>
    );
}
