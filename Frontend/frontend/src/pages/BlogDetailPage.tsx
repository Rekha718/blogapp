// src/pages/BlogDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost } from '../components/BlogCard';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p>Loading or Post not found...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.images?.[0] && (
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="text-gray-700 text-lg mb-4">{post.content}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
            #{tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">Posted on: {new Date(post.created_at).toLocaleString()}</p>
    </div>
  );
};

export default BlogDetailPage;
