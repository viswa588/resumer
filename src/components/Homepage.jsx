import { Button } from "./ui/button";
import HomePageImage from "../assets/homepage.png";

export default function HomePage() {
  const handleButtonClick = () => {
    window.location.href = "/profile"; // Redirect to the profile page
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100">
      {/* Container */}
      <div className="max-w-3xl text-center">
        {/* Illustration */}
        <img
          src={HomePageImage} // Update the path based on your assets folder
          alt="Find a Perfect Part-Time Job for Students"
          className="w-full max-w-sm mx-auto mb-6"
        />

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Find the <span className="text-green-600">Perfect Part-Time Job</span> for Students
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg mt-3">
          Balance your studies with flexible work opportunities designed for students.
        </p>

        {/* Student Benefits */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-600">Flexible Hours</h3>
            <p className="text-sm text-gray-600">Work around your class schedule with jobs that understand student needs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-600">Campus Proximity</h3>
            <p className="text-sm text-gray-600">Find jobs on campus or nearby to minimize commute time</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-600">Relevant Experience</h3>
            <p className="text-sm text-gray-600">Gain valuable work experience while completing your degree</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button onClick={()=> handleButtonClick()} className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-3 text-lg rounded-lg">
          Find Student Jobs →
        </Button>
      </div>
    </div>
  );
}