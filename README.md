# 🎤 AI Singing Coach

An intelligent web application that helps users improve their singing through AI-powered pitch analysis and personalized coaching feedback.

## 🌟 Features (Post-Development)

### Core Functionality
- **🎵 Pitch Analysis**: Record your singing and receive detailed pitch accuracy measurements
- **🤖 AI-Powered Feedback**: Get personalized coaching advice using LLM reasoning (Claude/GPT)
- **📊 Progress Tracking**: Monitor your improvement over time with visual analytics
- **🎙️ Real-Time Voice Coaching**: Interactive voice sessions with AI coach using LiveKit
- **💾 Session History**: Save and review past performances stored in Supabase

### Intelligent Features
- **Chain-of-Thought Reasoning**: AI analyzes patterns in your singing and explains its diagnostic process
- **Personalized Exercises**: Custom vocal exercises tailored to your specific weaknesses
- **Multi-Step Analysis**:
  1. Pitch detection identifies which notes are off
  2. Pattern recognition finds recurring issues (e.g., consistently flat on high notes)
  3. Root cause analysis (breath support, tension, etc.)
  4. Targeted exercise recommendations
- **Adaptive Learning**: Tracks improvement and adjusts difficulty accordingly

### Technical Highlights
- **Hybrid AI Architecture**: Combines specialized audio ML (pitch detection) with general intelligence (LLM coaching)
- **Real-Time Processing**: Low-latency audio analysis and feedback
- **Full-Stack Integration**: Seamless communication between frontend, backend, and AI services
- **Microservices Architecture**: Dockerized services for easy deployment and scaling

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vite)                       │
│  - Audio Recording                                       │
│  - Pitch Visualization                                   │
│  - Dashboard & Analytics                                 │
│  - LiveKit Voice Interface                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Node.js/Express Backend API                    │
│  - Session Management                                    │
│  - Audio Processing Pipeline                             │
│  - LLM Orchestration                                     │
│  - LiveKit Integration                                   │
└─────────────────────────────────────────────────────────┘
            ↓              ↓              ↓
    ┌─────────────┐  ┌──────────┐  ┌──────────┐
    │  Supabase   │  │  Claude  │  │ LiveKit  │
    │  Database   │  │   API    │  │  Cloud   │
    │             │  │          │  │          │
    │ - Sessions  │  │ - CoT    │  │ - Voice  │
    │ - Progress  │  │   Reasoning│ │   Agent  │
    │ - Users     │  │ - Feedback│ │ - STT/TTS│
    └─────────────┘  └──────────┘  └──────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Web Audio API** for audio recording and visualization
- **LiveKit Components** for real-time voice chat
- **Axios** for API communication
- **Modern CSS** with gradients and glassmorphism

### Backend
- **Node.js** with Express framework
- **TensorFlow/SPICE** or **Web Audio API** for pitch detection
- **Claude API** (Anthropic) for intelligent coaching
- **Supabase JS Client** for database operations
- **LiveKit Server SDK** for voice agent orchestration

### Infrastructure
- **Docker & Docker Compose** for containerization
- **Supabase** (PostgreSQL + Real-time subscriptions)
- **LiveKit Cloud** for WebRTC voice infrastructure
- **Git** for version control

---

## 🚀 Getting Started

### Prerequisites
- Docker Desktop installed
- Git
- Code editor (VS Code recommended)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/ai-singing-coach.git
   cd ai-singing-coach
```

2. **Set up environment variables**
```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your API keys:
   # - ANTHROPIC_API_KEY
   # - SUPABASE_URL
   # - SUPABASE_KEY
   # - LIVEKIT_API_KEY
   # - LIVEKIT_API_SECRET
```

3. **Start the application**
```bash
   docker-compose up --build
```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

---

## 📁 Project Structure
```
ai-singing-coach/
├── docker-compose.yml          # Orchestrates all services
├── README.md                   # This file
├── .gitignore
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js              # Main entry point
│   ├── .env                   # Environment variables
│   ├── routes/
│   │   ├── analyze.js         # Pitch analysis endpoints
│   │   ├── coaching.js        # AI coaching endpoints
│   │   └── sessions.js        # Session management
│   ├── controllers/
│   │   ├── pitchDetection.js  # Pitch detection logic
│   │   ├── llmCoaching.js     # LLM integration
│   │   └── voiceAgent.js      # LiveKit voice agent
│   └── utils/
│       ├── supabase.js        # Database client
│       └── helpers.js         # Utility functions
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── AudioRecorder.jsx
        │   ├── PitchVisualizer.jsx
        │   ├── Dashboard.jsx
        │   ├── VoiceCoach.jsx
        │   └── ProgressTracker.jsx
        ├── services/
        │   └── api.js         # API calls
        └── styles/
            └── ...
