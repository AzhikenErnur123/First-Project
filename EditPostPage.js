import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditPostForm from './EditPostForm';
import { getPostById, updatePost } from './api';

const EditPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
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

  const handleUpdatePost = async (updatedPostData) => {
    try {
      const { success, data } = await updatePost(postId, updatedPostData.title, updatedPostData.content, updatedPostData.categoryId);
      if (success) {
        setPost(data); // Assuming data is the updated post object returned from the server
      } else {
        setError('Failed to update post');
      }
    } catch (error) {
      console.error('Unknown error occurred:', error);
      setError('Unknown error occurred');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Edit Post</h2>
      <EditPostForm post={post} onUpdatePost={handleUpdatePost} />
    </div>
  );
};

export default EditPostPage;
