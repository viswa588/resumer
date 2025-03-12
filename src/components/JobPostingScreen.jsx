import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function JobPostingPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Job Posting Page */}
      <Card>
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="job-title">Job Title</Label>
              <Input id="job-title" placeholder="Enter job title" />
            </div>
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" placeholder="Enter company name" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter job location" />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" placeholder="Enter salary details" />
            </div>
            <div>
              <Label htmlFor="job-type">Job Type</Label>
              <Input id="job-type" placeholder="e.g. Remote, Onsite, Hybrid" />
            </div>
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" placeholder="Enter job description" />
            </div>
            <Button type="submit" className="w-full">Post Job</Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Job Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Job Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Email Alerts</Label>
              <Switch id="email-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <Switch id="sms-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-alerts">Push Notifications</Label>
              <Switch id="push-alerts" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
