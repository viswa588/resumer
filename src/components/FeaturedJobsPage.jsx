import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const jobs = [
  {
    title: "Frontend Developer",
    company: "Twitter",
    location: "London",
    salary: "$2000/Mo",
    type: "Remote",
  },
  {
    title: "Backend Developer",
    company: "Google",
    location: "New York",
    salary: "$3000/Mo",
    type: "Onsite",
  },
  {
    title: "UI/UX Designer",
    company: "Facebook",
    location: "San Francisco",
    salary: "$2500/Mo",
    type: "Hybrid",
  },
];

export default function FeaturedJobsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Featured Jobs Page */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <Card key={index} className="p-4">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-500">{job.company} - {job.location}</p>
                <p className="text-gray-600">{job.salary} - {job.type}</p>
                <Button className="mt-2">Apply Now</Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
