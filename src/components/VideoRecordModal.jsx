import React, { useState, useRef } from 'react';
import { FaVideo, FaMicrophone, FaPlay, FaPause, FaStop, FaRedo } from 'react-icons/fa';
import { transcribeAudio } from '../services/transcription';
import { analyzeInterview } from '../services/openai';

const VideoRecordModal = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedMedia, setRecordedMedia] = useState(null);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const constraints = {
        video: !isAudioOnly,
        audio: true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: isAudioOnly ? 'audio/webm' : 'video/webm' 
        });
        setRecordedMedia(URL.createObjectURL(blob));
        stopAllTracks();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Unable to access media devices. Please ensure you have given permission.');
    }
  };

  const stopAllTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Get the recorded blob and transcribe
      const blob = new Blob(chunksRef.current, { 
        type: isAudioOnly ? 'audio/webm' : 'video/webm' 
      });
      
      try {
        setIsAnalyzing(true);
        // Required to do changes -- Viswa
        // const transcript = await transcribeAudio(blob);
        // const analysis = await analyzeInterview(transcript);
        // setAnalysisResult(analysis);
      } catch (error) {
        console.error('Error analyzing interview:', error);
        alert('Failed to analyze interview. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleClose = () => {
    stopRecording();
    stopAllTracks();
    setRecordedMedia(null);
    setAnalysisResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Record {isAudioOnly ? 'Audio' : 'Video'}</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {recordedMedia ? (
            <div className="w-full">
              {isAudioOnly ? (
                <audio src={recordedMedia} controls className="w-full" />
              ) : (
                <video src={recordedMedia} controls className="w-full" />
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
              {isRecording ? (
                <div className="text-red-500 text-lg">Recording...</div>
              ) : (
                <div className="text-gray-500 text-lg">Ready to record</div>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="w-full text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Analyzing interview response...</p>
            </div>
          )}

          {analysisResult && (
            <div className="w-full bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="text-xl font-semibold mb-2">Interview Analysis</h3>
              <div className="mb-2">
                <span className="font-medium">Score: </span>
                <span className="text-blue-600">{analysisResult.score}/10</span>
              </div>
              <div>
                <span className="font-medium">Feedback: </span>
                <p className="mt-1 text-gray-700">{analysisResult.feedback}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            {!isRecording && !recordedMedia && (
              <>
                <button
                  onClick={() => setIsAudioOnly(!isAudioOnly)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {isAudioOnly ? <FaVideo /> : <FaMicrophone />}
                  <span>Switch to {isAudioOnly ? 'Video' : 'Audio'}</span>
                </button>
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaVideo />
                  <span>Start Recording</span>
                </button>
              </>
            )}

            {isRecording && (
              <>
                {isPaused ? (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <FaPlay />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <FaPause />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaStop />
                  <span>Stop</span>
                </button>
              </>
            )}

            {recordedMedia && (
              <button
                onClick={() => {
                  setRecordedMedia(null);
                  setIsRecording(false);
                  setIsPaused(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaRedo />
                <span>Record Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecordModal;