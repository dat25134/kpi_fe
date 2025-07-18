import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Crown, Loader2 } from "lucide-react";
import { usePositionStats } from "@/hooks/usePositionStats";

export default function PositionStats({ timeFilter }: { timeFilter: string }) {
  const { data, loading, error } = usePositionStats(timeFilter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2" />
          Thống kê theo chức vụ
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {data
              .filter((pos: any) => pos.count > 0)
              .map((pos: any, index: number) => (
                <div key={pos.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Crown
                      className={`h-5 w-5 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : index === 2
                          ? "text-orange-500"
                          : "text-gray-300"
                      }`}
                    />
                    <span className="font-medium">{pos.display_name}</span>
                  </div>
                  <span className="text-sm text-gray-500 text-right min-w-[48px]">{pos.count} người</span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 