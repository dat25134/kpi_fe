import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Award } from "lucide-react";
import React from "react";

interface UserProfileSkillsProps {
  isEditing: boolean;
  formData: any;
  userProfile: any;
  handleInputChange: (field: string, value: string) => void;
}

export default function UserProfileSkills({
  isEditing,
  formData,
  userProfile,
  handleInputChange,
}: UserProfileSkillsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5" />
          Kỹ năng chuyên môn
        </CardTitle>
        <CardDescription>Danh sách các kỹ năng và công nghệ thành thạo</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="skills">Kỹ năng (cách nhau bởi dấu phẩy)</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              className="min-h-[100px]"
              placeholder="VD: JavaScript, React, Node.js, Python"
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userProfile?.skills?.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 