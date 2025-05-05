import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-gray-600">
                {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {userData.userType === 'employer' ? 'Employer' : 'Job Seeker'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Account Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Email:</div>
                <div>{userData.email}</div>
                <div className="text-gray-500">Account Type:</div>
                <div className="capitalize">{userData.userType}</div>
                <div className="text-gray-500">Joined:</div>
                <div>{new Date(userData.loggedInAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 mt-6">
              {userData.userType === 'employer' ? (
                <Button 
                  onClick={() => navigate('/employer-dashboard')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/home')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Jobs
                </Button>
              )}
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}