"use client"

import { type EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaCategory from "./CriteriaCategory"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EvaluationCriteriaListProps } from '@/types/evaluation';
import { useState, useEffect } from "react"

interface Props extends EvaluationCriteriaListProps {
  fieldErrors?: Record<string, string[]>;
  currentUserRole?: string;
  evaluationStatus?: string;
  creatorRole?: string;
  level1ApproverRole?: string;
  level2ApproverRole?: string;
}

export default function EvaluationCriteriaList({ 
  details, 
  onScoreChange, 
  onCommentChange, 
  isReadOnly, 
  fieldErrors,
  currentUserRole = "nhanvien",
  evaluationStatus = "draft",
  creatorRole,
  level1ApproverRole,
  level2ApproverRole
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

  // Xác định quyền nhập cho từng tab
  const isSelfEditable = currentUserRole === creatorRole && evaluationStatus === 'draft';
  const isLevel1Editable = currentUserRole === level1ApproverRole && (evaluationStatus === 'submitted' || evaluationStatus === 'level1_approved');
  const isLevel2Editable = currentUserRole === level2ApproverRole && (evaluationStatus === 'level1_approved' || evaluationStatus === 'level2_approved');

  // Xác định tabs hiển thị dựa trên role, status và dữ liệu đã có
  const getVisibleTabs = () => {
    const tabs = [];

    // Tab tự đánh giá: luôn hiển thị để xem, chỉ cho nhập nếu là người tạo và draft
    tabs.push('self');

    // Tab đánh giá cấp 1: hiển thị nếu user là level1ApproverRole hoặc đã có dữ liệu level1_score hoặc phiếu đã qua trạng thái cấp 1
    const hasLevel1 = details.some(item => item.level1_score !== null && item.level1_score !== undefined);
    if (
      currentUserRole === level1ApproverRole ||
      evaluationStatus === 'level1_approved' ||
      evaluationStatus === 'level2_approved' ||
      evaluationStatus === 'completed' ||
      hasLevel1
    ) {
      tabs.push('level1');
    }

    // Tab đánh giá cấp 2: hiển thị nếu user là level2ApproverRole hoặc đã có dữ liệu level2_score hoặc phiếu đã qua trạng thái cấp 2
    const hasLevel2 = details.some(item => item.level2_score !== null && item.level2_score !== undefined);
    if (
      currentUserRole === level2ApproverRole ||
      evaluationStatus === 'level2_approved' ||
      evaluationStatus === 'completed' ||
      hasLevel2
    ) {
      tabs.push('level2');
    }

    return tabs;
  };

  const visibleTabs = getVisibleTabs();
  const defaultTab = visibleTabs[0];

  // State để theo dõi tab đang active
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Autofill dữ liệu khi vào tab đánh giá cấp 1 hoặc cấp 2
  useEffect(() => {
    if (activeTab === 'level1') {
      details.forEach(item => {
        if ((item.level1_score == null || item.level1_score === '') && item.self_score != null && item.self_score !== '') {
          onScoreChange?.(item.id, 'level1_score', item.self_score);
        }
        if ((item.level1_comment == null || item.level1_comment === '') && item.self_comment != null && item.self_comment !== '') {
          onCommentChange?.(item.id, 'level1_comment', item.self_comment);
        }
      });
    }
    if (activeTab === 'level2') {
      details.forEach(item => {
        if ((item.level2_score == null || item.level2_score === '') && item.level1_score != null && item.level1_score !== '') {
          onScoreChange?.(item.id, 'level2_score', item.level1_score);
        }
        if ((item.level2_comment == null || item.level2_comment === '') && item.level1_comment != null && item.level1_comment !== '') {
          onCommentChange?.(item.id, 'level2_comment', item.level1_comment);
        }
      });
    }
  }, [activeTab, details, onScoreChange, onCommentChange]);

  return (
    <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
              isReadOnly={!isSelfEditable}
            />
          ))}
        </TabsContent>
      )}
      
      {visibleTabs.includes('level1') && (
        <TabsContent value="level1">
          {evaluationStatus === 'submitted' && (
            <div className="mb-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-300 rounded px-3 py-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 11-2 0v-3a1 1 0 112 0v3z"/></svg>
              Kết quả này được tham khảo từ <span className="font-bold ml-1">Tự đánh giá</span>. Nếu không có gì thay đổi, bạn có thể gửi đánh giá luôn.
            </div>
          )}
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
              isReadOnly={!isLevel1Editable}
            />
          ))}
        </TabsContent>
      )}
      
      {visibleTabs.includes('level2') && (
        <TabsContent value="level2">
          {evaluationStatus === 'level1_approved' && (
            <div className="mb-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-300 rounded px-3 py-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 11-2 0v-3a1 1 0 112 0v3z"/></svg>
              Kết quả này được tham khảo từ <span className="font-bold ml-1">Đánh giá cấp 1</span>. Nếu không có gì thay đổi, bạn có thể gửi đánh giá luôn.
            </div>
          )}
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
              isReadOnly={!isLevel2Editable}
            />
          ))}
        </TabsContent>
      )}
    </Tabs>
  )
} 