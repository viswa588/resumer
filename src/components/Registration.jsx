import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6 shadow-md">
        <h2 className="text-center text-2xl font-bold">Register</h2>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="JohnSmith" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Reddy" />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">Must contain 8 char.</p>
          </div>

          <div className="relative">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-600">
            By Create Account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
