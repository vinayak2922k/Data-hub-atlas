require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Seed error: MONGO_URI is missing from environment');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected for seeding: ${conn.connection.host}`);

    console.log('Purging existing posts and users...');
    await Post.deleteMany({});
    await User.deleteMany({});

    console.log('Inserting 3 seed users...');
    const users = await User.insertMany([
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Jordan Chen',
        email: 'jordan.chen@example.com',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Samantha Hayes',
        email: 'samantha.hayes@example.com',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log('Inserting 8 realistic web development posts with spread dates...');
    const posts = [
      {
        title: 'Deep Dive into Node.js Event Loop Architecture',
        content:
          'Understanding microtask queues, timer phases, and I/O polling is essential for writing non-blocking asynchronous JavaScript at scale.',
        authorId: users[0]._id,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Modern CSS Grid: Layout Patterns for 2026',
        content:
          'Subgrid, masonry tracks, and container queries have fundamentally transformed how responsive web interfaces are structured without media queries.',
        authorId: users[1]._id,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Designing Resilient RESTful APIs with Express',
        content:
          'A standardized response envelope combined with declarative validation middlewares guarantees client predictability and graceful fault isolation.',
        authorId: users[2]._id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Mongoose Schema Design: Embedding vs Referencing',
        content:
          'Balancing document growth, atomicity, and query patterns dictates when to embed subdocuments versus using normalized ObjectId references.',
        authorId: users[0]._id,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Server-Sent Events vs WebSockets: Choosing the Right Protocol',
        content:
          'When unidirectional streaming over standard HTTP is sufficient, SSE avoids protocol upgrade friction and simplifies reverse proxy infrastructure.',
        authorId: users[1]._id,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Effective Error Handling Patterns in Async JavaScript',
        content:
          'Centralized error boundary middlewares paired with custom domain error classes eliminate repetitive try-catch blocks across controllers.',
        authorId: users[2]._id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Zero-Downtime Database Migrations on Cloud Document Stores',
        content:
          'Expand and contract patterns allow evolving schema requirements in production document databases without scheduled maintenance windows.',
        authorId: users[0]._id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Benchmarking HTTP/2 and HTTP/3 Performance for Web Services',
        content:
          'QUIC-based multiplexing eliminates head-of-line blocking on packet loss, delivering measurable latency reductions for edge-facing APIs.',
        authorId: users[1]._id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await Post.insertMany(posts);

    console.log(`Seeding complete: ${users.length} users and ${posts.length} posts successfully loaded.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(`Seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seedData();
