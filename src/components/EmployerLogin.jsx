import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { loginUser, USER_TYPES } from "../services/authService";
import { Alert, AlertDescription } from "./ui/alert";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export default function EmployerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(USER_TYPES.EMPLOYER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => { 
    // Form validation
    if(!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if(!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if(password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call login service
      const result = await loginUser({ email, password });
      
      if (result.success) {
        // Check if user type matches selected role
        if (result.user.userType !== userRole) {
          setError(`This account is registered as a ${result.user.userType}. Please select the correct user type.`);
          setIsSubmitting(false);
          return;
        }
        
        // Redirect based on user type
        if (result.user.userType === USER_TYPES.EMPLOYER) {
          navigate('/employer-dashboard');
        } else {
          navigate('/home');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="text-sm text-gray-500">Login to manage your jobs and applicants</p>
        
        <div className="mt-6 space-y-4">
          {/* Role Selection */}
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">I am a:</Label>
            <RadioGroup 
              defaultValue={USER_TYPES.EMPLOYER} 
              className="flex space-x-4"
              value={userRole}
              onValueChange={setUserRole}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={USER_TYPES.EMPLOYER} id="employer" />
                <Label htmlFor="employer">Employer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={USER_TYPES.JOB_SEEKER} id="jobseeker" />
                <Label htmlFor="jobseeker">Job Seeker</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="mt-1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setError('')}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="mt-1 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setError('')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="text-right text-sm text-gray-500 mt-2">
          <a href="/forgot-password" className="hover:underline">Forgot Password?</a>
        </div>

        <Button 
          onClick={handleLogin} 
          className="w-full mt-4 bg-green-500 hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "LOGGING IN..." : "LOG IN"}
        </Button>
        
        <div className="flex items-center gap-2 mt-4">
          <Separator className="flex-1" />
          <span className="text-gray-500 text-sm">Or Continue with</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button className="p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100">
            <FcGoogle size={24} />
          </button>
          <button className="p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100">
            <FaFacebook size={24} className="text-blue-600" />
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          New User? <a href="/register" className="font-medium text-gray-900 hover:underline">Create Account</a>
        </p>
      </Card>
    </div>
  );
}