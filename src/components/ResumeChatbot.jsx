import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ResumeChatbot = ({ isOpen, onClose, onSuggestion, section }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hi! I'm your Resume AI Assistant. I can help you improve your ${section || 'resume'}. What would you like help with?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response based on the section
    setTimeout(() => {
      let response;
      
      if (section === 'summary') {
        response = generateSummaryResponse(input);
      } else if (section === 'experience') {
        response = generateExperienceResponse(input);
      } else if (section === 'education') {
        response = generateEducationResponse(input);
      } else if (section === 'skills') {
        response = generateSkillsResponse(input);
      } else {
        response = generateGeneralResponse(input);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUseSuggestion = (suggestion) => {
    if (onSuggestion) {
      onSuggestion(suggestion);
    }
    onClose();
  };

  // Response generators for different sections
  const generateSummaryResponse = (query) => {
    const summaries = [
      "Results-driven professional with 5+ years of experience in [industry]. Skilled in [skill1], [skill2], and [skill3] with a proven track record of [achievement]. Seeking to leverage my expertise in [area] to drive success at [target company].",
      "Detail-oriented [job title] with expertise in [area] and a passion for [industry/field]. Demonstrated success in [achievement] resulting in [specific metric]. Adept at [skill] and committed to delivering high-quality results in fast-paced environments.",
      "Innovative [job title] with [X] years of experience in developing creative solutions for [industry-specific] challenges. Proven ability to [key strength] while [another strength]. Recognized for [achievement or recognition]."
    ];
    
    if (query.toLowerCase().includes('example') || query.toLowerCase().includes('suggestion')) {
      return `Here's a professional summary template you can customize:\n\n"${summaries[Math.floor(Math.random() * summaries.length)]}"\n\nWould you like to use this as a starting point? You can click the 'Use This' button to add it to your resume.`;
    } else if (query.toLowerCase().includes('help') || query.toLowerCase().includes('tip')) {
      return "For a strong professional summary, focus on your most relevant skills and achievements. Keep it concise (3-5 sentences), use active language, and tailor it to the job you're applying for. Avoid generic statements and include specific accomplishments with metrics when possible.";
    } else {
      return "Your professional summary should highlight your key qualifications and career goals. Would you like me to provide an example template, or do you have a specific question about writing your summary?";
    }
  };

  const generateExperienceResponse = (query) => {
    const experiences = [
      "• Increased [metric] by [percentage]% through implementation of [strategy or tool]\n• Led a team of [number] professionals in delivering [project] on time and under budget\n• Developed and executed [strategy] resulting in [specific outcome]",
      "• Streamlined [process] which reduced [negative outcome] by [percentage]%\n• Collaborated with cross-functional teams to deliver [project/outcome]\n• Managed [responsibility] with a budget of $[amount], achieving [result]",
      "• Spearheaded the development of [project/initiative] that [specific achievement]\n• Recognized for excellence in [area], receiving [award/recognition]\n• Consistently exceeded [metric] targets by [percentage]% through [method]"
    ];
    
    if (query.toLowerCase().includes('bullet') || query.toLowerCase().includes('point')) {
      return `Here are some strong bullet points you can adapt for your experience section:\n\n${experiences[Math.floor(Math.random() * experiences.length)]}\n\nWould you like to use these bullet points? Click 'Use This' to add them to your resume.`;
    } else if (query.toLowerCase().includes('action') || query.toLowerCase().includes('verb')) {
      return "Strong action verbs for your experience section include: Achieved, Implemented, Developed, Led, Managed, Created, Designed, Increased, Reduced, Negotiated, Coordinated, Streamlined, Launched, Generated, and Transformed. Using these verbs helps make your accomplishments more impactful.";
    } else {
      return "For your work experience section, focus on achievements rather than just duties. Would you like me to provide example bullet points, suggest action verbs, or help with something specific about your experience section?";
    }
  };

  const generateEducationResponse = (query) => {
    if (query.toLowerCase().includes('format') || query.toLowerCase().includes('structure')) {
      return "For your education section, include: Degree name, institution name, location, graduation date (month/year), relevant coursework (optional), GPA if above 3.5 (optional), and academic achievements or honors. List your most recent education first.";
    } else if (query.toLowerCase().includes('course') || query.toLowerCase().includes('relevant')) {
      return "When listing relevant coursework, focus on classes that directly relate to the job you're applying for. For example, if applying for a data analyst position, mention courses like Statistics, Data Visualization, or Database Management. Only include 4-6 of your most relevant courses.";
    } else {
      return "Your education section should be concise but informative. Would you like advice on how to format this section, what to include, or how to highlight relevant coursework?";
    }
  };

  const generateSkillsResponse = (query) => {
    if (query.toLowerCase().includes('technical') || query.toLowerCase().includes('hard')) {
      return "Technical skills should be specific and verifiable. Instead of 'Programming,' list specific languages like 'Python, JavaScript, SQL.' Consider organizing skills by category (e.g., Programming Languages, Software, Methodologies) and list the most relevant skills first based on the job description.";
    } else if (query.toLowerCase().includes('soft') || query.toLowerCase().includes('personal')) {
      return "Valuable soft skills to include: Communication, Leadership, Problem-solving, Time management, Teamwork, Adaptability, Critical thinking, Conflict resolution, Emotional intelligence, and Creativity. Only include soft skills you can demonstrate through examples in your experience section.";
    } else {
      return "For your skills section, include a mix of technical (hard) skills and interpersonal (soft) skills relevant to the position. Would you like suggestions for technical skills, soft skills, or advice on how to organize this section?";
    }
  };

  const generateGeneralResponse = (query) => {
    if (query.toLowerCase().includes('ats') || query.toLowerCase().includes('applicant tracking')) {
      return "To make your resume ATS-friendly: 1) Use standard section headings (Experience, Education, Skills), 2) Include keywords from the job description, 3) Avoid tables, headers/footers, and complex formatting, 4) Use standard fonts like Arial or Calibri, 5) Submit in PDF format unless specified otherwise, and 6) Don't use text boxes or graphics that ATS systems can't read.";
    } else if (query.toLowerCase().includes('length') || query.toLowerCase().includes('page')) {
      return "For most professionals, a 1-page resume is ideal. If you have more than 10 years of relevant experience, 2 pages may be appropriate. Focus on your most recent and relevant experience, and be concise with your language. Remove outdated experience (typically beyond 10-15 years) unless highly relevant.";
    } else if (query.toLowerCase().includes('format') || query.toLowerCase().includes('template')) {
      return "The best resume format depends on your experience. Chronological format works well for consistent career progression. Functional format highlights skills over experience (good for career changers). Combination format blends both approaches. Regardless of format, ensure clean design, consistent formatting, and adequate white space.";
    } else {
      return "I can help with various aspects of your resume, such as improving specific sections, formatting advice, or ATS optimization. What specific part of your resume would you like help with?";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col h-[500px] max-h-[80vh]">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center">
            <FaRobot className="text-blue-500 mr-2" />
            <h3 className="font-semibold">Resume AI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && message.content.includes('Use This') && (
                  <Button 
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleUseSuggestion(message.content)}
                  >
                    Use This
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for resume advice..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <FaPaperPlane />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeChatbot;