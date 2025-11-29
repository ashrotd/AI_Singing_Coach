# 🧪 Testing Your API Endpoints

This guide shows you how to test your backend API without needing the frontend yet.

## Prerequisites

1. **Run the setup.sql file in Supabase**
   - Go to your Supabase dashboard: https://kozarnscaktkokyjdebe.supabase.co
   - Click "SQL Editor" in the left sidebar
   - Copy and paste the entire contents of `backend/database/setup.sql`
   - Click "Run" to execute
   - You should see success messages

2. **Start your backend server**
   ```bash
   cd backend
   npm run dev
   ```

   You should see:
   ```
   🚀 Server running on http://localhost:3001
   ✅ Supabase connected successfully!
   ```

---

## Testing Methods

### Option 1: Using cURL (Command Line)

Open a new terminal and run these commands:

#### 1. Test Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "AI Singing Coach API is running!",
  "timestamp": "2024-11-27T...",
  "supabase": "connected"
}
```

---

#### 2. Create a New Session (POST)
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://example.com/recording1.mp3",
    "pitch_data": {
      "notes": [
        {"pitch": 440, "accuracy": 95},
        {"pitch": 493, "accuracy": 88}
      ]
    },
    "score": 92,
    "duration_seconds": 30
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "audio_url": "https://example.com/recording1.mp3",
    "pitch_data": { ... },
    "score": 92,
    "created_at": "2024-11-27T..."
  }
}
```

---

#### 3. Get All Sessions (GET)
```bash
curl http://localhost:3001/api/sessions
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-...",
      "audio_url": "https://example.com/recording1.mp3",
      "score": 92,
      ...
    }
  ],
  "count": 1
}
```

---

#### 4. Get a Specific Session by ID
Replace `SESSION_ID` with an actual ID from step 2:
```bash
curl http://localhost:3001/api/sessions/SESSION_ID
```

---

#### 5. Update a Session (PUT)
```bash
curl -X PUT http://localhost:3001/api/sessions/SESSION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Great job! Your pitch was accurate on high notes.",
    "score": 95
  }'
```

---

#### 6. Delete a Session (DELETE)
```bash
curl -X DELETE http://localhost:3001/api/sessions/SESSION_ID
```

---

### Option 2: Using Your Browser

For GET requests, you can simply paste URLs in your browser:

1. **Health Check**: http://localhost:3001/api/health
2. **Get All Sessions**: http://localhost:3001/api/sessions
3. **Root Route**: http://localhost:3001/

---

### Option 3: Using Postman (Recommended for Beginners)

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create a new request**
3. **Test each endpoint:**

#### Create Session
- Method: POST
- URL: `http://localhost:3001/api/sessions`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "audio_url": "https://example.com/recording1.mp3",
    "pitch_data": {
      "notes": [
        {"pitch": 440, "accuracy": 95}
      ]
    },
    "score": 92,
    "duration_seconds": 30
  }
  ```

#### Get All Sessions
- Method: GET
- URL: `http://localhost:3001/api/sessions`

---

## 🎯 Learning Exercise: Create Multiple Sessions

Try creating 3 sessions with different scores to simulate progress:

**Session 1 (Beginner):**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://example.com/day1.mp3",
    "score": 70,
    "duration_seconds": 45,
    "feedback": "Keep practicing! Focus on breath support."
  }'
```

**Session 2 (Improving):**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://example.com/day2.mp3",
    "score": 82,
    "duration_seconds": 50,
    "feedback": "Better! Your pitch accuracy improved."
  }'
```

**Session 3 (Advanced):**
```bash
curl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://example.com/day3.mp3",
    "score": 94,
    "duration_seconds": 55,
    "feedback": "Excellent work! Nearly perfect pitch."
  }'
```

Then retrieve all sessions:
```bash
curl http://localhost:3001/api/sessions
```

You should see all 3 sessions in reverse chronological order!

---

## 🔍 Understanding the Response

### Success Response Structure:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Error Response Structure:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 📊 Verify in Supabase Dashboard

1. Go to your Supabase dashboard
2. Click "Table Editor" in the left sidebar
3. Select the "sessions" table
4. You should see all the sessions you created!

---

## ✅ Success Checklist

- [ ] Backend server is running
- [ ] Database tables are created in Supabase
- [ ] Health check returns "ok"
- [ ] Can create a session (POST)
- [ ] Can retrieve sessions (GET)
- [ ] Can see sessions in Supabase dashboard

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:** Make sure your backend is running with `npm run dev`

### Issue: "Supabase connection failed"
**Solution:** Check your `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`

### Issue: "Table doesn't exist"
**Solution:** Run the `setup.sql` file in Supabase SQL Editor

### Issue: "CORS error"
**Solution:** Make sure CORS is enabled in server.js (it should be already)

---

## 📚 What You Just Learned

1. ✅ **REST API basics**: GET, POST, PUT, DELETE
2. ✅ **CRUD operations**: Create, Read, Update, Delete
3. ✅ **Request/Response cycle**: How data flows
4. ✅ **JSON format**: Standard data format for APIs
5. ✅ **API testing**: Multiple ways to test endpoints
6. ✅ **Database integration**: How backend talks to Supabase

---

## 🎓 Next Steps

Once your API is working:
1. Create a frontend component to display sessions
2. Add audio recording functionality
3. Integrate pitch detection
4. Connect Claude AI for feedback

**Current Progress:** Backend API ✅ | Frontend 🔄 | AI Integration ⏳
