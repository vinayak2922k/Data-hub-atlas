const renderLandingPage = ({ isConnected, postCount, userCount, dbHost }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Data Hub · Live API Explorer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --primary: #6366f1;
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
        radial-gradient(circle at 15% 10%, rgba(99, 102, 241, 0.16), transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(236, 72, 153, 0.12), transparent 40%),
        radial-gradient(circle at 50% 90%, rgba(168, 85, 247, 0.10), transparent 50%);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      padding: 2rem 1.25rem 4rem;
      line-height: 1.5;
    }

    .container { max-width: 1100px; margin: 0 auto; }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 800;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      background: var(--gradient);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: #fff;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-online {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .hero { text-align: center; padding: 2.5rem 1rem 2rem; }

    .hero h1 {
      font-size: clamp(2.2rem, 5vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }

    .hero p {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 620px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem;
      backdrop-filter: blur(10px);
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .stat-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text);
      margin: 0.2rem 0;
    }

    .stat-meta {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-family: var(--mono);
    }

    .explorer-layout {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }

    @media (max-width: 900px) {
      .explorer-layout { grid-template-columns: 1fr; }
    }

    .endpoints-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.15rem;
      backdrop-filter: blur(8px);
      transition: border-color 0.2s, background 0.2s;
    }

    .card:hover {
      border-color: rgba(99, 102, 241, 0.4);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .endpoint {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--mono);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .m-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-family: var(--mono);
    }

    .m-get { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .m-post { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .m-put { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .m-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

    .desc {
      color: var(--text-muted);
      font-size: 0.83rem;
      margin-top: 0.35rem;
    }

    .btn {
      background: var(--gradient);
      border: none;
      color: white;
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }

    .btn:hover { opacity: 0.9; }
    .btn:active { transform: scale(0.97); }

    .param-input {
      margin-top: 0.6rem;
      display: flex;
      gap: 0.5rem;
    }

    .param-input input, .param-input textarea {
      background: #070a10;
      border: 1px solid var(--card-border);
      color: #fff;
      font-family: var(--mono);
      font-size: 0.8rem;
      padding: 0.45rem 0.65rem;
      border-radius: 6px;
      width: 100%;
      outline: none;
    }

    .param-input textarea {
      resize: vertical;
      min-height: 60px;
    }

    /* Live Response Console */
    .console-panel {
      position: sticky;
      top: 1.5rem;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.25rem;
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      height: fit-content;
      max-height: calc(100vh - 3rem);
    }

    .console-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 0.75rem;
    }

    .console-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .status-tag {
      font-family: var(--mono);
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 700;
    }

    .status-ok { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-err { background: rgba(239, 68, 68, 0.2); color: #f87171; }

    .console-meta {
      display: flex;
      justify-content: space-between;
      font-family: var(--mono);
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 0.6rem;
    }

    .json-output {
      background: #06080f;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 1rem;
      font-family: var(--mono);
      font-size: 0.82rem;
      color: #e2e8f0;
      overflow: auto;
      max-height: 480px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Footer Section */
    .footer-container {
      margin-top: 4rem;
      padding-top: 2.5rem;
      border-top: 1px solid var(--card-border);
      text-align: center;
    }

    .dev-by {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .dev-name {
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .social-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      border-radius: 9999px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .social-pill:hover {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.4);
      color: #fff;
      transform: translateY(-2px);
    }

    .copyright {
      font-size: 0.8rem;
      color: var(--text-muted);
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
        <span class="badge badge-online">
          <span class="pulse"></span> Atlas Connected
        </span>
      </div>
    </nav>

    <header class="hero">
      <h1>The Data Hub &middot; Live</h1>
      <p>Interactive Cloud REST API Console backed by MongoDB Atlas &amp; Mongoose ODM</p>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Published Posts</div>
        <div class="stat-value" id="stat-posts">${postCount}</div>
        <div class="stat-meta">Post.countDocuments()</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Registered Authors</div>
        <div class="stat-value" id="stat-users">${userCount}</div>
        <div class="stat-meta">User.countDocuments()</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cluster Status</div>
        <div class="stat-value" style="font-size: 1.3rem; color: #34d399;">Active &amp; Ready</div>
        <div class="stat-meta">${dbHost || 'MongoDB Atlas'}</div>
      </div>
    </section>

    <div class="explorer-layout">
      <!-- Left: Interactive Endpoints -->
      <div class="endpoints-list">
        <!-- GET /posts -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-get">GET</span>
              <span>/posts</span>
            </div>
            <button class="btn" onclick="executeCall('/posts')">Execute</button>
          </div>
          <div class="desc">Retrieve all blog posts with populated author profiles.</div>
        </div>

        <!-- GET /posts/recent -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-get">GET</span>
              <span>/posts/recent</span>
            </div>
            <button class="btn" onclick="executeCall('/posts/recent')">Execute</button>
          </div>
          <div class="desc">Retrieve Top 3 newest posts (sort createdAt: -1, limit: 3).</div>
        </div>

        <!-- GET /posts/:id -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-get">GET</span>
              <span>/posts/:id</span>
            </div>
            <button class="btn" onclick="getPostById()">Execute</button>
          </div>
          <div class="desc">Fetch a single post document by 24-char ObjectId.</div>
          <div class="param-input">
            <input type="text" id="get-post-id" placeholder="Paste 24-char ObjectId (loads automatically)" />
          </div>
        </div>

        <!-- POST /posts -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-post">POST</span>
              <span>/posts</span>
            </div>
            <button class="btn" onclick="createPost()">Execute</button>
          </div>
          <div class="desc">Create new post with title validation (3-120 chars) and author reference.</div>
          <div class="param-input">
            <textarea id="post-body">{\n  "title": "Scaling Node.js Microservices with MongoDB",\n  "content": "Architecting resilient message queues and document collections in cloud environments.",\n  "authorId": ""\n}</textarea>
          </div>
        </div>

        <!-- PUT /posts/:id -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-put">PUT</span>
              <span>/posts/:id</span>
            </div>
            <button class="btn" onclick="updatePost()">Execute</button>
          </div>
          <div class="desc">Update post title/content with full schema validation.</div>
          <div class="param-input">
            <input type="text" id="put-post-id" placeholder="Post ObjectId to update" />
          </div>
          <div class="param-input">
            <textarea id="put-body">{\n  "title": "Updated: Scaling Microservices with MongoDB Atlas"\n}</textarea>
          </div>
        </div>

        <!-- DELETE /posts/:id -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-delete">DELETE</span>
              <span>/posts/:id</span>
            </div>
            <button class="btn" onclick="deletePost()">Execute</button>
          </div>
          <div class="desc">Permanently remove post document from MongoDB Atlas.</div>
          <div class="param-input">
            <input type="text" id="delete-post-id" placeholder="Post ObjectId to remove" />
          </div>
        </div>

        <!-- GET /users -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-get">GET</span>
              <span>/users</span>
            </div>
            <button class="btn" onclick="executeCall('/users')">Execute</button>
          </div>
          <div class="desc">List all registered author profiles in the system.</div>
        </div>

        <!-- POST /users -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-post">POST</span>
              <span>/users</span>
            </div>
            <button class="btn" onclick="createUser()">Execute</button>
          </div>
          <div class="desc">Register new author with unique lowercase email address.</div>
          <div class="param-input">
            <textarea id="user-body">{\n  "name": "Dev Tester",\n  "email": "dev.tester@example.com"\n}</textarea>
          </div>
        </div>

        <!-- POST /login -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-post">POST</span>
              <span>/login</span>
            </div>
            <button class="btn" onclick="loginAuth()">Execute</button>
          </div>
          <div class="desc">Mock JWT authentication token generator (Base64URL 3-part).</div>
          <div class="param-input">
            <textarea id="login-body">{\n  "username": "vinayak",\n  \"password\": \"supersecret\"\n}</textarea>
          </div>
        </div>

        <!-- GET /health -->
        <div class="card">
          <div class="card-top">
            <div class="endpoint">
              <span class="m-badge m-get">GET</span>
              <span>/health</span>
            </div>
            <button class="btn" onclick="executeCall('/health')">Execute</button>
          </div>
          <div class="desc">Real-time server telemetry, uptime counter, and database status.</div>
        </div>
      </div>

      <!-- Right: Live Response Console -->
      <div class="console-panel">
        <div class="console-header">
          <div class="console-title">Live Response Inspector</div>
          <div id="status-badge" class="status-tag status-ok">Ready</div>
        </div>
        <div class="console-meta">
          <span id="meta-url">GET /posts</span>
          <span id="meta-time">0 ms</span>
        </div>
        <pre class="json-output" id="output-box">// Click "Execute" on any endpoint to test live against MongoDB Atlas...</pre>
      </div>
    </div>

    <!-- Footer Section with Developer Details -->
    <footer class="footer-container">
      <div class="dev-by">
        <span>Engineered &amp; Developed by</span>
        <span class="dev-name">Vinayak Sharma</span>
      </div>
      <div class="social-links">
        <a class="social-pill" href="https://github.com/vinayak2922k" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <a class="social-pill" href="https://www.linkedin.com/in/vinayak2922k" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          LinkedIn
        </a>
        <a class="social-pill" href="mailto:vinayaksharma2289@gmail.com">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          vinayaksharma2289@gmail.com
        </a>
      </div>
      <div class="copyright">
        The Data Hub &middot; Sprint 10 &middot; Node.js, Express &amp; MongoDB Atlas
      </div>
    </footer>
  </div>

  <script>
    async function executeCall(url, options = {}) {
      const output = document.getElementById('output-box');
      const statusBadge = document.getElementById('status-badge');
      const metaUrl = document.getElementById('meta-url');
      const metaTime = document.getElementById('meta-time');

      const method = options.method || 'GET';
      metaUrl.textContent = method + ' ' + url;
      output.textContent = '// Sending request to ' + url + '...';

      const start = performance.now();
      try {
        const res = await fetch(url, options);
        const duration = Math.round(performance.now() - start);
        metaTime.textContent = duration + ' ms';

        let data;
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        statusBadge.textContent = res.status + ' ' + (res.ok ? 'OK' : 'FAIL');
        statusBadge.className = 'status-tag ' + (res.ok ? 'status-ok' : 'status-err');
        output.textContent = JSON.stringify(data, null, 2);

        // Auto-refresh counters if writing data
        if (['POST', 'DELETE', 'PUT'].includes(method)) {
          refreshCounters();
        }

        return data;
      } catch (err) {
        metaTime.textContent = 'ERR';
        statusBadge.textContent = 'Network Error';
        statusBadge.className = 'status-tag status-err';
        output.textContent = '// Error: ' + err.message;
      }
    }

    async function refreshCounters() {
      try {
        const res = await fetch('/health');
        const json = await res.json();
        if (json && json.data && json.data.totalPosts !== undefined) {
          document.getElementById('stat-posts').textContent = json.data.totalPosts;
        }
      } catch {}
    }

    async function getPostById() {
      const id = document.getElementById('get-post-id').value.trim();
      if (!id) {
        alert('Please enter a Post ID first');
        return;
      }
      executeCall('/posts/' + id);
    }

    async function createPost() {
      try {
        const body = JSON.parse(document.getElementById('post-body').value);
        executeCall('/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (e) {
        alert('Invalid JSON in body: ' + e.message);
      }
    }

    async function updatePost() {
      const id = document.getElementById('put-post-id').value.trim();
      if (!id) {
        alert('Please enter a Post ID to update');
        return;
      }
      try {
        const body = JSON.parse(document.getElementById('put-body').value);
        executeCall('/posts/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (e) {
        alert('Invalid JSON in update body: ' + e.message);
      }
    }

    async function deletePost() {
      const id = document.getElementById('delete-post-id').value.trim();
      if (!id) {
        alert('Please enter a Post ID to delete');
        return;
      }
      executeCall('/posts/' + id, { method: 'DELETE' });
    }

    async function createUser() {
      try {
        const body = JSON.parse(document.getElementById('user-body').value);
        // Make email unique to avoid duplicate error during demo
        if (body.email && body.email.includes('@')) {
          const parts = body.email.split('@');
          body.email = parts[0].replace(/\\d+$/, '') + Math.floor(Math.random() * 900 + 100) + '@' + parts[1];
          document.getElementById('user-body').value = JSON.stringify(body, null, 2);
        }
        executeCall('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (e) {
        alert('Invalid JSON in user body: ' + e.message);
      }
    }

    async function loginAuth() {
      try {
        const body = JSON.parse(document.getElementById('login-body').value);
        executeCall('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (e) {
        alert('Invalid JSON in login body: ' + e.message);
      }
    }

    // Auto-bootstrap working IDs on load
    window.addEventListener('DOMContentLoaded', async () => {
      // 1. Fetch initial posts to populate UI
      const postsRes = await executeCall('/posts');
      if (postsRes && postsRes.data && postsRes.data.length > 0) {
        const firstPost = postsRes.data[0];
        document.getElementById('get-post-id').value = firstPost._id;
        document.getElementById('put-post-id').value = firstPost._id;
        document.getElementById('delete-post-id').value = postsRes.data[postsRes.data.length - 1]._id;

        // Auto-fill authorId into create post template
        const authorId = firstPost.authorId ? (firstPost.authorId._id || firstPost.authorId) : '';
        if (authorId) {
          const postTemplate = {
            title: "Scaling Node.js Microservices with MongoDB",
            content: "Architecting resilient message queues and document collections in cloud environments.",
            authorId: authorId
          };
          document.getElementById('post-body').value = JSON.stringify(postTemplate, null, 2);
        }
      }
    });
  </script>
</body>
</html>`;
};

module.exports = renderLandingPage;
