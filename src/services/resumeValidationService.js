/**
 * Resume Validation Service
 * This service analyzes resumes and provides scores and feedback
 */

/**
 * Validates a resume and returns a score and feedback
 * @param {Object} resumeData - The resume data to validate
 * @param {string} resumePdf - The PDF version of the resume (optional)
 * @returns {Object} Validation results with score and feedback
 */
export const validateResume = (resumeData, resumePdf = null) => {
  // Initialize score and feedback
  let score = 0;
  const feedback = {
    overall: '',
    sections: {},
    improvements: [],
    keywords: [],
    isValid: false
  };

  // Check if resume exists
  if (!resumeData) {
    feedback.overall = 'No resume data found.';
    feedback.isValid = false;
    return { score: 0, feedback };
  }

  // Track section scores
  const sectionScores = {
    contact: 0,
    summary: 0,
    experience: 0,
    education: 0,
    skills: 0
  };
  
  // Maximum possible points
  const maxPoints = 100;
  
  // Validate contact information (15 points)
  if (resumeData.name) sectionScores.contact += 5;
  if (resumeData.email) sectionScores.contact += 5;
  if (resumeData.phone) sectionScores.contact += 3;
  if (resumeData.address) sectionScores.contact += 2;
  
  feedback.sections.contact = {
    score: sectionScores.contact,
    maxScore: 15,
    feedback: sectionScores.contact < 10 ? 'Contact information is incomplete.' : 'Contact information is complete.'
  };
  
  // Validate professional summary (20 points)
  if (resumeData.summary) {
    const summaryLength = resumeData.summary.length;
    if (summaryLength > 300) {
      sectionScores.summary = 20;
    } else if (summaryLength > 200) {
      sectionScores.summary = 15;
    } else if (summaryLength > 100) {
      sectionScores.summary = 10;
    } else if (summaryLength > 50) {
      sectionScores.summary = 5;
    }
    
    // Check for keywords in summary
    const keywords = ['experienced', 'skilled', 'professional', 'expertise', 'accomplished', 'results'];
    const keywordsFound = keywords.filter(keyword => 
      resumeData.summary.toLowerCase().includes(keyword)
    );
    
    if (keywordsFound.length > 0) {
      feedback.keywords = [...feedback.keywords, ...keywordsFound];
    }
  }
  
  feedback.sections.summary = {
    score: sectionScores.summary,
    maxScore: 20,
    feedback: sectionScores.summary < 10 ? 
      'Professional summary is too brief or missing.' : 
      'Professional summary is well-developed.'
  };
  
  // Validate work experience (30 points)
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    const experienceCount = resumeData.experience.length;
    
    // Points for number of experiences
    if (experienceCount >= 3) {
      sectionScores.experience += 10;
    } else if (experienceCount >= 1) {
      sectionScores.experience += 5;
    }
    
    // Points for quality of experience descriptions
    let totalDescriptionLength = 0;
    let hasActionVerbs = false;
    let hasMetrics = false;
    
    resumeData.experience.forEach(exp => {
      if (exp.description) {
        totalDescriptionLength += exp.description.length;
        
        // Check for action verbs
        const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'led', 'increased', 'reduced', 'improved'];
        if (actionVerbs.some(verb => exp.description.toLowerCase().includes(verb))) {
          hasActionVerbs = true;
        }
        
        // Check for metrics
        if (/\d+%|\$\d+|\d+ percent/i.test(exp.description)) {
          hasMetrics = true;
        }
      }
    });
    
    // Points for description length
    if (totalDescriptionLength > 500) {
      sectionScores.experience += 10;
    } else if (totalDescriptionLength > 200) {
      sectionScores.experience += 5;
    }
    
    // Points for action verbs and metrics
    if (hasActionVerbs) sectionScores.experience += 5;
    if (hasMetrics) sectionScores.experience += 5;
  }
  
  feedback.sections.experience = {
    score: sectionScores.experience,
    maxScore: 30,
    feedback: sectionScores.experience < 15 ? 
      'Work experience section needs more detail and accomplishments.' : 
      'Work experience section is well-documented.'
  };
  
  // Validate education (15 points)
  if (resumeData.education && Array.isArray(resumeData.education)) {
    const educationCount = resumeData.education.length;
    
    // Points for number of education entries
    if (educationCount >= 2) {
      sectionScores.education += 5;
    } else if (educationCount >= 1) {
      sectionScores.education += 3;
    }
    
    // Points for completeness of education entries
    let completeEntries = 0;
    
    resumeData.education.forEach(edu => {
      if (edu.school && edu.degree && edu.year) {
        completeEntries++;
      }
    });
    
    if (completeEntries >= 2) {
      sectionScores.education += 10;
    } else if (completeEntries >= 1) {
      sectionScores.education += 5;
    }
  }
  
  feedback.sections.education = {
    score: sectionScores.education,
    maxScore: 15,
    feedback: sectionScores.education < 8 ? 
      'Education section is incomplete or missing.' : 
      'Education section is well-documented.'
  };
  
  // Validate skills (20 points)
  if (resumeData.skills) {
    const skillsText = resumeData.skills;
    const skillsList = skillsText.split(/,|;|\n/).map(skill => skill.trim()).filter(Boolean);
    
    // Points for number of skills
    if (skillsList.length >= 10) {
      sectionScores.skills += 10;
    } else if (skillsList.length >= 5) {
      sectionScores.skills += 5;
    } else if (skillsList.length >= 1) {
      sectionScores.skills += 2;
    }
    
    // Points for technical skills
    const technicalSkills = ['programming', 'software', 'java', 'python', 'javascript', 'react', 'node', 'sql', 'database', 'aws', 'cloud'];
    const hasTechnicalSkills = technicalSkills.some(skill => 
      skillsText.toLowerCase().includes(skill)
    );
    
    if (hasTechnicalSkills) {
      sectionScores.skills += 5;
    }
    
    // Points for soft skills
    const softSkills = ['communication', 'leadership', 'teamwork', 'problem-solving', 'time management', 'collaboration'];
    const hasSoftSkills = softSkills.some(skill => 
      skillsText.toLowerCase().includes(skill)
    );
    
    if (hasSoftSkills) {
      sectionScores.skills += 5;
    }
  }
  
  feedback.sections.skills = {
    score: sectionScores.skills,
    maxScore: 20,
    feedback: sectionScores.skills < 10 ? 
      'Skills section needs more relevant skills.' : 
      'Skills section is comprehensive.'
  };
  
  // Calculate total score
  score = Object.values(sectionScores).reduce((total, sectionScore) => total + sectionScore, 0);
  
  // Generate overall feedback
  if (score >= 80) {
    feedback.overall = 'Excellent resume! Your resume is well-structured and contains detailed information that will impress employers.';
    feedback.isValid = true;
  } else if (score >= 60) {
    feedback.overall = 'Good resume. With a few improvements, your resume could be excellent.';
    feedback.isValid = true;
  } else if (score >= 40) {
    feedback.overall = 'Fair resume. Your resume needs several improvements to be competitive.';
    feedback.isValid = true;
  } else {
    feedback.overall = 'Your resume needs significant improvement to be effective in job applications.';
    feedback.isValid = false;
  }
  
  // Generate improvement suggestions
  if (sectionScores.contact < 10) {
    feedback.improvements.push('Add complete contact information including phone number and location.');
  }
  
  if (sectionScores.summary < 15) {
    feedback.improvements.push('Expand your professional summary to highlight your key qualifications and career goals.');
  }
  
  if (sectionScores.experience < 20) {
    feedback.improvements.push('Add more detail to your work experience, including specific achievements with metrics.');
  }
  
  if (sectionScores.education < 10) {
    feedback.improvements.push('Provide more complete information about your educational background.');
  }
  
  if (sectionScores.skills < 15) {
    feedback.improvements.push('Add more relevant skills, including both technical and soft skills.');
  }
  
  return {
    score,
    maxScore: maxPoints,
    percentage: Math.round((score / maxPoints) * 100),
    feedback
  };
};

