// BlogPost.jsx
import { useParams } from 'react-router-dom';
import blogs from './data/blogs.json';

function BlogPost() {
  const { slug } = useParams();
  const post = blogs.find((p) => p.slug === slug);

  if (!post) {
    return <h2>Post not found</h2>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <img
        src={post.image}
        alt={post.title}
        style={{ width: '100%', height: '400px', objectFit: 'cover', marginBottom: '20px' }}
      />
      <p>{post.content}</p>
    </div>
  );
}

export default BlogPost;
