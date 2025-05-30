const API_BASE = 'http://localhost:3000/api';

// Helper function to handle fetch response and errors
async function handleResponse(res: Response) {
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Request failed');
    } catch {
      throw new Error('Request failed. Unexpected response.');
    }
  }
  // For DELETE or empty response, check if there's content
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const createPost = async (post: any) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return handleResponse(res);
};

export const updatePost = async (id: string, post: any) => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return handleResponse(res);
};

export const getPost = async (id: string) => {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  return handleResponse(res);
};

export const getAllPosts = async () => {
  const res = await fetch(`${API_BASE}/posts`);
  return handleResponse(res);
};

export const deletePost = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
  });
  await handleResponse(res);
};
