import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { BlogPost } from '../components/BlogCard'; // or '../types' if you have a separate types file

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/posts');
        const data = await res.json();

        const mappedPosts: BlogPost[] = data.map((post: any) => ({
          post_id: post.post_id,
          author_id: post.author_id,
          title: post.title,
          content: post.content,
          tags: post.tags,
          images: post.images,
          created_at: post.created_at,
          updated_at: post.updated_at,
        }));

        setPosts(mappedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCardClick = (post: BlogPost) => {
    console.log('Clicked:', post.title);
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Blog Posts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.post_id} post={post} onClick={() => handleCardClick(post)} />
        ))}
      </div>
    </div>
  );
};

export default BlogListPage;
