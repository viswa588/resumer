import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true
});

export const analyzeInterview = async (audioTranscript) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer. Analyze the candidate's response and provide scoring and feedback."
        },
        {
          role: "user",
          content: `Please analyze this interview response and provide a score out of 10 and detailed feedback: ${audioTranscript}`
        }
      ],
      model: "gpt-4",
    });

    return {
      score: completion.choices[0].message.content,
      feedback: completion.choices[0].message.content
    };
  } catch (error) {
    console.error('Error analyzing interview:', error);
    throw error;
  }
};