const supabase = require('../supabaseClient');  

const getPosts = async (req, res) => {
  const { data, error } = await supabase.from('blogpost').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createPost = async (req, res) => {
  const { title, content, author_id, tags = [], images = [] } = req.body;

  const { data, error } = await supabase.from('blogpost').insert([
    {
      title,
      content,
      author_id,
      tags,
      images,
    }
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, content, tags = [], images = [] } = req.body;

  const { data, error } = await supabase
    .from('blogpost')
    .update({ title, content, tags, images })
    .eq('post_id', postId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  const { data, error } = await supabase
    .from('blogpost')
    .delete()
    .eq('post_id', postId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Post deleted successfully', data });
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
