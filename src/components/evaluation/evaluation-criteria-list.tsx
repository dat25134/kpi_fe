"use client"

import { type EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaCategory from "./CriteriaCategory"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EvaluationCriteriaListProps } from '@/types/evaluation';

interface Props extends EvaluationCriteriaListProps {
  fieldErrors?: Record<string, string[]>;
  currentUserRole?: string;
  evaluationStatus?: string;
}

export default function EvaluationCriteriaList({ 
  details, 
  onScoreChange, 
  onCommentChange, 
  isReadOnly, 
  fieldErrors,
  currentUserRole = "nhanvien",
  evaluationStatus = "draft"
}: Props) {
  // Group criteria by category
  const groupedCriteria = details?.reduce((acc, item) => {
    const category = item.criteria.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, EvaluationCriteriaDetail[]>)

  if (!details || details.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">Chưa có tiêu chí đánh giá trong đợt này</div>
    )
  }

  // Gom lỗi theo từng loại tab
  const errorsByTab = {
    self: [] as string[],
    level1: [] as string[],
    level2: [] as string[],
  };
  if (fieldErrors) {
    Object.entries(fieldErrors).forEach(([key, arr]) => {
      if (key.includes('.self_')) errorsByTab.self.push(...arr);
      if (key.includes('.level1_')) errorsByTab.level1.push(...arr);
      if (key.includes('.level2_')) errorsByTab.level2.push(...arr);
    });
  }

  // Xác định tabs hiển thị dựa trên role và status
  const getVisibleTabs = () => {
    // Đối với tự đánh giá (nhanvien, chuyenvien) - chỉ hiển thị tab tự đánh giá
    if (currentUserRole === 'nhanvien' || currentUserRole === 'chuyenvien') {
      return ['self'];
    }
    
    // Đối với đánh giá cấp 1 (truongphong, phophong) - hiển thị tự đánh giá và cấp 1
    if (currentUserRole === 'truongphong' || currentUserRole === 'phophong') {
      return ['self', 'level1'];
    }
    
    // Đối với đánh giá cấp 2 (admin, chutich, phochutich) - hiển thị cả 3 tab
    if (currentUserRole === 'admin' || currentUserRole === 'chutich' || currentUserRole === 'phochutich') {
      return ['self', 'level1', 'level2'];
    }
    
    // Mặc định chỉ hiển thị tự đánh giá
    return ['self'];
  };

  const visibleTabs = getVisibleTabs();
  const defaultTab = visibleTabs[0];

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className={`w-full grid mb-4 ${visibleTabs.length === 1 ? 'grid-cols-1' : visibleTabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {visibleTabs.includes('self') && (
          <TabsTrigger value="self">Tự đánh giá</TabsTrigger>
        )}
        {visibleTabs.includes('level1') && (
          <TabsTrigger value="level1">Đánh giá cấp 1</TabsTrigger>
        )}
        {visibleTabs.includes('level2') && (
          <TabsTrigger value="level2">Đánh giá cấp 2</TabsTrigger>
        )}
      </TabsList>
      
      {visibleTabs.includes('self') && (
        <TabsContent value="self">
          {errorsByTab.self.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
              <ul className="list-disc pl-5">
                {errorsByTab.self.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          {Object.entries(groupedCriteria).map(([category, items]) => (
            <CriteriaCategory
              key={category}
              category={category}
              criteria={items}
              onScoreChange={onScoreChange}
              onCommentChange={onCommentChange}
              mode="self"
              isReadOnly={isReadOnly}
            />
          ))}
        </TabsContent>
      )}
      
      {visibleTabs.includes('level1') && (
        <TabsContent value="level1">
          {errorsByTab.level1.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
              <ul className="list-disc pl-5">
                {errorsByTab.level1.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          {Object.entries(groupedCriteria).map(([category, items]) => (
            <CriteriaCategory
              key={category}
              category={category}
              criteria={items}
              onScoreChange={onScoreChange}
              onCommentChange={onCommentChange}
              mode="level1"
              isReadOnly={isReadOnly}
            />
          ))}
        </TabsContent>
      )}
      
      {visibleTabs.includes('level2') && (
        <TabsContent value="level2">
          {errorsByTab.level2.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
              <ul className="list-disc pl-5">
                {errorsByTab.level2.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
          {Object.entries(groupedCriteria).map(([category, items]) => (
            <CriteriaCategory
              key={category}
              category={category}
              criteria={items}
              onScoreChange={onScoreChange}
              onCommentChange={onCommentChange}
              mode="level2"
              isReadOnly={isReadOnly}
            />
          ))}
        </TabsContent>
      )}
    </Tabs>
  )
} 