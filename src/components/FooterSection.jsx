import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const FooterSection = ({ footer, onChange }) => {
  const handleTextChange = (value) => {
    onChange({
      ...footer,
      text: value
    });
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...footer.links];
    updatedLinks[index][field] = value;
    onChange({
      ...footer,
      links: updatedLinks
    });
  };

  const addLink = () => {
    onChange({
      ...footer,
      links: [...footer.links, { label: '', url: '' }]
    });
  };

  const removeLink = (index) => {
    if (footer.links.length <= 1) return;
    
    const updatedLinks = [...footer.links];
    updatedLinks.splice(index, 1);
    onChange({
      ...footer,
      links: updatedLinks
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resume Footer</h3>
      </div>
      
      <div>
        <Label htmlFor="footer-text">Footer Text</Label>
        <Input 
          id="footer-text"
          value={footer.text} 
          onChange={(e) => handleTextChange(e.target.value)} 
          placeholder="References available upon request"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Links</h4>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addLink}
          >
            Add Link
          </Button>
        </div>
        
        {footer.links.map((link, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <Input 
                value={link.label} 
                onChange={(e) => handleLinkChange(index, 'label', e.target.value)} 
                placeholder="LinkedIn"
              />
            </div>
            <div className="flex-1">
              <Input 
                value={link.url} 
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)} 
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            {footer.links.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Add links to your professional profiles or portfolio. These will appear in the footer of your resume.
      </p>
    </div>
  );
};

export default FooterSection;