```

---

## 🎯 User Journey

### 1. Record & Analyze
```
User → Clicks "Record" → Sings a phrase → Stops recording
     → Pitch detection analyzes notes
     → Results displayed with visual feedback
```

### 2. Get AI Feedback
```
Pitch data → Sent to Claude API with CoT prompt
          → AI analyzes patterns
          → Identifies root causes
          → Suggests specific exercises
          → Returns personalized feedback
```

### 3. Voice Coaching (Optional)
```
User → Clicks "Talk to Coach" → Joins LiveKit room
     → Speaks with AI voice agent
     → AI asks clarifying questions
     → Provides real-time guidance
     → User practices and improves
```

### 4. Track Progress
```
All sessions → Saved to Supabase
            → Dashboard shows improvement trends
            → Celebrates milestones
            → Adjusts recommendations
```

---

## 🔑 Key Features Explained

### Hybrid AI Architecture
Unlike simple pitch detection apps that just show numbers, this app combines:
- **Technical Analysis** (Audio ML): Precise pitch measurements
- **Intelligent Interpretation** (LLM): Understanding WHY issues occur
- **Personalized Coaching** (Voice AI): Interactive guidance

**Example:**
```
Traditional App: "You were 85% accurate"
AI Singing Coach: "You were 85% accurate, and I noticed you're 
                  consistently flat on high notes (F4, E4). This 
                  usually means you need more breath support. Try 
                  the 'hiss exercise' - breathe deeply and hiss 
                  steadily for 20 seconds to build diaphragm strength."
```

### Chain-of-Thought Reasoning
The LLM doesn't just give generic advice. It reasons through the problem:
1. **Pattern Detection**: "User is consistently flat on notes above E4"
2. **Cause Analysis**: "Likely insufficient breath support"
3. **Exercise Selection**: "Recommend breathing exercises over ear training"
4. **Personalization**: "User improved 5% last week, keep current approach"

---

## 🧪 Development Workflow

### Running Services Individually
```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend

# With rebuild
docker-compose up --build
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Installing Packages
```bash
# Backend
docker-compose exec backend npm install <package-name>

# Frontend
docker-compose exec frontend npm install <package-name>
```

### Stopping Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

# AI Services
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx (if using OpenAI instead)

# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx

# Voice
LIVEKIT_URL=wss://xxxxx.livekit.cloud
LIVEKIT_API_KEY=xxxxx
LIVEKIT_API_SECRET=xxxxx
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack development with modern JavaScript
- ✅ Docker containerization and microservices
- ✅ AI/ML integration (pitch detection + LLMs)
- ✅ Real-time communication with WebRTC
- ✅ Database design and real-time subscriptions
- ✅ RESTful API design
- ✅ Prompt engineering and agent orchestration
- ✅ Audio signal processing
- ✅ Product thinking and UX design

---

## 🚧 Development Roadmap

- [x] Project setup with Docker
- [x] Backend API foundation
- [x] React frontend with Vite
- [ ] Supabase database integration
- [ ] Audio recording functionality
- [ ] Pitch detection implementation
- [ ] Claude API integration with CoT prompting
- [ ] Dashboard and analytics
- [ ] LiveKit voice agent
- [ ] Progress tracking
- [ ] User authentication
- [ ] Deployment to cloud

---

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

---

## 👤 Author

**Rabin Dhakal**
- GitHub: [@rabindhakal](https://github.com/ashrotd)
- LinkedIn: [Rabin Dhakal](https://linkedin.com/in/rabinndhakal)
- Email: Dhakalrabin04@gmail.com

---

## 🙏 Acknowledgments

- **Anthropic Claude** for intelligent coaching
- **LiveKit** for real-time voice infrastructure
- **Supabase** for backend-as-a-service
- **TensorFlow** for pitch detection models
- Inspiration from modern EdTech and music learning platforms

---

## 📸 Screenshots

*Coming soon after UI development*

