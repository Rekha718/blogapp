const API_BASE = 'http://localhost:3000/api';

export const createPost = async (post: any) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create post');
    } catch (err) {
      throw new Error('Failed to create post. Unexpected response.');
    }
  }

  return res.json();
};

export const updatePost = async (id: string, post: any) => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update post');
    } catch (err) {
      throw new Error('Failed to update post. Unexpected response.');
    }
  }

  return res.json();
};

export const getPost = async (id: string) => {
  const res = await fetch(`${API_BASE}/posts/${id}`);

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch post');
    } catch (err) {
      throw new Error('Failed to fetch post. Unexpected response.');
    }
  }

  return res.json();
};

export const getAllPosts = async () => {
  const res = await fetch(`${API_BASE}/posts`);

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch posts');
    } catch (err) {
      throw new Error('Failed to fetch posts. Unexpected response.');
    }
  }

  return res.json();
};
