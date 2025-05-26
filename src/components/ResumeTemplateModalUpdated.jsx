import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FaFileAlt, FaDownload, FaEdit, FaCheck, FaLightbulb } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ResumeChatbot from './ResumeChatbot';
import { resumeTemplates } from './ResumeTemplates';
import PhotoUploadSection from './PhotoUploadSection';
import ProjectsSection from './ProjectsSection';
import FooterSection from './FooterSection';
import SkillsSection from './SkillsSection';

const ResumeTemplateModalUpdated = ({ isOpen, onClose, onSave, userData = {} }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [activeChatbotSection, setActiveChatbotSection] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
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
    projects: [
      { name: '', role: '', year: '', description: '' }
    ],
    skills: userData.skills || '',
    skillsList: [],
    footer: {
      text: 'References available upon request',
      links: [
        { label: 'LinkedIn', url: '' },
        { label: 'GitHub', url: '' },
        { label: 'Portfolio', url: '' }
      ]
    }
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
  
  const handleProjectsChange = (projects) => {
    setResumeData({
      ...resumeData,
      projects
    });
  };
  
  const handleFooterChange = (footer) => {
    setResumeData({
      ...resumeData,
      footer
    });
  };
  
  const handleSkillsChange = (skills, skillsList) => {
    setResumeData({
      ...resumeData,
      skills,
      skillsList
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
        pdf: pdfData,
        photo: profilePhoto
      });
      
      onClose();
    });
  };
  
  const handleOpenChatbot = (section) => {
    setActiveChatbotSection(section);
    setIsChatbotOpen(true);
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
      // Parse skills into an array for chips display
      const skillsList = content.split(',').map(skill => skill.trim()).filter(Boolean);
      setResumeData({...resumeData, skills: content, skillsList});
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
      pdf.save(`${resumeData.name.replace(/\\s+/g, '_')}_resume.pdf`);
    });
  };
  
  const renderSkills = (format) => {
    switch (format) {
      case 'chips':
        return (
          <div className="flex flex-wrap gap-2">
            {resumeData.skillsList.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {skill}
              </div>
            ))}
          </div>
        );
      case 'highlight':
        return (
          <div className="space-y-2">
            {resumeData.skillsList.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {skill}
              </div>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="space-y-2">
            {resumeData.skillsList.map((skill, index) => {
              const rating = Math.floor(Math.random() * 5) + 1; // Random rating for demo
              return (
                <div key={index} className="flex justify-between items-center">
                  <span>{skill}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      default:
        return <p className="text-gray-700">{resumeData.skills}</p>;
    }
  };

  const renderTemplate = () => {
    const template = resumeTemplates.find(t => t.id === selectedTemplate) || resumeTemplates[0];
    const templateContent = (
      <div className={`bg-white p-8 shadow-lg ${template.hasPhoto ? 'flex gap-6' : ''}`}>
        {template.hasPhoto && profilePhoto && (
          <div className="flex-shrink-0">
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
        )}
        <div className="flex-grow">
          {/* Header */}
          <div className={`border-b-2 border-${template.color}-500 pb-4 mb-6`}>
            <h1 className={`text-3xl font-bold text-${template.color}-800`}>{resumeData.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
              {resumeData.email && <div>{resumeData.email}</div>}
              {resumeData.phone && <div>{resumeData.phone}</div>}
              {resumeData.address && <div>{resumeData.address}</div>}
            </div>
          </div>
          
          {/* Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${template.color}-700 mb-2`}>Professional Summary</h2>
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${template.color}-700 mb-2`}>Experience</h2>
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
          
          {/* Projects */}
          {template.hasProjects && resumeData.projects.length > 0 && resumeData.projects[0].name && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${template.color}-700 mb-2`}>Projects</h2>
              {resumeData.projects.map((project, index) => (
                project.name && (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{project.name}</h3>
                      <span className="text-gray-600">{project.year}</span>
                    </div>
                    <div className="text-gray-700">{project.role}</div>
                    <p className="mt-1 text-gray-600">{project.description}</p>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Education */}
          {resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${template.color}-700 mb-2`}>Education</h2>
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
          
          {/* Skills */}
          {resumeData.skills && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${template.color}-700 mb-2`}>Skills</h2>
              {renderSkills(template.skillsFormat)}
            </div>
          )}
          
          {/* Footer */}
          {template.hasFooter && (
            <div className={`border-t border-${template.color}-200 pt-4 mt-6`}>
              <p className="text-gray-600 text-center">{resumeData.footer.text}</p>
              {resumeData.footer.links.length > 0 && (
                <div className="flex justify-center gap-4 mt-2">
                  {resumeData.footer.links.map((link, index) => (
                    link.label && link.url && (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-${template.color}-600 hover:underline`}
                      >
                        {link.label}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return templateContent;
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
              {resumeTemplates.map(template => (
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {template.hasPhoto && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Photo</span>
                    )}
                    {template.hasProjects && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Projects</span>
                    )}
                    {template.hasFooter && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Footer</span>
                    )}
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      {template.skillsFormat} skills
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
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
                
               // {resumeTemplates.find(t => t.id === selectedTemplate)?.hasPhoto && (
                  <PhotoUploadSection 
                    onPhotoChange={setProfilePhoto}
                    initialPhoto={profilePhoto}
                  />
                )}
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
                    <FaLightbulb className="mr-1" /> Get AI Help
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
                      <FaLightbulb className="mr-1" /> Get AI Help
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
              
              {resumeTemplates.find(t => t.id === selectedTemplate)?.hasProjects && (
                <ProjectsSection
                  projects={resumeData.projects}
                  onChange={handleProjectsChange}
                  onAdd={() => {
                    const newProjects = [...resumeData.projects, { name: '', role: '', year: '', description: '' }];
                    handleProjectsChange(newProjects);
                  }}
                  onRemove={(index) => {
                    if (resumeData.projects.length <= 1) return;
                    const newProjects = [...resumeData.projects];
                    newProjects.splice(index, 1);
                    handleProjectsChange(newProjects);
                  }}
                />
              )}
              
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
                      <FaLightbulb className="mr-1" /> Get AI Help
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
              
              <SkillsSection
                skills={resumeData.skills}
                skillsList={resumeData.skillsList}
                onChange={handleSkillsChange}
                onAIHelp={() => handleOpenChatbot('skills')}
              />
              
              {resumeTemplates.find(t => t.id === selectedTemplate)?.hasFooter && (
                <FooterSection
                  footer={resumeData.footer}
                  onChange={handleFooterChange}
                />
              )}
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

export default ResumeTemplateModalUpdated;