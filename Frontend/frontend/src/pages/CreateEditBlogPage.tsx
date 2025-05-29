import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Save, Eye, Tag, X, Image } from 'lucide-react';
import { createPost, updatePost, getPost } from '../api/posts'; 

interface CreateEditBlogPageProps {
  blogId?: string;
  onBack: () => void;
  onSave: () => void;
}

const CreateEditBlogPage: React.FC<CreateEditBlogPageProps> = ({ blogId, onBack, onSave }) => {
  const { user } = useAuth();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    tags: [] as string[]
  });

  const isEditing = !!blogId;

  // Fetch post if editing
  useEffect(() => {
    if (isEditing && blogId) {
      getPost(blogId).then((data) => {
        setFormData({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          image: data.images?.[0] || '',
          tags: data.tags || []
        });
      });
    }
  }, [blogId]);

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;

    setIsSaving(true);
    const payload = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      tags: formData.tags,
      images: formData.image ? [formData.image] : [],
      author_id: user?.id || 'guest' // fallback if user not logged in
    };

    try {
      if (isEditing && blogId) {
        await updatePost(blogId, payload);
      } else {
        await createPost(payload);
      }
      onSave(); // trigger refresh or navigation
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  return (
    <Card className="max-w-4xl mx-auto mt-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <ArrowLeft onClick={onBack} className="cursor-pointer" />
          <CardTitle>{isEditing ? 'Edit' : 'Create'} Blog Post</CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Excerpt</Label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea
            className="min-h-[150px]"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <div className="flex items-center space-x-2">
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            {formData.image && <Image />}
          </div>
        </div>
        <div>
          <Label>Tags</Label>
          <div className="flex space-x-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
            />
            <Button variant="secondary" onClick={handleAddTag}>
              <Tag className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
                {tag}
                <X
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 h-4 w-4 cursor-pointer"
                />
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateEditBlogPage;