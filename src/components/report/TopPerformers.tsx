import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { User, Loader2 } from "lucide-react";
import { useTopPerformers } from "@/hooks/useTopPerformers";
import { Avatar, AvatarFallback } from "../ui/avatar";

export interface TopPerformersProps {
  departmentId?: string;
}

export default function TopPerformers({ departmentId }: TopPerformersProps) {
  const { data, isLoading, error } = useTopPerformers({ departmentId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Không thể tải dữ liệu top performers</div>
        ) : (
          <div className="space-y-4">
            {data && data.length > 0 ? data.map((user: any, idx: number) => (
              <div key={user.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-900 text-xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.position}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">KPI: {user.kpi}</div>
                  {user.score !== undefined && <div className="text-sm text-gray-500">Score: {user.score}</div>}
                </div>
              </div>
            )) : <div className="text-gray-400 text-center">Không có dữ liệu</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 