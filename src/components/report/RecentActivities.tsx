import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";
import { useRecentActivities } from "@/hooks/useRecentActivities";

export interface RecentActivitiesProps {
  departmentId?: string;
  timeFilter?: string;
}

const COLOR_MAP: Record<string, string> = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  gray: "bg-gray-400"
};

export default function RecentActivities({ departmentId, timeFilter }: RecentActivitiesProps) {
  const { data, isLoading, error } = useRecentActivities({ departmentId, timeFilter });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Không thể tải dữ liệu hoạt động gần đây</div>
        ) : (
          <div className="space-y-3">
            {data && data.length > 0 ? data.map((activity: any) => (
              <div key={activity.id} className="flex items-start space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${COLOR_MAP[activity.color] || 'bg-gray-400'}`}></div>
                <span
                  title={activity.content}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    maxWidth: 260
                  }}
                >
                  {activity.content}
                </span>
              </div>
            )) : <div className="text-gray-400 text-center">Không có hoạt động nào gần đây</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 