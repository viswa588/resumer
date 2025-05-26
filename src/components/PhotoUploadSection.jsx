import React, { useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { FaCamera, FaTrash } from 'react-icons/fa';

const PhotoUploadSection = ({ onPhotoChange, initialPhoto = null }) => {
  const [photo, setPhoto] = useState(initialPhoto);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setPhoto(photoData);
        if (onPhotoChange) {
          onPhotoChange(photoData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (onPhotoChange) {
      onPhotoChange(null);
    }
  };

  return (
    <div className="mt-4">
      <Label className="block mb-2">Profile Photo</Label>
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {photo ? (
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <FaCamera className="text-3xl text-gray-400" />
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="profile-photo" className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md flex items-center">
            <FaCamera className="mr-2" /> Upload Photo
            <input
              type="file"
              id="profile-photo"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </label>
          {photo && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemovePhoto}
              className="text-red-500 hover:text-red-700 w-full"
            >
              <FaTrash className="mr-2" /> Remove
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Adding a professional photo can make your resume more personable. 
        Use a clear headshot with a neutral background.
      </p>
    </div>
  );
};

export default PhotoUploadSection;