import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";
import React from "react";

interface UserProfileProjectsProps {
  userProfile: any;
}

export default function UserProfileProjects({ userProfile }: UserProfileProjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Dự án tham gia
        </CardTitle>
        <CardDescription>Danh sách các dự án đang tham gia hoặc đã hoàn thành</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {userProfile?.projects?.map((project: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-gray-500">Vai trò: {project.role}</p>
              </div>
              <Badge variant={project.status === "Hoàn thành" ? "default" : "secondary"}>{project.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 