import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Chip } from './ui/chip';
import { FaRobot, FaTimes } from 'react-icons/fa';

const SkillsSection = ({ skills, skillsList, onChange, onAIHelp }) => {
  const [editMode, setEditMode] = useState('text'); // 'text' or 'chips'
  
  const handleSkillsChange = (value) => {
    // Parse skills into an array for chips display
    const parsedSkills = value.split(',').map(skill => skill.trim()).filter(Boolean);
    onChange(value, parsedSkills);
  };
  
  const handleRemoveSkill = (index) => {
    const updatedSkillsList = [...skillsList];
    updatedSkillsList.splice(index, 1);
    
    // Update the text representation as well
    const updatedSkillsText = updatedSkillsList.join(', ');
    onChange(updatedSkillsText, updatedSkillsList);
  };
  
  const handleAddSkill = (skill) => {
    if (!skill.trim()) return;
    
    const newSkill = skill.trim();
    if (!skillsList.includes(newSkill)) {
      const updatedSkillsList = [...skillsList, newSkill];
      const updatedSkillsText = updatedSkillsList.join(', ');
      onChange(updatedSkillsText, updatedSkillsList);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="skills">Skills</Label>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="flex items-center text-blue-600"
            onClick={onAIHelp}
          >
            <FaRobot className="mr-1" /> Get AI Help
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditMode(editMode === 'text' ? 'chips' : 'text')}
          >
            {editMode === 'text' ? 'Edit as Chips' : 'Edit as Text'}
          </Button>
        </div>
      </div>
      
      {editMode === 'text' ? (
        <Textarea 
          id="skills" 
          value={skills} 
          onChange={(e) => handleSkillsChange(e.target.value)} 
          placeholder="List your key skills, separated by commas (e.g., JavaScript, React, Project Management)"
          rows={3}
        />
      ) : (
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <span>{skill}</span>
                <button 
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSkill(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <Button 
              className="rounded-l-none"
              onClick={(e) => {
                const input = e.target.previousSibling;
                handleAddSkill(input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}
      
      {skillsList.length > 0 && (
        <div className="mt-2">
          <Label className="text-sm text-gray-500">Preview:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {skillsList.map((skill, index) => (
              <Chip key={index} variant="primary">{skill}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;