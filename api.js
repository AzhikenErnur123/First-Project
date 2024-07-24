import axios from "axios";

const AuthHeader = () => {
  if (typeof localStorage !== 'undefined') {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      console.log("Token retrieved:", user.token);
      return { Authorization: "Bearer " + user.token };
    }
  }
  return {};
};




export const doLogin = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:3005/login', { email, password });
    const data = response.data;
    
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      return { 
        success: true, 
        data: {
          userId: data.userId,
          isAdmin: data.isAdmin
        }
      };
    } else {
      return { 
        success: false, 
        data: "Token is missing in response" 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      data: error.response ? error.response.data.message : 'Network error' 
    };
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3005/categories');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.response.data.error || "Unknown error occurred" };
  }
};


export const getGoodsAndCats = async (url) => {
  const [cats,posts] = await axios.all([
      axios.get(url),
      axios.get('http://localhost:3005/categories')
      
  ])
  return [cats.data, posts.data];
}


export const getAllPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3005/posts');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.response.data.error || "Unknown error occurred" };
  }
};

export const getMyPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3005/privatePosts', {
      headers: AuthHeader()
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.response.data.error || "Unknown error occurred" };
  }
};

export const createPost = async (title, content, tegi, platform, categoryId) => {
    try {
        const response = await axios.post(
            'http://localhost:3005/posts/create',
            { title, content, tegi, platform, categoryId },
            { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: error.response.data.message || "Unknown error occurred" };
    }
};


export const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    console.log("Token sent:", token);
    const response = await axios.delete(
      'http://localhost:3005/posts/' + postId,
      {
        headers: AuthHeader()
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
     return{ success: false, data: error.response.data || "Unknown error occurred" };
  }
};
 

export const updatePost = async (postId, title, content, categoryId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `http://localhost:3005/posts/${postId}`,
      {
        title: title,
        content: content,
        categoryId: categoryId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.response.data || "Unknown error occurred" };
  }
};




export async function getPostById(postId) {
  try {
    const response = await fetch(`http://localhost:3005/posts/${postId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(
      'http://localhost:3005/register',
      {
        email: email,
        password: password
      }
    );

   
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));

    console.log("Token saved:", response.data.token);
    return { success: true, data: "User was registered and logged in" };
  } catch (error) {
    return { success: false, data: error.response.data.error || "Unknown error occurred" };
  }
};


export const createCategory = async (name) => {
  try {
    const response = await axios.post(
      'http://localhost:3005/categories/create',
      { name },
      {
        headers: AuthHeader()
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: error.response ? error.response.data.message : 'Network error' };
  }
};





export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3005/categories/${categoryId}`,
      {
        headers: AuthHeader()
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: 'Не удалось удалить категорию' };
  }
};


export const updateCategory = async (categoryId, name) => {
  try {
    const response = await axios.put(
      `http://localhost:3005/categories/${categoryId}`, 
      { name }, 
      { headers: AuthHeader() }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: 'Не удалось обновить категорию' };
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      const data = await response.json();
      return { success: response.ok, data };
  } catch (error) {
      return { success: false, data: error.message };
    }
};



