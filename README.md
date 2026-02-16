# 🧠 CoAi — Real-Time Collaborative Workspace Platform

**CoAi** is a modern web-based collaboration platform inspired by **Slack**, **Notion**, and **Google Docs** — designed for real-time communication, document editing, and seamless teamwork.

Built on the **MERN stack** with **Socket.IO** for real-time updates and deployed using **Kubernetes**, it allows teams to chat, create documents, and work together within shared workspaces with AI-powered assistance.

---

## 🚀 Features

### 🔐 Authentication & Workspaces

* Secure authentication using **Supabase**
* Create and manage multiple workspaces
* Role-based access: **Owner**, **Member**, and **Guest**
* Invite users to join via workspace links

### 💬 Real-Time Chat

* Channel-based communication (e.g., `#general`, `#announcements`)
* Private direct messages
* Typing indicators and online presence
* Powered by **Socket.IO** for live updates

### 📝 Collaborative Document Editing

* Real-time shared text editing across users
* Rich text formatting with CKEditor, TinyMCE, or Froala
* Automatic content syncing
* Document history and version tracking

### 🤖 AI Assistant

* Context-aware AI document enhancer powered by **Google Gemini**
* Chat-driven suggestions (summaries, rewrites, tone adjustments)
* Intelligent content generation and editing assistance

---

## 🧩 Tech Stack

| Layer                   | Technology                                |
| ----------------------- | ----------------------------------------- |
| **Frontend**            | React 19 + Vite 7, TailwindCSS 4          |
| **Backend**             | Node.js + Express                         |
| **Database**            | MongoDB (Mongoose ORM)                    |
| **Authentication**      | Supabase                                  |
| **Real-Time**           | Socket.IO                                 |
| **Rich Text Editors**   | CKEditor, TinyMCE, Froala                 |
| **AI Integration**      | Google Gemini API                         |
| **Containerization**    | Docker (Multi-stage builds)               |
| **Orchestration**       | Kubernetes (Minikube for local dev)       |
| **HTTP Client**         | Axios                                     |
| **AI Integration**      | Google Gemini API                         |
| **Containerization**    | Docker (Multi-stage builds)               |
| **Orchestration**       | Kubernetes (Minikube for local dev)       |
| **HTTP Client**         | Axios                                     |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher) or MongoDB Atlas account
- **Docker** (for containerization)
- **Minikube** and **kubectl** (for Kubernetes deployment)
- **Supabase** account (for authentication)
- **Google Gemini API** key (for AI features)

---

## ⚙️ Installation & Setup

### Option 1: Local Development

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/dochub.git
cd dochub
```

#### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dochub
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

### Option 2: Kubernetes Deployment (Minikube)

#### 1️⃣ Start Minikube

```bash
minikube start
```

#### 2️⃣ Configure Environment Variables

Update the secrets in `k8s/secrets.yaml` with your actual credentials:

```yaml
stringData:
  MONGO_URI: "mongodb://mongodb:27017/dochub"
  FRONTEND_URL: "http://localhost:5173"
  SUPABASE_URL: "your_supabase_project_url"
  VITE_SUPABASE_KEY: "your_supabase_anon_key"
  GEMINI_API_KEY: "your_google_gemini_api_key"
```

Also update `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

#### 3️⃣ Build Docker Images

**Important:** Build images in Minikube's Docker environment:

```bash
# Set Docker environment to Minikube
eval $(minikube docker-env)

# Build backend image
cd server
docker build -t dochub-backend:latest .

# Build frontend image
cd ../frontend
docker build -t dochub-frontend:latest .
```

#### 4️⃣ Apply Kubernetes Manifests

```bash
cd ..
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

#### 5️⃣ Verify Deployment

```bash
# Check pod status
kubectl get pods -n dochub

# Check services
kubectl get services -n dochub
```

#### 6️⃣ Access the Application

```bash
# Open frontend in browser (creates tunnel)
minikube service dochub-frontend -n dochub

# Or use port-forwarding
kubectl port-forward -n dochub service/dochub-frontend 8080:80
# Then visit http://localhost:8080
```

---

## 📁 Project Structure

```
dochub/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth.jsx       # Authentication component
│   │   │   ├── ChatContent.jsx
│   │   │   ├── Document.jsx
│   │   │   ├── home.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   └── dashboard.jsx
│   │   ├── utils/             # Utility functions
│   │   │   └── geminiService.js
│   │   ├── constants/         # App constants
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── dockerfile             # Frontend Docker config
│   ├── nginx.conf             # Nginx configuration
│   └── package.json
│
├── server/                    # Node.js backend API
│   ├── models/                # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── workspace.model.js
│   │   ├── channel.model.js
│   │   ├── message.model.js
│   │   └── document.model.js
│   ├── routes/                # API routes
│   │   ├── workspace.route.js
│   │   ├── channel.route.js
│   │   ├── message.route.js
│   │   ├── document.route.js
│   │   └── ai.route.js
│   ├── services/              # Business logic
│   │   └── gemini.service.js
│   ├── middleware/            # Express middleware
│   ├── server.js              # Main server file
│   ├── Dockerfile             # Backend Docker config
│   └── package.json
│
├── k8s/                       # Kubernetes manifests
│   ├── namespace.yaml         # Namespace definition
│   ├── secrets.yaml           # Secrets (credentials)
│   ├── configmap.yaml         # Configuration data
│   ├── mongodb.yaml           # MongoDB StatefulSet
│   ├── backend.yaml           # Backend deployment
│   └── frontend.yaml          # Frontend deployment
│
└── README.md                  # Project documentation
```

---

## 🔑 Environment Variables

### Backend (`server/.env`)

| Variable           | Description                            | Required |
| ------------------ | -------------------------------------- | -------- |
| `PORT`             | Server port number                     | Yes      |
| `MONGO_URI`        | MongoDB connection string              | Yes      |
| `FRONTEND_URL`     | Frontend application URL               | Yes      |
| `SUPABASE_URL`     | Supabase project URL                   | Yes      |
| `VITE_SUPABASE_KEY`| Supabase anon/public key               | Yes      |
| `GEMINI_API_KEY`   | Google Gemini API key for AI features  | Yes      |

### Frontend (`frontend/.env`)

| Variable              | Description                      | Required |
| --------------------- | -------------------------------- | -------- |
| `VITE_SUPABASE_URL`   | Supabase project URL             | Yes      |
| `VITE_SUPABASE_KEY`   | Supabase anon/public key         | Yes      |
| `VITE_API_URL`        | Backend API base URL             | Yes      |

---

## 🚀 Deployment

### Updating the Application

After making changes, rebuild and redeploy:

```bash
# Rebuild Docker images (in Minikube environment)
eval $(minikube docker-env)
docker build -t dochub-backend:latest ./server
docker build -t dochub-frontend:latest ./frontend

# Restart deployments
kubectl rollout restart deployment/dochub-backend -n dochub
kubectl rollout restart deployment/dochub-frontend -n dochub

# Check rollout status
kubectl rollout status deployment/dochub-frontend -n dochub
kubectl rollout status deployment/dochub-backend -n dochub
```

### Scaling the Application

```bash
# Scale backend replicas
kubectl scale deployment/dochub-backend --replicas=3 -n dochub

# Scale frontend replicas
kubectl scale deployment/dochub-frontend --replicas=3 -n dochub
```

### Viewing Logs

```bash
# View backend logs
kubectl logs -f deployment/dochub-backend -n dochub

# View frontend logs
kubectl logs -f deployment/dochub-frontend -n dochub

# View MongoDB logs
kubectl logs -f statefulset/mongodb -n dochub
```

---

## 🐛 Troubleshooting

### Issue: Supabase Error "supabaseUrl is required"

**Solution:** Ensure `.env` is properly included in the Docker build:
- Remove `.env` from `.dockerignore` (if present)
- Rebuild the frontend image without cache: `docker build --no-cache -t dochub-frontend:latest .`
- Restart the deployment: `kubectl rollout restart deployment/dochub-frontend -n dochub`

### Issue: Pods in ErrImageNeverPull state

**Solution:** Build images in Minikube's Docker environment:
```bash
eval $(minikube docker-env)
docker build -t dochub-backend:latest ./server
docker build -t dochub-frontend:latest ./frontend
```

### Issue: Cannot access the application

**Solution:** Use Minikube tunnel or port-forwarding:
```bash
# Option 1: Minikube service (creates tunnel)
minikube service dochub-frontend -n dochub

# Option 2: Port forwarding
kubectl port-forward -n dochub service/dochub-frontend 8080:80
```

---

## 🔮 Upcoming Enhancements

* ✅ AI-powered writing assistant (Implemented)
* ⬜ Dark mode toggle
* ⬜ Document snapshot comparison
* ⬜ File uploads & shared media
* ⬜ User presence across multiple workspaces
* ⬜ Video/Voice calling integration
* ⬜ Advanced document permissions
* ⬜ Mobile responsive design improvements

---

## 🧑‍💻 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Added awesome feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request 🚀

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Supabase** for authentication infrastructure
- **Google Gemini** for AI capabilities
- **MongoDB** for database solutions
- **Socket.IO** for real-time communication
- **Kubernetes** community for excellent documentation

---

## 📧 Contact

For questions or support, please open an issue or reach out via:
- GitHub Issues: [https://github.com/yourusername/dochub/issues](https://github.com/yourusername/dochub/issues)

---

**Made with ❤️ for collaborative teams everywhere**
#

