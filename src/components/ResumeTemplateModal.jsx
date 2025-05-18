import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FaFileAlt, FaDownload, FaEdit, FaCheck, FaRobot, FaLightbulb } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ResumeChatbot from './ResumeChatbot';

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and professional resume template suitable for corporate jobs',
    color: 'blue'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern and creative resume template for design and creative roles',
    color: 'purple'
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Minimalist resume template focusing on content',
    color: 'gray'
  }
];

const ResumeTemplateModal = ({ isOpen, onClose, onSave, userData = {} }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeChatbotSection, setActiveChatbotSection] = useState('');
  const [resumeData, setResumeData] = useState({
    name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
    summary: userData.about || '',
    education: [
      { school: '', degree: '', year: '', description: '' }
    ],
    experience: [
      { company: '', position: '', year: '', description: '' }
    ],
    skills: userData.skills || ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      [name]: value
    });
  };
  
  const handleArrayInputChange = (type, index, field, value) => {
    const updatedArray = [...resumeData[type]];
    updatedArray[index][field] = value;
    setResumeData({
      ...resumeData,
      [type]: updatedArray
    });
  };
  
  const addItem = (type) => {
    if (type === 'education') {
      setResumeData({
        ...resumeData,
        education: [...resumeData.education, { school: '', degree: '', year: '', description: '' }]
      });
    } else if (type === 'experience') {
      setResumeData({
        ...resumeData,
        experience: [...resumeData.experience, { company: '', position: '', year: '', description: '' }]
      });
    }
  };
  
  const removeItem = (type, index) => {
    if (resumeData[type].length <= 1) return;
    
    const updatedArray = [...resumeData[type]];
    updatedArray.splice(index, 1);
    setResumeData({
      ...resumeData,
      [type]: updatedArray
    });
  };
  
  const handleSave = () => {
    // Generate PDF from the resume content
    const resumeElement = document.getElementById('resume-preview');
    
    html2canvas(resumeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const pdfData = pdf.output('datauristring');
      
      // Save the resume data and PDF
      onSave({
        template: selectedTemplate,
        data: resumeData,
        pdf: pdfData
      });
      
      onClose();
    });
  };
  
  const handleOpenChatbot = (section) => {
    setActiveChatbotSection(section);
    setIsChatbotOpen(true);
  };
  
  // Update profile score when saving resume
  const updateProfileScore = () => {
    // This would be called after saving the resume
    if (typeof window !== 'undefined' && window.updateProfileScore) {
      window.updateProfileScore();
    }
  };
  
  const handleChatbotSuggestion = (suggestion) => {
    // Extract content from the suggestion
    let content = suggestion;
    
    // Remove the "Here's a professional summary template you can customize:" part
    if (content.includes("Here's a professional summary template you can customize:")) {
      content = content.split('"')[1];
    }
    
    // Remove the "Here are some strong bullet points" part
    if (content.includes("Here are some strong bullet points")) {
      content = content.split("Here are some strong bullet points you can adapt for your experience section:")[1].trim();
    }
    
    // Update the appropriate section based on activeChatbotSection
    if (activeChatbotSection === 'summary') {
      setResumeData({...resumeData, summary: content});
    } else if (activeChatbotSection === 'experience') {
      // For experience, we'll update the first experience item's description
      const updatedExperience = [...resumeData.experience];
      updatedExperience[0] = {...updatedExperience[0], description: content};
      setResumeData({...resumeData, experience: updatedExperience});
    } else if (activeChatbotSection === 'education') {
      // For education, we'll update the first education item's description
      const updatedEducation = [...resumeData.education];
      updatedEducation[0] = {...updatedEducation[0], description: content};
      setResumeData({...resumeData, education: updatedEducation});
    } else if (activeChatbotSection === 'skills') {
      setResumeData({...resumeData, skills: content});
    }
  };
  
  const handleDownload = () => {
    const resumeElement = document.getElementById('resume-preview');
    
    html2canvas(resumeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_resume.pdf`);
    });
  };
  
  const renderProfessionalTemplate = () => (
    <div className="bg-white p-8 shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="border-b-2 border-blue-500 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-800">{resumeData.name}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          {resumeData.email && <div>{resumeData.email}</div>}
          {resumeData.phone && <div>{resumeData.phone}</div>}
          {resumeData.address && <div>{resumeData.address}</div>}
        </div>
      </div>
      
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>
      )}
      
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-gray-600">{exp.year}</span>
              </div>
              <div className="text-gray-700">{exp.company}</div>
              <p className="mt-1 text-gray-600">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{edu.degree}</h3>
                <span className="text-gray-600">{edu.year}</span>
              </div>
              <div className="text-gray-700">{edu.school}</div>
              <p className="mt-1 text-gray-600">{edu.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {resumeData.skills && (
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Skills</h2>
          <p className="text-gray-700">{resumeData.skills}</p>
        </div>
      )}
    </div>
  );
  
  const renderCreativeTemplate = () => (
    <div className="bg-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="bg-purple-700 text-white p-8">
        <h1 className="text-4xl font-bold">{resumeData.name}</h1>
        <div className="flex flex-wrap gap-4 mt-3 text-purple-100">
          {resumeData.email && <div>{resumeData.email}</div>}
          {resumeData.phone && <div>{resumeData.phone}</div>}
          {resumeData.address && <div>{resumeData.address}</div>}
        </div>
      </div>
      
      <div className="p-8">
        {resumeData.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 border-b-2 border-purple-300 pb-1">About Me</h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}
        
        {resumeData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 border-b-2 border-purple-300 pb-1">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <h3 className="text-xl font-bold text-purple-600">{exp.position}</h3>
                  <span className="text-purple-500 font-medium">{exp.year}</span>
                </div>
                <div className="text-lg text-gray-700 font-medium">{exp.company}</div>
                <p className="mt-2 text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {resumeData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 border-b-2 border-purple-300 pb-1">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-5">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <h3 className="text-xl font-bold text-purple-600">{edu.degree}</h3>
                  <span className="text-purple-500 font-medium">{edu.year}</span>
                </div>
                <div className="text-lg text-gray-700 font-medium">{edu.school}</div>
                <p className="mt-2 text-gray-600">{edu.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {resumeData.skills && (
          <div>
            <h2 className="text-2xl font-bold text-purple-700 mb-3 border-b-2 border-purple-300 pb-1">Skills</h2>
            <p className="text-gray-700">{resumeData.skills}</p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderSimpleTemplate = () => (
    <div className="bg-white p-8" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{resumeData.name}</h1>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-gray-600">
          {resumeData.email && <div>{resumeData.email}</div>}
          {resumeData.phone && <div>{resumeData.phone}</div>}
          {resumeData.address && <div>{resumeData.address}</div>}
        </div>
      </div>
      
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-1">Summary</h2>
          <p className="text-gray-700 mt-2">{resumeData.summary}</p>
        </div>
      )}
      
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-1">Experience</h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4 mt-3">
              <div className="flex justify-between">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-gray-600">{exp.year}</span>
              </div>
              <div className="text-gray-700">{exp.company}</div>
              <p className="mt-1 text-gray-600">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-1">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4 mt-3">
              <div className="flex justify-between">
                <h3 className="font-bold">{edu.degree}</h3>
                <span className="text-gray-600">{edu.year}</span>
              </div>
              <div className="text-gray-700">{edu.school}</div>
              <p className="mt-1 text-gray-600">{edu.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {resumeData.skills && (
        <div>
          <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-1">Skills</h2>
          <p className="text-gray-700 mt-2">{resumeData.skills}</p>
        </div>
      )}
    </div>
  );
  
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'professional':
        return renderProfessionalTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'simple':
        return renderSimpleTemplate();
      default:
        return renderProfessionalTemplate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Your Resume</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="edit" className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="edit">Edit Resume</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? `border-${template.color}-500 bg-${template.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{template.name}</h3>
                    {selectedTemplate === template.id && (
                      <FaCheck className={`text-${template.color}-500`} />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={resumeData.name} 
                    onChange={handleInputChange} 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={resumeData.email} 
                    onChange={handleInputChange} 
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={resumeData.phone} 
                    onChange={handleInputChange} 
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={resumeData.address} 
                    onChange={handleInputChange} 
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center text-blue-600"
                    onClick={() => handleOpenChatbot('summary')}
                  >
                    <FaRobot className="mr-1" /> Get AI Help
                  </Button>
                </div>
                <Textarea 
                  id="summary" 
                  name="summary" 
                  value={resumeData.summary} 
                  onChange={handleInputChange} 
                  placeholder="Brief summary of your professional background and goals"
                  rows={4}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Experience</h3>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center text-blue-600"
                      onClick={() => handleOpenChatbot('experience')}
                    >
                      <FaRobot className="mr-1" /> Get AI Help
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addItem('experience')}
                    >
                      Add Experience
                    </Button>
                  </div>
                </div>
                
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      {resumeData.experience.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeItem('experience', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Company</Label>
                        <Input 
                          value={exp.company} 
                          onChange={(e) => handleArrayInputChange('experience', index, 'company', e.target.value)} 
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input 
                          value={exp.position} 
                          onChange={(e) => handleArrayInputChange('experience', index, 'position', e.target.value)} 
                          placeholder="Job Title"
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input 
                          value={exp.year} 
                          onChange={(e) => handleArrayInputChange('experience', index, 'year', e.target.value)} 
                          placeholder="2020 - Present"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label>Description</Label>
                      <Textarea 
                        value={exp.description} 
                        onChange={(e) => handleArrayInputChange('experience', index, 'description', e.target.value)} 
                        placeholder="Describe your responsibilities and achievements"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Education</h3>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center text-blue-600"
                      onClick={() => handleOpenChatbot('education')}
                    >
                      <FaRobot className="mr-1" /> Get AI Help
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addItem('education')}
                    >
                      Add Education
                    </Button>
                  </div>
                </div>
                
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      {resumeData.education.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeItem('education', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>School</Label>
                        <Input 
                          value={edu.school} 
                          onChange={(e) => handleArrayInputChange('education', index, 'school', e.target.value)} 
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input 
                          value={edu.degree} 
                          onChange={(e) => handleArrayInputChange('education', index, 'degree', e.target.value)} 
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input 
                          value={edu.year} 
                          onChange={(e) => handleArrayInputChange('education', index, 'year', e.target.value)} 
                          placeholder="2016 - 2020"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label>Description</Label>
                      <Textarea 
                        value={edu.description} 
                        onChange={(e) => handleArrayInputChange('education', index, 'description', e.target.value)} 
                        placeholder="Relevant coursework, achievements, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="skills">Skills</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center text-blue-600"
                    onClick={() => handleOpenChatbot('skills')}
                  >
                    <FaRobot className="mr-1" /> Get AI Help
                  </Button>
                </div>
                <Textarea 
                  id="skills" 
                  name="skills" 
                  value={resumeData.skills} 
                  onChange={handleInputChange} 
                  placeholder="List your key skills, separated by commas"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-end mb-4 space-x-2">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="flex items-center"
              >
                <FaDownload className="mr-2" /> Download PDF
              </Button>
            </div>
            
            <div className="bg-white shadow-lg max-w-4xl mx-auto" id="resume-preview">
              {renderTemplate()}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between space-x-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChatbot('')}
            className="flex items-center"
          >
            <FaLightbulb className="mr-2 text-yellow-500" /> General Resume Tips
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
              <FaFileAlt className="mr-2" /> Save Resume
            </Button>
          </div>
        </div>
        
        {/* AI Chatbot */}
        <ResumeChatbot 
          isOpen={isChatbotOpen} 
          onClose={() => setIsChatbotOpen(false)} 
          onSuggestion={handleChatbotSuggestion}
          section={activeChatbotSection}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ResumeTemplateModal;