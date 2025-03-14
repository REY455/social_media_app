const mongoose = require('mongoose');
const app = require('./server'); // Import the app from server.js
const Post = require('./models/post');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer for file uploads in tests
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Set up test MongoDB URI
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// Clear the test database before each test
beforeEach(async () => {
  await Post.deleteMany({});
});

// Close connection after tests
afterAll(async () => {
  await mongoose.connection.close();
});

// 👉 POST /api/posts - Create a new post
describe('POST /api/posts', () => {
  it('should create a new post', async () => {
    const newPost = {
      title: 'Test Post',
      content: 'This is a test post.',
    };

    const response = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Post');
    expect(response.body).toHaveProperty('content', 'This is a test post.');
  });

  it('should create a new post with a file', async () => {
    const newPost = {
      title: 'Test Post with File',
      content: 'This is a test post with a file upload.',
    };

    // Create a buffer as a fake file
    const fileBuffer = Buffer.from('fake image data');

    const response = await request(app)
      .post('/api/posts')
      .field('title', newPost.title)
      .field('content', newPost.content)
      .attach('file', fileBuffer, 'test-file.jpg');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('file');
  });
});

// 👉 GET /api/posts - Get all posts
describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    // Create a test post
    const post = new Post({
      title: 'Test Post 1',
      content: 'Content for post 1',
      likes: 0,
    });
    await post.save();

    const response = await request(app).get('/api/posts');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', 'Test Post 1');
  });

  it('should return an empty array if no posts exist', async () => {
    const response = await request(app).get('/api/posts');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});

// 👉 GET /api/posts/:id - Get a post by ID
describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const post = new Post({
      title: 'Test Post by ID',
      content: 'Content for test post',
      likes: 0,
    });
    await post.save();

    const response = await request(app).get(`/api/posts/${post._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Test Post by ID');
  });

  it('should return 404 for non-existing post', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/posts/${nonExistingId}`);

    expect(response.status).toBe(404);
  });
});

// 👉 PUT /api/posts/:id - Update a post by ID
describe('PUT /api/posts/:id', () => {
  it('should update a post by ID', async () => {
    const post = new Post({
      title: 'Post to update',
      content: 'Content to be updated',
      likes: 0,
    });
    await post.save();

    const updatedPost = {
      title: 'Updated Post',
      content: 'Updated content',
    };

    const response = await request(app)
      .put(`/api/posts/${post._id}`)
      .send(updatedPost);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Post');
    expect(response.body).toHaveProperty('content', 'Updated content');
  });

  it('should return 404 for non-existing post', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const updatedPost = {
      title: 'Updated Post',
      content: 'Updated content',
    };

    const response = await request(app)
      .put(`/api/posts/${nonExistingId}`)
      .send(updatedPost);

    expect(response.status).toBe(404);
  });
});

// 👉 DELETE /api/posts/:id - Delete a post by ID
describe('DELETE /api/posts/:id', () => {
  it('should delete a post by ID', async () => {
    const post = new Post({
      title: 'Post to delete',
      content: 'Content for deletion',
      likes: 0,
    });
    await post.save();

    const response = await request(app).delete(`/api/posts/${post._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post deleted successfully');
  });

  it('should return 404 for non-existing post', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/posts/${nonExistingId}`);

    expect(response.status).toBe(404);
  });
});

// 👉 POST /api/posts/like/:id - Like a post
describe('POST /api/posts/like/:id', () => {
  it('should increment the like count of a post', async () => {
    const post = new Post({
      title: 'Post to like',
      content: 'Content to like',
      likes: 0,
    });
    await post.save();

    const response = await request(app).post(`/api/posts/like/${post._id}`);

    expect(response.status).toBe(200);
    expect(response.body.likes).toBe(1);
  });

  it('should return 404 for non-existing post', async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const response = await request(app).post(`/api/posts/like/${nonExistingId}`);

    expect(response.status).toBe(404);
  });
});
