const supabase = require('../supabaseClient');  

const getPosts = async (req, res) => {
  const { data, error } = await supabase.from('blogpost').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getPostById = async (req, res) => {
  const postId = req.params.id;

  const { data, error } = await supabase
    .from('blogpost')
    .select('*')
    .eq('post_id', postId)
    .single();

  if (error) {
    // If no rows found, Supabase returns error code 'PGRST116'
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(500).json({ error: error.message });
  }

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
  console.log(data)

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, content, tags = [], images = [] } = req.body;

  const { data, error } = await supabase
    .from('blogpost')
    .update({ title, content, tags, images })
    .eq('post_id', postId)
    .select();  

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Post not found' });

  res.json(data[0]); 
};


const deletePost = async (req, res) => {
  const postId = req.params.id

  const { data, error } = await supabase
    .from('blogpost')
    .delete()
    .eq('post_id', postId); 

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Post deleted successfully', data });
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
