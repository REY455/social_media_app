import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;


    axios.post(`${API_BASE_URL}/api/posts`, formData)
      .then(response => {
        console.log("Post created:", response.data);
        navigate("/");
      })
      .catch(error => {
        console.error("Error creating post:", error);
      });
  };

  return (
    <div className="create-post">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        /><br/>
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        /><br/>
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        /><br/>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