/**
 * Check if a resume is ATS-friendly
 * @param {Object} resumeData - The resume data to check
 * @returns {Object} ATS compatibility results
 */
export const checkATSCompatibility = (resumeData) => {
  const results = {
    isATSFriendly: false,
    score: 0,
    issues: [],
    suggestions: []
  };
  
  if (!resumeData) {
    results.issues.push('No resume data found.');
    return results;
  }
  
  // Check for standard section headings
  const hasStandardSections = 
    resumeData.summary !== undefined && 
    resumeData.experience !== undefined && 
    resumeData.education !== undefined && 
    resumeData.skills !== undefined;
  
  if (hasStandardSections) {
    results.score += 25;
  } else {
    results.issues.push('Missing standard section headings (Summary, Experience, Education, Skills).');
    results.suggestions.push('Use standard section headings that ATS systems can recognize.');
  }
  
  // Check for contact information
  if (resumeData.name && resumeData.email) {
    results.score += 25;
  } else {
    results.issues.push('Missing essential contact information.');
    results.suggestions.push('Include your full name and email address at the top of your resume.');
  }
  
  // Check for keyword optimization
  let keywordScore = 0;
  const importantSections = ['summary', 'experience', 'skills'];
  
  importantSections.forEach(section => {
    if (resumeData[section]) {
      const content = Array.isArray(resumeData[section]) 
        ? resumeData[section].map(item => JSON.stringify(item)).join(' ')
        : resumeData[section].toString();
      
      // Check for industry keywords
      const keywords = ['experienced', 'skilled', 'professional', 'expertise', 'accomplished', 'results'];
      const keywordsFound = keywords.filter(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      keywordScore += keywordsFound.length * 5;
    }
  });
  
  results.score += Math.min(keywordScore, 25);
  
  if (keywordScore < 15) {
    results.issues.push('Low keyword optimization.');
    results.suggestions.push('Include more industry-relevant keywords throughout your resume.');
  }
  
  // Check for complex formatting
  // This is a simplified check since we can't actually check formatting in this context
  const hasComplexFormatting = false; // Placeholder
  
  if (!hasComplexFormatting) {
    results.score += 25;
  } else {
    results.issues.push('Complex formatting detected that may confuse ATS systems.');
    results.suggestions.push('Use simple formatting with standard fonts and avoid tables, text boxes, and graphics.');
  }
  
  // Set ATS-friendly status
  results.isATSFriendly = results.score >= 75;
  
  return results;
};

/**
 * Get resume score and feedback
 * @param {Object} resumeData - The resume data or PDF
 * @returns {Object} Score and feedback
 */
export const getResumeScore = (resumeData) => {
  // First validate the resume
  const validationResults = validateResume(resumeData);
  
  // Then check ATS compatibility
  const atsResults = checkATSCompatibility(resumeData);
  
  // Combine results
  return {
    ...validationResults,
    atsCompatibility: atsResults,
    lastUpdated: new Date().toISOString()
  };
};