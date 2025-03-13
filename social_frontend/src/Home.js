import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  // Initialize posts as an empty array.
  const [posts, setPosts] = useState([]);

  // Fetch posts when the component mounts.
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from the backend.
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts`);
      console.log("API Response:", response.data);
      // If response.data is an array, use it; otherwise, default to an empty array.
      const postsData = Array.isArray(response.data) ? response.data : [];
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Handler to like a post.
  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/posts/like/${postId}`);
      setPosts(posts.map(post => post._id === postId ? response.data : post));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handler to delete a post.
  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`);
      // Remove the deleted post from state.
      setPosts(posts.filter(post => post._id !== postId));
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="home">
      <h2>Recent Posts</h2>
      {/* Ensure posts is an array before mapping */}
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.file && (
              <div>
                {post.file.match(/\.(mp4|webm)$/) ? (
                  <video width="320" height="240" controls>
                    <source src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.file}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.file}`} alt="Post Media" />
                )}
              </div>
            )}
            <button onClick={() => handleLike(post._id)}>Like ({post.likes})</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default Home;
