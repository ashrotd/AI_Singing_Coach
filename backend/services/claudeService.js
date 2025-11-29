const Anthropic = require('@anthropic-ai/sdk');


// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key-for-development',
});

// Check if API key is configured
const isConfigured = () => {
  return process.env.ANTHROPIC_API_KEY &&
         process.env.ANTHROPIC_API_KEY !== 'dummy-key-for-development' &&
         !process.env.ANTHROPIC_API_KEY.includes('your-key-here');
};

/**
 * Analyzes singing session data and generates personalized coaching feedback
 * @param {Object} sessionData - The singing session data
 * @param {number} sessionData.score - Overall score (0-100)
 * @param {Object} sessionData.pitch_data - Pitch analysis data
 * @param {number} sessionData.duration_seconds - Recording duration
 * @returns {Promise<Object>} - Coaching feedback with analysis
 */
const generateCoachingFeedback = async (sessionData) => {
  // If API key not configured, return mock feedback
  if (!isConfigured()) {
    console.log('⚠️ Anthropic API key not configured. Using mock feedback.');
    return getMockFeedback(sessionData);
  }

  try {
    const { score, pitch_data, duration_seconds } = sessionData;

    // ============================================
    // CONSTRUCT THE PROMPT
    // ============================================
    // This is "prompt engineering" - how we ask Claude for help

    const prompt = `You are an expert vocal coach with years of experience. You're analyzing a singing session and need to provide constructive, encouraging feedback.

**Session Data:**
- Overall Score: ${score}/100
- Recording Duration: ${duration_seconds} seconds
- Pitch Data: ${JSON.stringify(pitch_data, null, 2)}

**Your Task:**
Analyze this singing session using your expertise as a vocal coach. Follow these steps in your thinking (but don't show these steps to the student):

1. **Pattern Analysis**: What patterns do you notice in the pitch accuracy? Are they consistent or inconsistent? Better on certain notes?

2. **Root Cause**: Based on the patterns, what is likely causing any issues? (breath support, tension, range limitations, etc.)

3. **Strengths**: What did they do well? Be specific and encouraging.

4. **Improvement Areas**: What's the main thing they should focus on?

5. **Exercise Recommendation**: What specific vocal exercise would help most?

Now provide your coaching feedback in a warm, encouraging tone. Structure your response as JSON:

{
  "summary": "Brief overall assessment (2-3 sentences)",
  "strengths": ["strength 1", "strength 2"],
  "areas_to_improve": ["area 1", "area 2"],
  "recommended_exercises": [
    {
      "name": "Exercise name",
      "description": "What it helps with",
      "instructions": "How to do it"
    }
  ],
  "encouragement": "Personal encouraging message",
  "next_session_focus": "What to focus on next time"
}

Remember: Be specific, encouraging, and actionable. The student wants to improve!`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the response
    const responseText = message.content[0].text;

    // Try to parse as JSON
    let feedback;
    try {
      // Extract JSON from response (Claude sometimes adds markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured response from text
        feedback = {
          summary: responseText,
          strengths: [],
          areas_to_improve: [],
          recommended_exercises: [],
          encouragement: 'Keep practicing!',
          next_session_focus: 'Continue working on the areas mentioned above.'
        };
      }
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      feedback = {
        summary: responseText,
        strengths: [],
        areas_to_improve: [],
        recommended_exercises: [],
        encouragement: 'Keep practicing!',
        next_session_focus: 'Continue working on the areas mentioned above.'
      };
    }

    return {
      success: true,
      feedback: feedback,
      model: 'claude-3-5-sonnet-20241022',
      tokens_used: message.usage.input_tokens + message.usage.output_tokens
    };

  } catch (error) {
    console.error('Error calling Claude API:', error);

    // Return mock feedback as fallback
    return {
      success: false,
      error: error.message,
      feedback: getMockFeedback(sessionData),
      fallback: true
    };
  }
};

const getMockFeedback = (sessionData) => {
  const { score } = sessionData;

  // Generate feedback based on score
  let summary, strengths, areas, encouragement;

  if (score >= 90) {
    summary = "Excellent performance! Your pitch accuracy is outstanding and shows great vocal control.";
    strengths = ["Exceptional pitch accuracy", "Strong breath support", "Consistent tone quality"];
    areas = ["Explore expanding your vocal range", "Work on dynamic variation"];
    encouragement = "You're doing amazingly well! Keep pushing your boundaries.";
  } else if (score >= 75) {
    summary = "Good job! You demonstrate solid vocal fundamentals with room for refinement.";
    strengths = ["Good overall pitch control", "Decent breath management"];
    areas = ["Improve accuracy on higher notes", "Work on sustaining longer phrases"];
    encouragement = "You're making great progress! Consistent practice will take you to the next level.";
  } else if (score >= 60) {
    summary = "You're on the right track! Focus on the fundamentals to build a stronger foundation.";
    strengths = ["Good effort and persistence", "Some accurate note transitions"];
    areas = ["Strengthen breath support", "Work on pitch accuracy", "Practice scales regularly"];
    encouragement = "Every great singer started where you are. Keep practicing daily!";
  } else {
    summary = "Great start! Let's focus on building your fundamentals with simple exercises.";
    strengths = ["You're taking the first steps", "Willingness to practice"];
    areas = ["Master basic breath control", "Practice matching single notes", "Build confidence"];
    encouragement = "Remember, every expert was once a beginner. You've got this!";
  }

  return {
    summary,
    strengths,
    areas_to_improve: areas,
    recommended_exercises: [
      {
        name: "Breathing Exercise - Hiss Technique",
        description: "Builds diaphragm strength and breath control",
        instructions: "1. Stand up straight\n2. Take a deep breath through your nose\n3. Exhale slowly making a 'sssss' sound\n4. Try to sustain for 20 seconds\n5. Repeat 5 times daily"
      },
      {
        name: "Pitch Matching",
        description: "Improves accuracy by matching reference tones",
        instructions: "1. Play a note on piano or app\n2. Sing 'ah' to match the pitch\n3. Hold steady for 5 seconds\n4. Practice with C4, D4, E4, F4, G4"
      }
    ],
    encouragement,
    next_session_focus: "Focus on breath control and matching single notes accurately."
  };
};

/**
 * Generates a simple text summary for quick display
 * @param {Object} sessionData - The singing session data
 * @returns {Promise<string>} - Short feedback text
 */
const generateSimpleFeedback = async (sessionData) => {
  const result = await generateCoachingFeedback(sessionData);
  return result.feedback.summary;
};

module.exports = {
  generateCoachingFeedback,
  generateSimpleFeedback,
  isConfigured
};
