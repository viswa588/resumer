import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaRobot, FaFileAlt } from 'react-icons/fa';
import { validateResume, checkATSCompatibility } from '../services/resumeValidationService';

const ResumeValidationModal = ({ isOpen, onClose, resumeData, resumePdf }) => {
  const [validationResults, setValidationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (isOpen && resumeData) {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const results = validateResume(resumeData, resumePdf);
        setValidationResults(results);
        setIsLoading(false);
      }, 1500);
    }
  }, [isOpen, resumeData, resumePdf]);
  
  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-blue-500";
    if (percentage >= 40) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getScoreText = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <FaFileAlt className="mr-2 text-blue-500" /> Resume Validation
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Analyzing your resume...</p>
          </div>
        ) : validationResults ? (
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
                Section Details
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'ats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('ats')}
              >
                ATS Compatibility
              </button>
            </div>
            
            <div className="py-6">
              {activeTab === 'overview' && (
                <div>
                  <div className="flex flex-col items-center mb-6">
                    <div className="text-center mb-4">
                      <div className={`text-5xl font-bold ${getScoreColor(validationResults.score, validationResults.maxScore)}`}>
                        {validationResults.percentage}%
                      </div>
                      <div className="text-gray-600 mt-1">
                        {getScoreText(validationResults.score, validationResults.maxScore)}
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md">
                      <Progress 
                        value={validationResults.percentage} 
                        className={`h-3 ${getProgressColor(validationResults.score, validationResults.maxScore)}`} 
                      />
                    </div>
                    
                    <div className="mt-6 text-center">
                      {validationResults.feedback.isValid ? (
                        <div className="flex items-center text-green-600 mb-2">
                          <FaCheckCircle className="mr-2" />
                          <span className="font-medium">Your resume is valid and ready for submission</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 mb-2">
                          <FaTimesCircle className="mr-2" />
                          <span className="font-medium">Your resume needs improvement before submission</span>
                        </div>
                      )}
                      
                      <p className="text-gray-700 mt-2">{validationResults.feedback.overall}</p>
                    </div>
                  </div>
                  
                  {validationResults.feedback.improvements.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <FaExclamationTriangle className="mr-2 text-yellow-600" /> 
                        Recommended Improvements
                      </h3>
                      <ul className="space-y-2">
                        {validationResults.feedback.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start text-yellow-700">
                            <span className="text-yellow-600 mr-2">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {Object.entries(validationResults.feedback.sections).map(([section, data]) => (
                    <div key={section} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium capitalize">{section}</h3>
                        <div className="flex items-center">
                          <span className={`font-bold ${getScoreColor(data.score, data.maxScore)}`}>
                            {data.score}/{data.maxScore}
                          </span>
                        </div>
                      </div>
                      
                      <Progress 
                        value={(data.score / data.maxScore) * 100} 
                        className={`h-2 ${getProgressColor(data.score, data.maxScore)}`} 
                      />
                      
                      <p className="text-gray-600 mt-2 text-sm">{data.feedback}</p>
                    </div>
                  ))}
                  
                  {validationResults.feedback.keywords.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">Detected Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {validationResults.feedback.keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'ats' && (
                <div>
                  <div className="flex items-center mb-4">
                    {validationResults.atsCompatibility.isATSFriendly ? (
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2 text-xl" />
                        <span className="font-medium">Your resume is ATS-friendly</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <FaTimesCircle className="mr-2 text-xl" />
                        <span className="font-medium">Your resume may not be ATS-friendly</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">ATS Compatibility Score</span>
                      <span className="font-bold">{validationResults.atsCompatibility.score}%</span>
                    </div>
                    <Progress 
                      value={validationResults.atsCompatibility.score} 
                      className={validationResults.atsCompatibility.isATSFriendly ? "bg-green-500" : "bg-red-500"} 
                    />
                  </div>
                  
                  {validationResults.atsCompatibility.issues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-red-800 mb-2">Issues</h3>
                      <ul className="space-y-2">
                        {validationResults.atsCompatibility.issues.map((issue, index) => (
                          <li key={index} className="flex items-start text-red-700">
                            <span className="text-red-600 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {validationResults.atsCompatibility.suggestions.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">Suggestions</h3>
                      <ul className="space-y-2">
                        {validationResults.atsCompatibility.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start text-blue-700">
                            <span className="text-blue-600 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No resume data available for validation.</p>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeValidationModal;