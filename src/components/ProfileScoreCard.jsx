import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { FaChartLine, FaInfoCircle, FaRobot, FaCheck, FaTimes } from 'react-icons/fa';

const ProfileScoreCard = forwardRef(({ resume, userProfile, onViewDetails, onScoreUpdate, id }, ref) => {
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Expose calculateScore method to parent components
  useImperativeHandle(ref, () => ({
    calculateScore
  }));
  
  useEffect(() => {
    calculateScore();
  }, [resume, userProfile]);
  
  const calculateScore = () => {
    setIsLoading(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Basic scoring algorithm
      let totalScore = 0;
      const scoreDetails = {
        hasResume: resume ? true : false,
        hasProfilePicture: false, // This would come from props
        hasAbout: userProfile?.about ? true : false,
        hasContact: userProfile?.email ? true : false,
        resumeCompleteness: 0,
        resumeQuality: 0,
        skillsMatch: 0,
        improvements: []
      };
      
      // Check resume completeness
      if (resume) {
        try {
          // Parse resume data if it's stored as JSON
          let resumeData = {};
          try {
            const resumeTemplate = localStorage.getItem(`resumeTemplate_${userProfile.email}`);
            if (resumeTemplate) {
              resumeData = JSON.parse(resumeTemplate).data || {};
            }
          } catch (e) {
            console.error("Error parsing resume data:", e);
          }
          
          // Check for basic resume sections
          if (resumeData.summary && resumeData.summary.length > 50) {
            scoreDetails.resumeCompleteness += 20;
            scoreDetails.resumeQuality += 10;
          } else {
            scoreDetails.improvements.push("Add a detailed professional summary (at least 50 characters)");
          }
          
          if (resumeData.experience && resumeData.experience.length > 0) {
            const hasGoodExperience = resumeData.experience.some(exp => 
              exp.company && exp.position && exp.description && exp.description.length > 50
            );
            
            if (hasGoodExperience) {
              scoreDetails.resumeCompleteness += 25;
              scoreDetails.resumeQuality += 15;
            } else {
              scoreDetails.improvements.push("Add detailed work experience with responsibilities and achievements");
            }
          } else {
            scoreDetails.improvements.push("Add your work experience");
          }
          
          if (resumeData.education && resumeData.education.length > 0) {
            scoreDetails.resumeCompleteness += 15;
            scoreDetails.resumeQuality += 5;
          } else {
            scoreDetails.improvements.push("Add your educational background");
          }
          
          if (resumeData.skills && resumeData.skills.length > 20) {
            scoreDetails.resumeCompleteness += 15;
            scoreDetails.skillsMatch += 15;
          } else {
            scoreDetails.improvements.push("List more skills relevant to your target jobs");
          }
        } catch (error) {
          console.error("Error analyzing resume:", error);
        }
      } else {
        scoreDetails.improvements.push("Upload or create a resume");
      }
      
      // Calculate base score from profile
      if (scoreDetails.hasResume) totalScore += 20;
      if (scoreDetails.hasProfilePicture) totalScore += 5;
      if (scoreDetails.hasAbout) totalScore += 10;
      if (scoreDetails.hasContact) totalScore += 5;
      
      // Add section scores
      totalScore += scoreDetails.resumeCompleteness;
      totalScore += scoreDetails.resumeQuality;
      totalScore += scoreDetails.skillsMatch;
      
      // Cap at 100
      totalScore = Math.min(totalScore, 100);
      
      // If score is too low, add generic improvements
      if (totalScore < 40 && scoreDetails.improvements.length < 3) {
        scoreDetails.improvements.push("Complete your profile with more details");
        scoreDetails.improvements.push("Add specific achievements to your work experience");
      }
      
      const scoreData = {
        total: totalScore,
        details: scoreDetails
      };
      
      setScore(scoreData);
      
      // Call onScoreUpdate if provided
      if (onScoreUpdate) {
        onScoreUpdate(scoreData);
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
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

  return (
    <div id={id}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold flex items-center">
          <FaChartLine className="mr-2 text-blue-500" /> Profile Score
        </h3>
        {score && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            <FaInfoCircle className="mr-1" /> {showDetails ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500 text-sm">Analyzing...</p>
        </div>
      ) : score ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={`text-2xl font-bold ${getScoreColor(score.total)}`}>
                {score.total}%
              </span>
              <span className="ml-2 text-sm text-gray-600">
                {getScoreText(score.total)}
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={calculateScore}
              className="bg-blue-500 hover:bg-blue-600 text-xs py-1 h-7"
            >
              <FaRobot className="mr-1" /> Analyze
            </Button>
          </div>
          
          <Progress 
            value={score.total} 
            className={`h-2 ${getProgressColor(score.total)}`} 
          />
          
          {showDetails && (
            <div className="mt-4 space-y-2">
              {score.details.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Improvements:</h4>
                  <ul className="space-y-1">
                    {score.details.improvements.slice(0, 2).map((improvement, index) => (
                      <li key={index} className="text-xs flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        {improvement}
                      </li>
                    ))}
                    {score.details.improvements.length > 2 && (
                      <li className="text-xs text-blue-500 cursor-pointer" onClick={onViewDetails}>
                        + {score.details.improvements.length - 2} more improvements...
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewDetails}
                className="w-full text-xs mt-2"
              >
                View Detailed Analysis
              </Button>
            </div>
          )}
          
          {!showDetails && (
            <div className="mt-2 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewDetails}
                className="w-full text-xs"
              >
                View Detailed Analysis
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-gray-500 text-sm mb-2">Analyze your profile</p>
          <Button 
            onClick={calculateScore}
            className="bg-blue-500 hover:bg-blue-600 text-xs w-full"
          >
            <FaRobot className="mr-1" /> Start Analysis
          </Button>
        </div>
      )}
    </div>
  );
});

ProfileScoreCard.displayName = "ProfileScoreCard";

export default ProfileScoreCard;