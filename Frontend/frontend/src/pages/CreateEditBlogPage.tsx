import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Save, Eye, Tag, X, Image, Trash2 } from 'lucide-react';
import { createPost, updatePost, getPost, deletePost } from '../api/posts';

interface CreateEditBlogPageProps {
  blogId?: string;
  onBack: () => void;
  onSave: () => void;
}

const CreateEditBlogPage: React.FC<CreateEditBlogPageProps> = ({ blogId, onBack, onSave }) => {
  const { user } = useAuth();
  const isEditing = !!blogId;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: [] as string[],
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditing && blogId) {
        try {
          const post = await getPost(blogId);
          setFormData({
            title: post.title,
            content: post.content,
            image: post.image,
            tags: post.tags || [],
          });
        } catch (error) {
          console.error('Failed to fetch post:', error);
        }
      }
    };
    fetchPost();
  }, [blogId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (isEditing) {
        await updatePost(blogId!, {
          ...formData,
          authorId: user.id,
        });
      } else {
        await createPost({
          ...formData,
          authorId: user.id,
        });
      }

      onSave(); // ⬅️ Redirect to blog list
    } catch (error) {
      console.error('Failed to save blog post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !blogId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this blog post?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deletePost(blogId);
      onSave(); // ⬅️ Redirect to blog list
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeft onClick={onBack} className="cursor-pointer" />
          <CardTitle>{isEditing ? 'Edit Blog' : 'Create Blog'}</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isPreview ? (
          <div className="prose max-w-full">
            <h2>{formData.title}</h2>
            <img src={formData.image} alt="Blog" />
            <p>{formData.content}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, i) => (
                <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input name="image" value={formData.image} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea name="content" value={formData.content} onChange={handleChange} rows={8} />
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                <Button type="button" onClick={handleAddTag}>
                  <Tag className="mr-1 h-4 w-4" /> Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1 text-sm">
                    #{tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </span>
                ))}
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateEditBlogPage;
