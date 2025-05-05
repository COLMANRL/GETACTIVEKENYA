// BlogHome.jsx
import { Link } from 'react-router-dom';
import blogs from './data/blogs.json';
import { useState } from 'react';

function BlogHome() {
  const [visibleCount, setVisibleCount] = useState(2); // show 2 blogs first

  const loadMore = () => {
    setVisibleCount((prev) => prev + 2); // load 2 more on each click
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Our Blog</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {blogs.slice(0, visibleCount).map((post) => (
          <div
            key={post.slug}
            style={{
              width: '300px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px' }}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <Link to={`/blog/${post.slug}`} style={{ color: 'blue' }}>
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < blogs.length && (
        <button
          onClick={loadMore}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default BlogHome;
