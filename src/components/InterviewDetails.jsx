import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { FaArrowLeft, FaUserTie, FaCalendarAlt, FaVideo, FaCommentAlt, FaMicrophone, FaFileAlt, FaChartBar } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';

// Mock data for a single interview
const mockInterviewData = {
  1: {
    id: 1,
    candidateName: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    status: 'completed',
    score: 87,
    date: '2023-11-20',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    transcript: `
Interviewer: Hello Sarah, thank you for joining us today. Could you start by telling us about your experience with React?

Sarah: Hi, thank you for having me. I've been working with React for about 5 years now. I started using it at my previous company where I built several enterprise applications. I'm particularly experienced with hooks, context API, and Redux for state management. I've also worked extensively with React Router for handling navigation in single-page applications.

Interviewer: That's great. Could you describe a challenging problem you solved using React?

Sarah: One of the most challenging projects I worked on was building a real-time dashboard that needed to display data from multiple sources with different update frequencies. The challenge was maintaining performance while handling frequent updates. I implemented a custom memoization strategy using React.memo and useMemo to prevent unnecessary re-renders. I also used web workers to handle data processing off the main thread, which significantly improved the UI responsiveness.

Interviewer: How do you approach testing in React applications?

Sarah: I'm a strong believer in comprehensive testing. I typically use Jest as my test runner along with React Testing Library for component tests. For complex components, I write unit tests for individual functions and integration tests for the component as a whole. I also use Cypress for end-to-end testing of critical user flows. I aim for at least 80% test coverage, focusing on business-critical paths.

Interviewer: How do you stay updated with the latest developments in frontend technologies?

Sarah: I follow several React and JavaScript blogs and newsletters. I'm active on Twitter where I follow key React team members and community leaders. I also attend local meetups and conferences when possible. I dedicate a few hours each week to experiment with new libraries or techniques in small side projects. Recently, I've been exploring React Server Components and the new React concurrent features.
    `,
    skillScores: {
      technical: 85,
      communication: 90,
      problemSolving: 82,
      teamwork: 88,
      leadership: 75
    },
    sentimentScore: 92,
    keywordMatch: 78,
    clarityScore: 85,
    interviewType: 'video',
    questions: [
      {
        question: "Tell us about your experience with React",
        answer: "I've been working with React for about 5 years now. I started using it at my previous company where I built several enterprise applications. I'm particularly experienced with hooks, context API, and Redux for state management.",
        score: 90,
        keywords: ["React", "hooks", "context API", "Redux", "state management"]
      },
      {
        question: "Describe a challenging problem you solved using React",
        answer: "One of the most challenging projects I worked on was building a real-time dashboard that needed to display data from multiple sources with different update frequencies. I implemented a custom memoization strategy using React.memo and useMemo to prevent unnecessary re-renders.",
        score: 85,
        keywords: ["real-time", "performance", "memoization", "React.memo", "useMemo"]
      },
      {
        question: "How do you approach testing in React applications?",
        answer: "I use Jest as my test runner along with React Testing Library for component tests. For complex components, I write unit tests for individual functions and integration tests for the component as a whole. I also use Cypress for end-to-end testing.",
        score: 88,
        keywords: ["Jest", "React Testing Library", "unit tests", "integration tests", "Cypress"]
      }
    ]
  },
  3: {
    id: 3,
    candidateName: 'Emily Rodriguez',
    position: 'DevOps Engineer',
    status: 'completed',
    score: 92,
    date: '2023-11-18',
    videoUrl: 'https://player.vimeo.com/video/59777392',
    transcript: `
Interviewer: Hello Emily, thanks for joining us today. Could you tell us about your experience with CI/CD pipelines?

Emily: Hello! I've been working with CI/CD pipelines for about 6 years. I've implemented and maintained pipelines using Jenkins, GitLab CI, and more recently GitHub Actions. I've set up pipelines for various types of applications including microservices, monoliths, and serverless applications.

Interviewer: Great. Could you describe a complex DevOps challenge you've faced and how you solved it?

Emily: One of the most challenging projects I worked on was migrating a large monolithic application with over 50 microservices from an on-premise infrastructure to AWS. The main challenge was ensuring zero downtime during the migration. I implemented a blue-green deployment strategy and used AWS Route 53 for traffic management. I also created detailed rollback procedures and automated health checks to quickly identify and address any issues.

Interviewer: How do you approach infrastructure as code?

Emily: I'm a strong advocate for infrastructure as code. I primarily use Terraform for provisioning cloud resources and Ansible for configuration management. I follow a modular approach, creating reusable modules for common infrastructure patterns. All infrastructure code goes through the same review process as application code, with automated tests and validation in a staging environment before production deployment.

Interviewer: How do you handle security in your DevOps practices?

Emily: Security is integrated into every stage of our pipeline. I use tools like SonarQube and Snyk for static code analysis and dependency scanning. Infrastructure code is scanned using tools like tfsec for Terraform. We also use HashiCorp Vault for secrets management and implement least privilege access principles across all systems. Regular security audits and penetration testing are part of our release cycle.
    `,
    skillScores: {
      technical: 95,
      communication: 88,
      problemSolving: 94,
      teamwork: 85,
      leadership: 80
    },
    sentimentScore: 88,
    keywordMatch: 92,
    clarityScore: 90,
    interviewType: 'voice',
    questions: [
      {
        question: "Tell us about your experience with CI/CD pipelines",
        answer: "I've been working with CI/CD pipelines for about 6 years. I've implemented and maintained pipelines using Jenkins, GitLab CI, and more recently GitHub Actions.",
        score: 92,
        keywords: ["CI/CD", "Jenkins", "GitLab CI", "GitHub Actions"]
      },
      {
        question: "Describe a complex DevOps challenge you've faced",
        answer: "Migrating a large monolithic application with over 50 microservices from an on-premise infrastructure to AWS. I implemented a blue-green deployment strategy and used AWS Route 53 for traffic management.",
        score: 95,
        keywords: ["migration", "microservices", "AWS", "blue-green deployment", "Route 53"]
      },
      {
        question: "How do you approach infrastructure as code?",
        answer: "I primarily use Terraform for provisioning cloud resources and Ansible for configuration management. I follow a modular approach, creating reusable modules for common infrastructure patterns.",
        score: 90,
        keywords: ["Terraform", "Ansible", "infrastructure as code", "modules"]
      }
    ]
  }
};

// Interview Type Icon
const InterviewTypeIcon = ({ type }) => {
  const typeConfig = {
    video: { icon: <FaVideo className="h-4 w-4" />, label: 'Video' },
    chat: { icon: <FaCommentAlt className="h-4 w-4" />, label: 'Chat' },
    voice: { icon: <FaMicrophone className="h-4 w-4" />, label: 'Voice' },
  };

  return (
    <div className="flex items-center text-gray-500 text-sm">
      {typeConfig[type].icon}
      <span className="ml-1">{typeConfig[type].label}</span>
    </div>
  );
};

// Spider/Radar Chart Component for Skills
const SpiderChart = ({ skills }) => {
  const maxValue = 100;
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  
  // Calculate points on the radar
  const points = Object.entries(skills).map(([skill, value], index) => {
    const angle = (Math.PI * 2 * index) / Object.keys(skills).length;
    const x = centerX + radius * Math.cos(angle) * (value / maxValue);
    const y = centerY + radius * Math.sin(angle) * (value / maxValue);
    return { x, y, skill, value };
  });
  
  // Create the polygon points string
  const polygonPoints = points.map(point => `${point.x},${point.y}`).join(' ');
  
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200">
          {/* Background circles */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={radius * 0.75} fill="none" stroke="#e5e7eb" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="none" stroke="#e5e7eb" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={radius * 0.25} fill="none" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Axis lines */}
          {Object.keys(skills).map((skill, index) => {
            const angle = (Math.PI * 2 * index) / Object.keys(skills).length;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line 
                key={skill} 
                x1={centerX} 
                y1={centerY} 
                x2={x} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
              />
            );
          })}
          
          {/* Data polygon */}
          <polygon 
            points={polygonPoints} 
            fill="rgba(79, 70, 229, 0.2)" 
            stroke="#4f46e5" 
            strokeWidth="2" 
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle 
              key={index} 
              cx={point.x} 
              cy={point.y} 
              r="4" 
              fill="#4f46e5" 
            />
          ))}
        </svg>
        
        {/* Labels */}
        {points.map((point, index) => {
          const angle = (Math.PI * 2 * index) / Object.keys(skills).length;
          const labelX = centerX + (radius + 15) * Math.cos(angle);
          const labelY = centerY + (radius + 15) * Math.sin(angle);
          
          return (
            <div 
              key={index} 
              className="absolute text-xs font-medium"
              style={{ 
                left: `${labelX}px`, 
                top: `${labelY}px`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              {point.skill}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Bar Chart Component for Scores
const ScoreBarChart = ({ scores }) => {
  return (
    <div className="space-y-3">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="capitalize">{key}</span>
            <span className="font-medium">{value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('video');
  const interview = mockInterviewData[id];

  if (!interview) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Interview not found</h2>
        <Button onClick={() => navigate('/ai-interviews')}>
          <FaArrowLeft className="mr-2" /> Back to Interviews
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/ai-interviews')}
        className="mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Interviews
      </Button>

      <Card className="shadow-sm mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{interview.candidateName}</CardTitle>
              <div className="text-gray-500">{interview.position}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Interview Date</div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1 text-gray-400" />
                  {interview.date}
                </div>
              </div>
              <InterviewTypeIcon type={interview.interviewType} />
              <div className="text-3xl font-bold text-indigo-600">
                {interview.score}
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="video" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="video" className="flex items-center">
            <FaVideo className="mr-2" /> Video Recording
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <FaChartBar className="mr-2" /> Analysis
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex items-center">
            <FaFileAlt className="mr-2" /> Transcript
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video">
          <VideoPlayer 
            videoUrl={interview.videoUrl} 
            title={`${interview.candidateName} - ${interview.position} Interview`} 
          />
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <SpiderChart skills={interview.skillScores} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Interview Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreBarChart scores={{
                  sentiment: interview.sentimentScore,
                  keywordMatch: interview.keywordMatch,
                  clarity: interview.clarityScore,
                  overall: interview.score
                }} />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Question Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {interview.questions.map((q, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="font-medium mb-2">Q: {q.question}</div>
                    <div className="text-gray-700 mb-3">A: {q.answer}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {q.keywords.map((keyword, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="text-lg font-bold text-indigo-600">
                        {q.score}<span className="text-xs text-gray-500">/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transcript">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Full Interview Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-[600px] overflow-y-auto whitespace-pre-line">
                {interview.transcript}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={() => navigate('/ai-interviews')}>
          Back to List
        </Button>
        <Button onClick={() => alert('Assessment approved!')}>
          Approve Assessment
        </Button>
      </div>
    </div>
  );
};

export default InterviewDetails;