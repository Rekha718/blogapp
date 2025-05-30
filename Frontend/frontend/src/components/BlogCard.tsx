import React from 'react';

export interface BlogPost {
  post_id: number;
  author_id: number;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  created_at: string;
  updated_at: string;
}

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onClick(); }}
      className="cursor-pointer border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`View details for blog post titled ${post.title}`}
    >
      {post.images && post.images.length > 0 && (
        <img
          src={post.images[0]}
          alt={`Image for ${post.title}`}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-3">{post.content.slice(0, 100)}{post.content.length > 100 ? '...' : ''}</p>
        {post.tags.length > 0 && (
          <div className="mb-3">
            <strong>Tags: </strong>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500">Created at: {formattedDate}</p>
      </div>
    </article>
  );
};

export default BlogCard;
