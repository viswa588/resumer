import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mail, MapPin } from "lucide-react";
import FeaturedJobsPage from "./FeaturedJobsPage";

const UserAvatar = ({ name, src }) => {
  return (
    <Avatar className="w-20 h-20">
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Page */}
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <UserAvatar name="John Smith" src="/avatar-placeholder.png" />
          <div>
            <CardTitle className="text-xl font-semibold">John Smith</CardTitle>
            <p className="text-gray-500 flex items-center gap-1">
              <Mail className="w-4 h-4" /> jithendra@gmail.com
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Remote Job
            </p>
          </div>
        </CardHeader>
      </Card>
      
      {/* About Me */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem...
          </p>
        </CardContent>
      </Card>
      
      {/* Featured Job */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Frontend Developer</h3>
            <p className="text-gray-500">Twitter - London</p>
            <p className="text-gray-600">$2000/Mo - Remote</p>
            <Button>Apply Now</Button>
          </div>
        </CardContent>
      </Card>

      <FeaturedJobsPage />
    </div>
  );
}
