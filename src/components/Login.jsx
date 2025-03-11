import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        {/* <button className="mb-4 text-gray-600">
          &larr;
        </button> */}
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
        <p className="text-sm text-gray-500">Fill your details or continue with social media</p>
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <Input type="email" placeholder="Enter your mail" className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="mt-1 pr-10"
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

        <div className="text-right text-sm text-gray-500 mt-2">
          <a href="#" className="hover:underline">Forgot Password?</a>
        </div>

        <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">LOG IN</Button>
        
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
          New User? <a href="#" className="font-medium text-gray-900 hover:underline">Create Account</a>
        </p>
      </Card>
    </div>
  );
}