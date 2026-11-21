const renderLandingPage = ({ isConnected, postCount, userCount, dbHost }) => {
  const statusBadge = isConnected
    ? `<span class="badge badge-online"><span class="pulse pulse-green"></span> Atlas Connected</span>`
    : `<span class="badge badge-offline"><span class="pulse pulse-red"></span> Database Disconnected</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Data Hub · Live</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.72);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.14);
      --primary: #6366f1;
      --accent: #ec4899;
      --gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --get: #10b981;
      --post: #3b82f6;
      --put: #f59e0b;
      --delete: #ef4444;
      --font: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      background-image: 
        radial-gradient(circle at 15% 10%, rgba(99, 102, 241, 0.16), transparent 35%),
        radial-gradient(circle at 85% 15%, rgba(236, 72, 153, 0.12), transparent 35%),
        radial-gradient(circle at 50% 90%, rgba(168, 85, 247, 0.10), transparent 45%);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      padding: 2.5rem 1.25rem 5rem;
      line-height: 1.6;
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--card-border);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-logo {
      width: 34px;
      height: 34px;
      background: var(--gradient);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.1rem;
      color: #fff;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .badge-online {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }

    .badge-offline {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #f87171;
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .pulse-green {
      background: #10b981;
      box-shadow: 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse-green-anim 2s infinite;
    }

    .pulse-red {
      background: #ef4444;
      box-shadow: 0 0 0 rgba(239, 68, 68, 0.7);
      animation: pulse-red-anim 2s infinite;
    }

    @keyframes pulse-green-anim {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    @keyframes pulse-red-anim {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    .hero {
      text-align: center;
      padding: 4rem 1rem 3rem;
    }

    .hero h1 {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }

    .hero p {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 620px;
      margin: 0 auto 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3.5rem;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: transform 0.2s, border-color 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--card-hover);
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.02em;
    }

    .stat-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      font-family: var(--mono);
    }

    .section-title {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .table-wrapper {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem 1.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--card-border);
    }

    td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.9rem;
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .method-badge {
      display: inline-block;
      font-family: var(--mono);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      letter-spacing: 0.02em;
      text-align: center;
      min-width: 65px;
    }

    .method-get {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .method-post {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .method-put {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .method-delete {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .endpoint-path {
      font-family: var(--mono);
      font-size: 0.88rem;
      font-weight: 600;
      color: #e5e7eb;
    }

    .endpoint-desc {
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .endpoint-action a {
      color: var(--primary);
      text-decoration: none;
      font-family: var(--mono);
      font-size: 0.8rem;
      background: rgba(99, 102, 241, 0.12);
      padding: 0.3rem 0.65rem;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
    }

    .endpoint-action a:hover {
      background: rgba(99, 102, 241, 0.24);
      color: #fff;
    }

    footer {
      text-align: center;
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid var(--card-border);
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .table-wrapper {
        overflow-x: auto;
      }
      th, td {
        padding: 0.75rem 0.9rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="navbar">
      <div class="brand">
        <div class="brand-logo">&Sigma;</div>
        <span>The Data Hub</span>
      </div>
      <div>
        ${statusBadge}
      </div>
    </nav>

    <header class="hero">
      <h1>The Data Hub &middot; Live</h1>
      <p>Persistent Cloud Storage on MongoDB Atlas with Mongoose ODM, Relational Schemas, and Real-time Telemetry.</p>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Published Posts</div>
        <div class="stat-value">${postCount}</div>
        <div class="stat-meta">Mongoose Post.countDocuments()</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Registered Authors</div>
        <div class="stat-value">${userCount}</div>
        <div class="stat-meta">Mongoose User.countDocuments()</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Database Status</div>
        <div class="stat-value" style="font-size: 1.35rem; color: ${isConnected ? '#34d399' : '#f87171'}">
          ${isConnected ? 'Online &amp; Connected' : 'Disconnected'}
        </div>
        <div class="stat-meta">${dbHost || 'MongoDB Atlas'}</div>
      </div>
    </section>

    <h2 class="section-title">Available REST API Routes</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="method-badge method-get">GET</span></td>
            <td><span class="endpoint-path">/posts</span></td>
            <td class="endpoint-desc">Retrieve all posts with populated author details (name, email)</td>
            <td class="endpoint-action"><a href="/posts" target="_blank">Try GET &rarr;</a></td>
          </tr>
          <tr>
            <td><span class="method-badge method-get">GET</span></td>
            <td><span class="endpoint-path">/posts/recent</span></td>
            <td class="endpoint-desc">Retrieve the top 3 most recent posts (sort createdAt: -1, limit 3)</td>
            <td class="endpoint-action"><a href="/posts/recent" target="_blank">Try GET &rarr;</a></td>
          </tr>
          <tr>
            <td><span class="method-badge method-get">GET</span></td>
            <td><span class="endpoint-path">/posts/:id</span></td>
            <td class="endpoint-desc">Retrieve single post by 24-character hexadecimal ObjectId</td>
            <td class="endpoint-action"><span class="endpoint-desc">Params: :id</span></td>
          </tr>
          <tr>
            <td><span class="method-badge method-post">POST</span></td>
            <td><span class="endpoint-path">/posts</span></td>
            <td class="endpoint-desc">Create post with title (3-120 chars), content, and authorId</td>
            <td class="endpoint-action"><span class="endpoint-desc">JSON Body</span></td>
          </tr>
          <tr>
            <td><span class="method-badge method-put">PUT</span></td>
            <td><span class="endpoint-path">/posts/:id</span></td>
            <td class="endpoint-desc">Update post title/content with full schema validation</td>
            <td class="endpoint-action"><span class="endpoint-desc">JSON Body</span></td>
          </tr>
          <tr>
            <td><span class="method-badge method-delete">DELETE</span></td>
            <td><span class="endpoint-path">/posts/:id</span></td>
            <td class="endpoint-desc">Remove post permanently from MongoDB Atlas</td>
            <td class="endpoint-action"><span class="endpoint-desc">Params: :id</span></td>
          </tr>
          <tr>
            <td><span class="method-badge method-get">GET</span></td>
            <td><span class="endpoint-path">/users</span></td>
            <td class="endpoint-desc">List registered authors and contributors</td>
            <td class="endpoint-action"><a href="/users" target="_blank">Try GET &rarr;</a></td>
          </tr>
          <tr>
            <td><span class="method-badge method-post">POST</span></td>
            <td><span class="endpoint-path">/users</span></td>
            <td class="endpoint-desc">Register new author with name and unique email</td>
            <td class="endpoint-action"><span class="endpoint-desc">JSON Body</span></td>
          </tr>
          <tr>
            <td><span class="method-badge method-post">POST</span></td>
            <td><span class="endpoint-path">/login</span></td>
            <td class="endpoint-desc">Mock JWT authentication token generator (Base64URL 3-part token)</td>
            <td class="endpoint-action"><span class="endpoint-desc">JSON Body</span></td>
          </tr>
          <tr>
            <td><span class="method-badge method-get">GET</span></td>
            <td><span class="endpoint-path">/health</span></td>
            <td class="endpoint-desc">Server operational health, database connection, and uptime telemetry</td>
            <td class="endpoint-action"><a href="/health" target="_blank">Try GET &rarr;</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <footer>
      The Data Hub &middot; Engineered with Express &amp; Mongoose for MongoDB Atlas
    </footer>
  </div>
</body>
</html>`;
};

module.exports = renderLandingPage;
