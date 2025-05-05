import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { requestPasswordReset } from "../services/authService";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState(""); // For demo purposes only

  const handleSubmit = async () => {
    // Reset states
    setError("");
    setSuccess("");
    setResetToken("");

    // Form validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call password reset service
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(result.message);
        // For demo purposes only - in a real app, we would not expose the token
        if (result.token) {
          setResetToken(result.token);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to process your request. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setError("")}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* For demo purposes only - in a real app, this would not be shown */}
        {resetToken && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">Demo Reset Link:</p>
            <a
              href={`/reset-password?token=${resetToken}`}
              className="text-sm text-blue-600 hover:underline break-all"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/reset-password?token=${resetToken}`);
              }}
            >
              Click here to reset your password
            </a>
            <p className="text-xs text-gray-500 mt-1">
              (This is only shown for demonstration purposes)
            </p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full mt-4 bg-green-500 hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
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