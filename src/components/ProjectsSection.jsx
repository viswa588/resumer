import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const ProjectsSection = ({ projects, onChange, onAdd, onRemove }) => {
  const handleInputChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    onChange(updatedProjects);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Projects</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAdd}
        >
          Add Project
        </Button>
      </div>
      
      {projects.map((project, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Project {index + 1}</h4>
            {projects.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <Input 
                value={project.name} 
                onChange={(e) => handleInputChange(index, 'name', e.target.value)} 
                placeholder="Project Name"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input 
                value={project.role} 
                onChange={(e) => handleInputChange(index, 'role', e.target.value)} 
                placeholder="Your Role"
              />
            </div>
            <div>
              <Label>Year/Duration</Label>
              <Input 
                value={project.year} 
                onChange={(e) => handleInputChange(index, 'year', e.target.value)} 
                placeholder="2022 - 2023"
              />
            </div>
          </div>
          <div className="mt-2">
            <Label>Description</Label>
            <Textarea 
              value={project.description} 
              onChange={(e) => handleInputChange(index, 'description', e.target.value)} 
              placeholder="Describe the project, your contributions, and outcomes"
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsSection;