"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { useEmployeesWithActivity } from "@/hooks/useEmployeesWithActivity";

// Mock employee data with detailed info
const employeeData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    department: "Engineering",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=300&h=300&fit=crop&crop=face",
    email: "sarah.johnson@company.com",
    location: "San Francisco, CA",
    joinDate: "March 2021",
    bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Leads the frontend architecture team and mentors junior developers.",
    ratings: [
      { id: 1, rating: 5, comment: "Exceptional problem solver and great team player!", author: "Michael Chen", date: "2024-01-15" },
      { id: 2, rating: 4, comment: "Very knowledgeable and always willing to help others.", author: "Emily Rodriguez", date: "2024-01-10" },
      { id: 3, rating: 5, comment: "Outstanding technical skills and leadership qualities.", author: "David Kim", date: "2024-01-05" }
    ]
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { byId, addRating } = useEmployeesWithActivity();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const employee = byId(Number(id));

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Employee not found</h1>
          <p className="text-slate-600 mb-4">We couldn't find this profile. It may have been removed.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const averageRating = employee.ratings.length
    ? employee.ratings.reduce((sum, r) => sum + r.rating, 0) / employee.ratings.length
    : 0;

  const handleSubmitRating = () => {
    addRating(employee.id, {
      rating: newRating,
      comment: newComment.trim(),
      author: "You",
      date: new Date().toISOString().slice(0, 10),
    });
    setIsRatingModalOpen(false);
    setNewRating(5);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="w-px h-6 bg-slate-200" />
            <h1 className="text-xl font-semibold text-slate-900">Employee Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Employee Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{employee.name}</h2>
                <p className="text-lg text-slate-600 mb-4">{employee.title}</p>
                
                <div className="flex items-center justify-center mb-4">
                  <StarRating rating={averageRating} size="lg" />
                </div>

                <Button 
                  onClick={() => router.push(`/employees/${id}/edit`)} 
                  variant="outline" 
                  className="w-full mb-3"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>—</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined —</span>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-slate-900 mb-2">Department</p>
                  <Badge variant="secondary">{employee.department}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="font-medium text-slate-900 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bio and Ratings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{employee.notes || "No bio provided."}</p>
              </CardContent>
            </Card>

            {/* Ratings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Ratings & Reviews</CardTitle>
                <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Rating
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rate {employee.name}</DialogTitle>
                      <DialogDescription>
                        Share your experience working with this employee.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Rating
                        </label>
                        <StarRating 
                          rating={newRating} 
                          interactive 
                          onRatingChange={setNewRating}
                          size="lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Comment
                        </label>
                        <Textarea
                          placeholder="Share your thoughts about working with this employee..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsRatingModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitRating}>
                        Submit Rating
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.ratings.map((rating) => (
                  <div key={rating.id} className="border-l-4 border-slate-100 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <StarRating rating={rating.rating} size="sm" />
                        <span className="text-sm font-medium text-slate-700">{rating.author}</span>
                      </div>
                      <span className="text-xs text-slate-500">{rating.date}</span>
                    </div>
                    <p className="text-slate-600">{rating.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}