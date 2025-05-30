import React, { useEffect, useState } from 'react';
import { BlogPost } from '../components/BlogCard';
import { ArrowLeft, Pencil, Trash2, Save, X } from 'lucide-react';

interface BlogDetailPageProps {
  blogId: string;
  onBack: () => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ blogId, onBack }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${blogId}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPost(data);
        setFormData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [blogId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/posts/${blogId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      alert('Post deleted successfully');
      onBack();
    } catch {
      alert('Failed to delete the post.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSave = async () => {
    if (!post) return;

    try {
      const res = await fetch(`http://localhost:3000/api/posts/${post.post_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update post');

      const updatedPost = await res.json();
      setPost(updatedPost);
      setIsEditing(false);
      alert('Post updated successfully');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!post) return <div className="p-4">Post not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Title"
          />
          <textarea
            name="content"
            value={formData.content || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 h-40"
            placeholder="Content"
          />

          <input
            type="text"
            name="tags"
            value={formData.tags ? (formData.tags as string[]).join(', ') : ''}
            onChange={handleTagsChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Tags (comma separated)"
          />

          <input
            type="text"
            name="images"
            value={formData.images ? (formData.images as string[]).join(', ') : ''}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                images: e.target.value.split(',').map(i => i.trim()),
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Image URLs (comma separated)"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(post);
              }}
              className="flex items-center gap-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="text-sm text-gray-500">
              <strong>Tags:</strong>{' '}
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-gray-100 px-2 py-1 rounded-md mr-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className="space-y-2">
              <strong className="text-sm text-gray-500">Images:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
