import { pipeline } from '@xenova/transformers';

let transcriber = null;

export const transcribeAudio = async (audioBlob) => {
  try {
    if (!transcriber) {
      transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
    }

    // Convert blob to array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    // Convert array buffer to Float32Array
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const float32Array = audioBuffer.getChannelData(0);

    // Perform transcription
    const result = await transcriber(float32Array, {
      chunk_length_s: 30,
      stride_length_s: 5,
    });

    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};