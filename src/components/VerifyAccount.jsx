import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";

export default function VerifyAccount() {
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleResendCode = () => {
    setTimer(59);
    setIsResendDisabled(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm p-6 shadow-md">
        <h2 className="text-center text-2xl font-bold">Verify Account</h2>
        <p className="text-center text-gray-600 mt-2">
          Code has been sent to <span className="font-semibold">xxxxx@xxxx.com</span>.
          <br /> Enter the code to verify your account.
        </p>

        <CardContent className="mt-4 space-y-4">
          <div>
            <label htmlFor="code" className="text-sm font-medium text-gray-700">
              Enter Code
            </label>
            <Input id="code" placeholder="8 Digit Code" maxLength={8} className="mt-1 text-center text-lg tracking-widest" />
          </div>

          <div className="text-center text-sm text-gray-600">
            Didn’t receive a code?{" "}
            <button
              onClick={handleResendCode}
              className={`font-medium ${isResendDisabled ? "text-gray-400" : "text-blue-600 hover:underline"}`}
              disabled={isResendDisabled}
            >
              Resend Code
            </button>
            <p className="mt-1">{isResendDisabled ? `Resend code in 00:${timer < 10 ? `0${timer}` : timer}` : ""}</p>
          </div>

          <Button  className="w-full bg-green-600 hover:bg-green-700">
            Verify Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
