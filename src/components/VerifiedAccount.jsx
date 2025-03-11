import { Card, CardContent } from "./ui/card";
import VerifiedAccountImage from "../assets/VerifiedAccount.png";

export default function VerifiedAccount() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 shadow-md text-center">
        <CardContent className="flex flex-col items-center">
          <img
            src={VerifiedAccountImage}
            alt="Account Verified"
            width={250}
            height={250}
            className="mb-4"
          />
          <p className="text-lg font-medium text-gray-700">Your account is verified now</p>
        </CardContent>
      </Card>
    </div>
  );
}
