import { Button } from "./ui/button";
import HomePageImage from "../assets/homepage.png";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const handleStudentClick = () => {
    navigate("/login");
  };

  const handleEmployerClick = () => {
    navigate("/login");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-hero.jpg')" }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Top-left RE icon */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white text-black px-3 py-1 rounded-full shadow-md text-sm font-semibold tracking-wide">
          Re<span className="align-super text-xs">®</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 py-12 text-white">
        {/* Top Hero Text */}
        <div className="max-w-4xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Empowering <span className="text-green-400">Students</span> & <span className="text-blue-400">Employers</span> Together
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Students can discover flexible jobs while employers connect with eager talent. It's a win-win platform built for success.
          </p>
        </div>

        {/* Hero Illustration */}
        <section className="max-w-6xl w-full text-center">
          <img
            src={HomePageImage}
            alt="Find a Perfect Part-Time Job for Students"
            className="w-full max-w-sm mx-auto mb-6 drop-shadow-lg"
          />
        </section>

        {/* Dual Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 max-w-6xl w-full">
          {/* Student Card */}
          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-green-600 mb-3">For Students</h2>
            <p className="mb-4">
              Explore part-time jobs that fit your class schedule. Build real-world experience while staying on top of your studies.
            </p>
            <ul className="mb-6 space-y-2 list-disc list-inside text-sm text-gray-700">
              <li>Flexible and remote job options</li>
              <li>Opportunities near your campus</li>
              <li>Resume-building experience</li>
            </ul>
            <Button
              onClick={handleStudentClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-lg"
            >
              Find Student Jobs →
            </Button>
          </div>

          {/* Employer Card */}
          <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">For Employers</h2>
            <p className="mb-4">
              Post job openings, manage applications, and find motivated students ready to contribute to your organization.
            </p>
            <ul className="mb-6 space-y-2 list-disc list-inside text-sm text-gray-700">
              <li>Streamlined job posting dashboard</li>
              <li>Student profile discovery</li>
              <li>Application tracking tools</li>
            </ul>
            <Button
              onClick={handleEmployerClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg"
            >
              Post a Job →
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
