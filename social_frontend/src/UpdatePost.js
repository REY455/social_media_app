import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({ title: '', content: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Fetch the post details using the postId from the URL
    axios.get("${API_BASE_URL}/api/posts")
      .then(response => {
        const post = response.data.find(p => p._id === postId);
        if (post) {
          setPostData({ title: post.title, content: post.content });
        } else {
          alert("Post not found");
          navigate("/");
        }
      })
      .catch(error => console.error("Error fetching post data:", error));
  }, [postId, navigate]);

  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    if (file) {
      formData.append("file", file);
    }
    axios.put(`${API_BASE_URL}/api/posts/${postId}`, formData)
      .then(response => {
        console.log("Post updated:", response.data);
        navigate("/");
      })
      .catch(error => console.error("Error updating post:", error));
  };

  return (
    <div className="create-post">
      <h2>Update Post</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="title"
          placeholder="Title"
          value={postData.title}
          onChange={handleChange}
        /><br/>
        <textarea 
          name="content"
          placeholder="Content"
          value={postData.content}
          onChange={handleChange}
        /><br/>
        <input 
          type="file"
          onChange={e => setFile(e.target.files[0])}
        /><br/>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default UpdatePost;
