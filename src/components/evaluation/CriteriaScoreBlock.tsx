"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, getScoreColor } from "@/lib/utils";

interface CriteriaScoreBlockProps {
  label: string;
  score: string | null | undefined;
  comment: string | null | undefined;
  maxScore: string;
  placeholder: string;
  readOnly?: boolean;
  onScoreChange?: (value: string) => void;
  onCommentChange?: (value: string) => void;
}

export default function CriteriaScoreBlock({
  label,
  score,
  comment,
  maxScore,
  placeholder,
  readOnly = false,
  onScoreChange,
  onCommentChange,
}: CriteriaScoreBlockProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          max={parseFloat(maxScore)}
          step="0.5"
          value={score || ""}
          onChange={e => onScoreChange?.(e.target.value)}
          readOnly={readOnly}
          className={cn("w-20", getScoreColor(score || "0", maxScore))}
        />
        <span className="text-sm text-gray-500">/ {maxScore}</span>
      </div>
      <Textarea
        placeholder={placeholder}
        value={comment || ""}
        onChange={e => onCommentChange?.(e.target.value)}
        readOnly={readOnly}
        className="min-h-[80px] text-sm"
      />
      {/* Final Score */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-2">
        <span className="font-medium text-sm">Điểm cuối cùng:</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-bold text-lg",
            getScoreColor(score || "0", maxScore)
          )}>
            {score || "0"}
          </span>
          <span className="text-sm text-gray-500">
            / {maxScore}
          </span>
        </div>
      </div>
    </div>
  );
} 