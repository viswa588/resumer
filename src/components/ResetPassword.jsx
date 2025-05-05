import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { validateResetToken, resetPassword } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (!tokenFromUrl) {
      setError("Invalid reset link. Please request a new password reset.");
      setIsLoading(false);
      return;
    }

    setToken(tokenFromUrl);

    // Validate the token
    const validateToken = async () => {
      try {
        const result = await validateResetToken(tokenFromUrl);
        if (result.success) {
          setIsTokenValid(true);
          setEmail(result.email);
        } else {
          setError(result.message);
          setIsTokenValid(false);
        }
      } catch (err) {
        setError("Failed to validate reset token. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [location]);

  const handleSubmit = async () => {
    // Reset states
    setError("");
    setSuccess("");

    // Form validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call reset password service
      const result = await resetPassword(token, password);

      if (result.success) {
        setSuccess(result.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <p className="text-gray-500">Validating your reset link...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate("/forgot-password")}
            className="w-full mt-4 bg-green-500 hover:bg-green-600"
          >
            Request New Reset Link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a new password for your account: {email}
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
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

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="mt-1 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setError("")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              {success} Redirecting to login page...
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full mt-4 bg-green-500 hover:bg-green-600"
          disabled={isSubmitting || success}
        >
          {isSubmitting ? "RESETTING..." : "RESET PASSWORD"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{" "}
          <a href="/login" className="font-medium text-gray-900 hover:underline">
            Back to Login
          </a>
        </p>
      </Card>
    </div>
  );
}