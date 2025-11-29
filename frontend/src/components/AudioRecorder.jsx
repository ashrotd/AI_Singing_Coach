

import { useState, useRef, useEffect } from 'react';
import { createSession, getCoachingFeedback } from '../services/api';
import './AudioRecorder.css';

function AudioRecorder({ onSessionCreated }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      // Stop recording and release microphone when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Browser-supported format
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio data as it's recorded
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording stops, create audio file
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Stop timer
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop microphone stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        clearInterval(timerIntervalRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  const discardRecording = () => {
    setAudioURL(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };
  const saveRecording = async () => {
    if (!audioURL) return;

    setIsProcessing(true);

    try {
      // STEP 1: Generate mock pitch data and score
      // (In production, you'd use real pitch detection algorithms)
      const mockPitchData = {
        notes: [
          { pitch: 440, note: 'A4', accuracy: Math.floor(Math.random() * 20) + 80 },
          { pitch: 493.88, note: 'B4', accuracy: Math.floor(Math.random() * 20) + 80 },
          { pitch: 523.25, note: 'C5', accuracy: Math.floor(Math.random() * 20) + 80 }
        ]
      };

      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100

      // STEP 2: Get AI coaching feedback
      console.log('🤖 Getting AI coaching feedback...');
      const coachingResult = await getCoachingFeedback({
        score: mockScore,
        pitch_data: mockPitchData,
        duration_seconds: recordingTime
      });

      // Extract feedback text from coaching result
      let feedbackText = 'Great job singing!';
      if (coachingResult.coaching) {
        feedbackText = coachingResult.coaching.summary;
      }

      // STEP 3: Create session with AI feedback
      const sessionData = {
        audio_url: `recording_${Date.now()}.webm`, // In real app: upload to storage first
        pitch_data: mockPitchData,
        duration_seconds: recordingTime,
        score: mockScore,
        feedback: feedbackText
      };

      const newSession = await createSession(sessionData);

      // Show success message
      const aiStatus = coachingResult.using_ai ? 'AI' : 'Mock';
      alert(`Recording saved with ${aiStatus} feedback!`);

      // Clear recording
      discardRecording();

      // Notify parent component
      if (onSessionCreated) {
        onSessionCreated(newSession);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error saving recording:', error);
      alert('Failed to save recording. Please try again.');
      setIsProcessing(false);
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder">
      <h2>🎙️ Record Your Singing</h2>

      {/* Recording Timer */}
      <div className={`timer ${isRecording ? 'recording' : ''}`}>
        {formatTime(recordingTime)}
      </div>

      {/* Recording Controls */}
      {!audioURL && (
        <div className="recording-controls">
          {!isRecording ? (
            <button className="btn-record" onClick={startRecording}>
              🔴 Start Recording
            </button>
          ) : (
            <>
              <button className="btn-pause" onClick={togglePause}>
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button className="btn-stop" onClick={stopRecording}>
                ⏹️ Stop
              </button>
            </>
          )}
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="recording-status">
          <div className="pulse-dot"></div>
          <span>{isPaused ? 'Paused' : 'Recording...'}</span>
        </div>
      )}

      {/* Playback Controls */}
      {audioURL && !isRecording && (
        <div className="playback-section">
          <h3>Recording Complete!</h3>

          <audio controls src={audioURL} className="audio-player">
            Your browser does not support the audio element.
          </audio>

          <div className="playback-info">
            Duration: {formatTime(recordingTime)}
          </div>

          <div className="playback-actions">
            <button
              className="btn-save"
              onClick={saveRecording}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Saving...' : '💾 Save Recording'}
            </button>
            <button
              className="btn-discard"
              onClick={discardRecording}
              disabled={isProcessing}
            >
              🗑️ Discard
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="recording-tips">
        <h4>Recording Tips:</h4>
        <ul>
          <li>Find a quiet space</li>
          <li>Position yourself 6-12 inches from the microphone</li>
          <li>Sing a scale or your favorite song</li>
          <li>Record for at least 10 seconds for best analysis</li>
        </ul>
      </div>
    </div>
  );
}

export default AudioRecorder;
