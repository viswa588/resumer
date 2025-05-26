import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FaRobot, 
  FaCalendarAlt, 
  FaUserTie, 
  FaChartBar, 
  FaCheck, 
  FaTimes,
  FaVideo,
  FaCommentAlt,
  FaMicrophone
} from 'react-icons/fa';

// Mock data for interviews
const mockInterviews = [
  {
    id: 1,
    candidateName: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    status: 'completed',
    score: 87,
    date: '2023-11-20',
    transcript: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
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
    interviewType: 'chat'
  },
  {
    id: 2,
    candidateName: 'Michael Chen',
    position: 'UX/UI Designer',
    status: 'scheduled',
    date: '2023-11-25',
    interviewType: 'video'
  },
  {
    id: 3,
    candidateName: 'Emily Rodriguez',
    position: 'DevOps Engineer',
    status: 'completed',
    score: 92,
    date: '2023-11-18',
    transcript: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
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
    interviewType: 'voice'
  },
  {
    id: 4,
    candidateName: 'David Kim',
    position: 'Product Manager',
    status: 'pending',
    interviewType: 'chat'
  },
  {
    id: 5,
    candidateName: 'Lisa Wang',
    position: 'Data Scientist',
    status: 'no-show',
    date: '2023-11-17',
    interviewType: 'video'
  }
];

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

// Interview Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { color: 'bg-green-100 text-green-800', icon: <FaCheck className="mr-1 h-3 w-3" /> },
    scheduled: { color: 'bg-blue-100 text-blue-800', icon: <FaCalendarAlt className="mr-1 h-3 w-3" /> },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaUserTie className="mr-1 h-3 w-3" /> },
    'no-show': { color: 'bg-red-100 text-red-800', icon: <FaTimes className="mr-1 h-3 w-3" /> },
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Interview Type Icon
const InterviewTypeIcon = ({ type }) => {
  const typeConfig = {
    video: { icon: <FaVideo className="h-4 w-4" />, label: 'Video' },
    chat: { icon: <FaCommentAlt className="h-4 w-4" />, label: 'Chat' },
    voice: { icon: <FaMicrophone className="h-4 w-4" />, label: 'Voice' },
  };

  return (
    <div className="flex items-center text-gray-500 text-xs">
      {typeConfig[type].icon}
      <span className="ml-1">{typeConfig[type].label}</span>
    </div>
  );
};

export const AIInterviewAssistant = () => {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleViewDetails = (interview) => {
    window.location.href = `/interview-details/${interview.id}`;
  };

  const handleApproveAssessment = () => {
    alert('Assessment approved!');
    setSelectedInterview(null);
  };

  const handleOverrideAssessment = () => {
    alert('Assessment override initiated!');
    // In a real app, this would open a form to modify the assessment
  };

  const upcomingInterviews = mockInterviews.filter(interview => 
    interview.status === 'scheduled' || interview.status === 'pending'
  );
  
  const completedInterviews = mockInterviews.filter(interview => 
    interview.status === 'completed' || interview.status === 'no-show'
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FaRobot className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-lg font-semibold">AI Interview Assistant</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
              Configure AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
              <TabsTrigger value="completed">Completed Interviews</TabsTrigger>
              <TabsTrigger value="settings">Interview Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No upcoming interviews scheduled
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.map(interview => (
                    <div key={interview.id} className="flex justify-between items-center p-4 bg-white border rounded-lg">
                      <div>
                        <div className="font-medium">{interview.candidateName}</div>
                        <div className="text-sm text-gray-500">{interview.position}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusBadge status={interview.status} />
                          <InterviewTypeIcon type={interview.interviewType} />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {interview.date && (
                          <div className="text-sm text-gray-500">
                            <FaCalendarAlt className="inline mr-1" />
                            {interview.date}
                          </div>
                        )}
                        <Button size="sm" onClick={() => alert(`Reminder sent to ${interview.candidateName}`)}>Send Reminder</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {selectedInterview ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{selectedInterview.candidateName}</h3>
                      <p className="text-gray-500">{selectedInterview.position}</p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedInterview(null)}>
                      Back to List
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Skills Assessment</h4>
                      <SpiderChart skills={selectedInterview.skillScores} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Interview Metrics</h4>
                      <ScoreBarChart scores={{
                        sentiment: selectedInterview.sentimentScore,
                        keywordMatch: selectedInterview.keywordMatch,
                        clarity: selectedInterview.clarityScore,
                        overall: selectedInterview.score
                      }} />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Interview Transcript</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-60 overflow-y-auto">
                      {selectedInterview.transcript}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handleOverrideAssessment}>
                      Override Assessment
                    </Button>
                    <Button onClick={handleApproveAssessment}>
                      Approve Assessment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedInterviews.map(interview => (
                    <div key={interview.id} className="flex justify-between items-center p-4 bg-white border rounded-lg">
                      <div>
                        <div className="font-medium">{interview.candidateName}</div>
                        <div className="text-sm text-gray-500">{interview.position}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusBadge status={interview.status} />
                          <InterviewTypeIcon type={interview.interviewType} />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {interview.score && (
                          <div className="text-lg font-bold">
                            {interview.score}
                            <span className="text-xs text-gray-500">/100</span>
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          onClick={() => window.location.href = `/interview-details/${interview.id}`}
                          disabled={interview.status === 'no-show'}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Interview Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Interview Types</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="video" className="mr-2" defaultChecked />
                          <label htmlFor="video">Video Interview</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="chat" className="mr-2" defaultChecked />
                          <label htmlFor="chat">Chat Interview</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="voice" className="mr-2" defaultChecked />
                          <label htmlFor="voice">Voice Interview</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Integrations</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="zoom" className="mr-2" defaultChecked />
                          <label htmlFor="zoom">Zoom</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="gmeet" className="mr-2" defaultChecked />
                          <label htmlFor="gmeet">Google Meet</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="teams" className="mr-2" />
                          <label htmlFor="teams">Microsoft Teams</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Automated Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Follow-ups</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="reminder" className="mr-2" defaultChecked />
                          <label htmlFor="reminder">Send interview reminders</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="noshow" className="mr-2" defaultChecked />
                          <label htmlFor="noshow">Follow up with no-shows</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="feedback" className="mr-2" defaultChecked />
                          <label htmlFor="feedback">Request candidate feedback</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Scheduling</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="auto-schedule" className="mr-2" defaultChecked />
                          <label htmlFor="auto-schedule">Auto-schedule interviews</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="calendar" className="mr-2" defaultChecked />
                          <label htmlFor="calendar">Sync with calendar</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="reschedule" className="mr-2" defaultChecked />
                          <label htmlFor="reschedule">Allow candidate rescheduling</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => alert('Settings saved successfully!')}>Save Settings</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInterviewAssistant;