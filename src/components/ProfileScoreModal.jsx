import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { FaChartLine, FaRobot, FaCheck, FaTimes, FaArrowRight, FaLightbulb } from 'react-icons/fa';

const ProfileScoreModal = ({ isOpen, onClose, score, resume, userProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Early return if score is null to prevent the error
  if (!score) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <FaChartLine className="mr-2 text-blue-500" /> Profile Score Analysis
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-8 text-center">
            <p className="text-gray-500">No profile score data available. Please analyze your profile first.</p>
            <Button 
              onClick={onClose}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getScoreText = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };
  
  const getAIFeedback = () => {
    const feedback = [];
    
    // General feedback based on score
    if (score.total < 40) {
      feedback.push("Your profile needs significant improvement to stand out to employers.");
      feedback.push("Start by creating a comprehensive resume and completing your profile information.");
    } else if (score.total < 60) {
      feedback.push("Your profile has a good foundation, but needs more detail to be competitive.");
      feedback.push("Focus on enhancing your work experience with specific achievements and metrics.");
    } else if (score.total < 80) {
      feedback.push("Your profile is solid, but could benefit from some refinements.");
      feedback.push("Consider adding more specific skills and quantifiable achievements to stand out.");
    } else {
      feedback.push("Your profile is excellent and likely to impress potential employers.");
      feedback.push("Keep your information updated and tailored to your target positions.");
    }
    
    // Specific feedback based on details
    if (!score.details.hasResume) {
      feedback.push("Creating a professional resume is critical for job applications.");
    }
    
    if (!score.details.hasAbout) {
      feedback.push("Add a compelling 'About' section to give employers a quick overview of your background and goals.");
    }
    
    if (score.details.resumeCompleteness < 50) {
      feedback.push("Your resume is missing key sections that employers look for.");
    }
    
    if (score.details.resumeQuality < 20) {
      feedback.push("The quality of your resume content could be improved with more specific achievements and metrics.");
    }
    
    if (score.details.skillsMatch < 10) {
      feedback.push("Add more relevant skills to match the requirements of your target jobs.");
    }
    
    return feedback;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <FaChartLine className="mr-2 text-blue-500" /> Profile Score Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'ai-feedback' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('ai-feedback')}
            >
              AI Feedback
            </button>
          </div>
          
          <div className="py-6">
            {activeTab === 'overview' && (
              <div className="text-center">
                <div className="inline-block rounded-full bg-gray-100 p-6 mb-4">
                  <div className={`text-5xl font-bold ${getScoreColor(score.total)}`}>
                    {score.total}%
                  </div>
                  <div className="text-gray-600 mt-1">{getScoreText(score.total)}</div>
                </div>
                
                <div className="max-w-md mx-auto mt-6">
                  <Progress 
                    value={score.total} 
                    className={`h-3 ${getProgressColor(score.total)}`} 
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Needs Work</span>
                    <span>Excellent</span>
                  </div>
                </div>
                
                <div className="mt-8 text-left">
                  <h3 className="font-medium text-lg mb-3">Summary</h3>
                  <p className="text-gray-700">
                    {score.total >= 80 && "Your profile is excellent! You've provided comprehensive information that will help you stand out to employers."}
                    {score.total >= 60 && score.total < 80 && "Your profile is good, but there's room for improvement. Consider addressing the suggestions to make your profile even stronger."}
                    {score.total >= 40 && score.total < 60 && "Your profile needs improvement in several areas. Follow the suggestions to significantly enhance your chances with employers."}
                    {score.total < 40 && "Your profile needs significant work. Focus on the key suggestions to build a more competitive profile."}
                  </p>
                  
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={() => setActiveTab('details')}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      View Detailed Analysis <FaArrowRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Profile Completeness</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Resume</span>
                          <span className="font-medium">
                            {score.details.hasResume ? (
                              <span className="text-green-500">Available</span>
                            ) : (
                              <span className="text-red-500">Missing</span>
                            )}
                          </span>
                        </div>
                        <Progress value={score.details.hasResume ? 100 : 0} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>About Section</span>
                          <span className="font-medium">
                            {score.details.hasAbout ? (
                              <span className="text-green-500">Completed</span>
                            ) : (
                              <span className="text-red-500">Incomplete</span>
                            )}
                          </span>
                        </div>
                        <Progress value={score.details.hasAbout ? 100 : 0} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Contact Information</span>
                          <span className="font-medium">
                            {score.details.hasContact ? (
                              <span className="text-green-500">Available</span>
                            ) : (
                              <span className="text-red-500">Missing</span>
                            )}
                          </span>
                        </div>
                        <Progress value={score.details.hasContact ? 100 : 0} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Resume Quality</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completeness</span>
                          <span className="font-medium">{score.details.resumeCompleteness}%</span>
                        </div>
                        <Progress value={score.details.resumeCompleteness} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Content Quality</span>
                          <span className="font-medium">{score.details.resumeQuality}%</span>
                        </div>
                        <Progress value={score.details.resumeQuality} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Skills Match</span>
                          <span className="font-medium">{score.details.skillsMatch}%</span>
                        </div>
                        <Progress value={score.details.skillsMatch} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium flex items-center text-yellow-800 mb-2">
                    <FaLightbulb className="mr-2 text-yellow-600" /> Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {score.details.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-yellow-700">
                        <span className="text-yellow-600 mr-2">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'ai-feedback' && (
              <div>
                <div className="flex items-start mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaRobot className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">AI Career Coach Feedback</h3>
                    <p className="text-gray-600">
                      Based on an analysis of your profile and resume, here's personalized feedback to help you improve your job prospects.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {getAIFeedback().map((feedback, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{feedback}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                  <p className="text-blue-700 mb-3">
                    Here are some recommended actions to improve your profile score:
                  </p>
                  <ul className="space-y-2">
                    {score.total < 100 && (
                      <>
                        {!score.details.hasResume && (
                          <li className="flex items-start">
                            <FaArrowRight className="text-blue-500 mt-1 mr-2" />
                            <span>Create a professional resume using our resume builder</span>
                          </li>
                        )}
                        {!score.details.hasAbout && (
                          <li className="flex items-start">
                            <FaArrowRight className="text-blue-500 mt-1 mr-2" />
                            <span>Complete your "About" section with a professional summary</span>
                          </li>
                        )}
                        {score.details.resumeCompleteness < 75 && (
                          <li className="flex items-start">
                            <FaArrowRight className="text-blue-500 mt-1 mr-2" />
                            <span>Add more details to your work experience and education sections</span>
                          </li>
                        )}
                        {score.details.skillsMatch < 15 && (
                          <li className="flex items-start">
                            <FaArrowRight className="text-blue-500 mt-1 mr-2" />
                            <span>Add more relevant skills that match your target job positions</span>
                          </li>
                        )}
                      </>
                    )}
                    {score.total >= 80 && (
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2" />
                        <span>Your profile is in excellent shape! Keep it updated as you gain new skills and experiences.</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileScoreModal;