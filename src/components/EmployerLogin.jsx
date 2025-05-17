import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Briefcase, Lock, Mail } from "lucide-react";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { loginUser, USER_TYPES } from "../services/authService";
import { saveUserProfile } from "../services/userService";
import { initializeSampleJobs } from "../services/jobService";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function EmployerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    // Form validation
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

    if (email === "employer@re.com" && password === "employer#") {
      // Initialize sample jobs
      initializeSampleJobs();
      
      // Save user data for demo account
      saveUserProfile({
        email: "employer@re.com",
        firstName: "Jane",
        lastName: "Employer",
        role: "employer",
        about: "HR Manager at Tech Innovations Inc. with 10+ years of experience in talent acquisition."
      });
      
      navigate("/employer-dashboard");
    } else {
      try {
        // Initialize sample jobs
        initializeSampleJobs();
        
        const result = await loginUser({ 
          email, 
          password,
          userType: USER_TYPES.EMPLOYER 
        });

        if (result.success) {
          if (result.user.userType !== USER_TYPES.EMPLOYER) {
            setError(`This account is registered as a job seeker. Please use the job seeker login.`);
            setIsSubmitting(false);
            return;
          }
          
          // Save user data
          saveUserProfile({
            email,
            firstName: result.user.firstName || "",
            lastName: result.user.lastName || "",
            role: "employer"
          });
          
          navigate("/employer-dashboard");
        } else {
          setError(result.message);
        }
      }
      catch (err) {
        setError("Login failed. Please try again.");
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')] opacity-20"></div>
      </div>
      
      {/* Animated circles */}
      <motion.div 
        className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-green-300 to-teal-400 opacity-20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 opacity-20 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Floating corporate icons with better visibility */}
      <motion.div 
        className="absolute top-20 left-20 text-white/30"
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <Briefcase size={70} />
      </motion.div>
      <motion.div 
        className="absolute bottom-20 right-20 text-white/30"
        animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      >
        <Lock size={70} />
      </motion.div>
      <motion.div 
        className="absolute top-1/3 right-1/4 text-white/30"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
      >
        <Mail size={60} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="rounded-xl shadow-2xl bg-white/95 backdrop-blur-md border border-white/30">
          <CardContent className="p-8">
            <motion.div
              className="flex flex-col items-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Briefcase className="w-12 h-12 mb-4 text-emerald-600" />
              <h2 className="text-3xl font-bold text-center text-gray-800">
                Employer Portal
              </h2>
              <p className="text-sm text-center text-gray-500 mt-1">
                Access your recruitment dashboard
              </p>
            </motion.div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Company Email
                </Label>
                <Input
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setError("")}
                  className="mt-1 pl-10"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="mt-1 pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setError("")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.p 
                  className="text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.div
                className="text-right text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <a 
                  onClick={() => navigate("/forgot-password")} 
                  className="hover:underline cursor-pointer hover:text-emerald-600 transition-colors"
                >
                  Forgot Password?
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full mt-2 h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Authenticating...
                    </span>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="flex items-center gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Separator className="flex-1" />
              <span className="text-gray-500 text-sm">Or continue with</span>
              <Separator className="flex-1" />
            </motion.div>

            <motion.div
              className="flex justify-center gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button className="p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all">
                <FcGoogle size={20} />
              </button>
              <button className="p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all">
                <FaFacebook size={20} className="text-teal-600" />
              </button>
            </motion.div>

            <motion.div
              className="mt-6 text-center space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-gray-500">
                New to our platform?{' '}
                <a 
                  onClick={() => navigate("/employer-registration")} 
                  className="font-medium text-emerald-600 hover:underline cursor-pointer"
                >
                  Create employer account
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Looking for jobs?{' '}
                <a 
                  onClick={() => navigate("/login")} 
                  className="font-medium text-emerald-600 hover:underline cursor-pointer"
                >
                  Job seeker login
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}