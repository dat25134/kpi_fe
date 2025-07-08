import React, { ChangeEvent, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ChangeReasonInputProps = {
  value: string;
  onChange: (value: string) => void;
  errorMsg?: string[];
};

const ChangeReasonInput: React.FC<ChangeReasonInputProps> = ({ value, onChange, errorMsg }) => {
  // Dùng useCallback để tránh tạo hàm mới mỗi lần render
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="changeReason">Lý do thay đổi</Label>
      <Textarea
        id="changeReason"
        placeholder="Nhập lý do thay đổi công việc (tùy chọn)"
        value={value}
        onChange={handleChange}
        className="min-h-[80px] resize-none"
      />
      {errorMsg && <span className="text-red-500 text-xs">{errorMsg.join(" ")}</span>}
    </div>
  );
};

export default ChangeReasonInput; 