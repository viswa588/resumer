import { Button } from "./ui/button";
import HomePageImage from "../assets/homepage.png";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100">
      {/* Container */}
      <div className="max-w-3xl text-center">
        {/* Illustration */}
        <img
          src={HomePageImage} // Update the path based on your assets folder
          alt="Find a Perfect Job Match"
          className="w-full max-w-sm mx-auto mb-6"
        />

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Find a <span className="text-green-600">Perfect</span> Job Match
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg mt-3">
          Finding your dream job is easier and faster with <strong>Resumer</strong>.
        </p>

        {/* CTA Button */}
        <Button className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 text-lg rounded-lg">
          Let’s Get Started →
        </Button>
      </div>
    </div>
  );
}
