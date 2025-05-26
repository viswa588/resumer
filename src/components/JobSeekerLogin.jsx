import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { loginUser, USER_TYPES } from "../services/authService";
import { saveUserProfile } from "../services/userService";
import { initializeSampleJobs } from "../services/jobService";
import { initializeSampleData } from "../data/sampleData";
import { createSampleNotifications } from "../services/notificationService";
import backgroundImage from "../assets/jobseekarbackground.jpeg";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function JobSeekerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (email === "student@re.com" && password === "$tudent") {
      // Initialize sample data
      initializeSampleData();
      initializeSampleJobs();
      
      // Save user data for demo account
      saveUserProfile({
        email: "student@re.com",
        firstName: "John",
        lastName: "Student",
        role: "jobSeeker",
        about: "I am a passionate job seeker looking for opportunities in software development."
      });
      
      // Store user email in localStorage for notification handling
      localStorage.setItem('userEmail', "student@re.com");
      localStorage.setItem('userFirstName', "John");
      localStorage.setItem('userLastName', "Student");
      localStorage.setItem('userRole', "jobseeker");
      
      // Create sample notifications for demo account
      createSampleNotifications("student@re.com");
      
      // Navigate to profile page instead of dashboard
      navigate("/profile");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      // Initialize sample jobs
      initializeSampleJobs();
      
      const result = await loginUser({
        email,
        password,
        userType: USER_TYPES.JOB_SEEKER,
      });

      if (result.success) {
        if (result.user.userType !== USER_TYPES.JOB_SEEKER) {
          setError(
            `This account is registered as an employer. Please use the employer login.`
          );
          setIsSubmitting(false);
          return;
        }
        
        // Save user data
        saveUserProfile({
          email,
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          role: "jobSeeker"
        });
        
        // Store user email in localStorage for notification handling
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userFirstName', result.user.firstName || "");
        localStorage.setItem('userLastName', result.user.lastName || "");
        localStorage.setItem('userRole', "jobseeker");
        
        // Create sample notifications for this user
        createSampleNotifications(email);
        
        // Navigate to profile page instead of dashboard
        navigate("/profile");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" 
    style={{ 
      backgroundImage: `url(${backgroundImage})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      width: '100%',
      height: '100vh'
    }}>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[90%] sm:max-w-md"
        >
          <Card className="rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                 Your Career Journey Starts Here
              </motion.h2>
              <p className="text-sm text-center text-gray-500 mb-6">
                Log in to your account
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setError("")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="mt-1 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setError("")}
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

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="text-right text-sm text-gray-500">
                  <a
                    onClick={() => navigate("/forgot-password")}
                    className="hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </a>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full mt-2 text-lg rounded-xl bg-blue-500 hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "LOGGING IN..." : "LOG IN"}
                  </Button>
                </motion.div>
              </form>

              <div className="flex items-center gap-2 mt-6">
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

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-500">
                  New User?{" "}
                  <a
                    onClick={() => navigate("/register")}
                    className="font-medium text-gray-900 hover:underline cursor-pointer"
                  >
                    Create Job Seeker Account
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  Are you an employer?{" "}
                  <a
                    onClick={() => navigate("/employer-login")}
                    className="font-medium text-gray-900 hover:underline cursor-pointer"
                  >
                    Employer Login
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}