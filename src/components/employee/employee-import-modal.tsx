"use client"

import { useState } from "react"
import { Modal } from "antd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { useImportEmployees } from '@/hooks/useEmployees';

interface EmployeeImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported?: () => void
}

interface EmployeePreview {
  [key: string]: string
}

export default function EmployeeImportModal({ open, onOpenChange, onImported }: EmployeeImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<EmployeePreview[]>([])
  const [error, setError] = useState<string | null>(null)
  const { importEmployees, loading, success } = useImportEmployees();
  const [inputKey, setInputKey] = useState(0)

  // Đọc file và parse CSV/Excel
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setPreview([])
    const f = e.target.files?.[0]
    setFile(f || null)
    if (!f) return
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (ext === "csv") {
      try {
        const text = await f.text()
        const lines = text.split(/\r?\n/).filter(Boolean)
        if (lines.length < 2) {
          setError("File không có dữ liệu.")
          return
        }
        const headers = lines[0].split(",").map(h => h.trim())
        const data = lines.slice(1).map(line => {
          const values = line.split(",")
          const obj: EmployeePreview = {}
          headers.forEach((h, i) => {
            obj[h] = values[i] || ""
          })
          return obj
        })
        setPreview(data)
      } catch (err) {
        setError("Không thể đọc file CSV. Vui lòng thử lại.")
      }
    } else if (ext === "xls" || ext === "xlsx") {
      try {
        const data = await f.arrayBuffer()
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json: EmployeePreview[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" })
        if (json.length === 0) {
          setError("File không có dữ liệu.")
          return
        }
        setPreview(json)
      } catch (err) {
        setError("Không thể đọc file Excel. Vui lòng thử lại.")
      }
    } else {
      setError("Chỉ hỗ trợ file CSV hoặc Excel (.csv, .xls, .xlsx).")
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!file) {
      setError("Vui lòng chọn file để import.")
      return
    }
    try {
      const data = await importEmployees(file)
      if (data.success) {
        toast.success("Import nhân viên thành công!")
        onOpenChange(false)
        onImported?.()
      } else {
        setError(data.message || "Import thất bại.")
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.")
    }
  }

  // Reset state khi đóng modal
  const handleClose = () => {
    setFile(null)
    setPreview([])
    setError(null)
    setInputKey(prev => prev + 1)
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Import nhân viên từ file"
      footer={null}
      width={1200}
    >
      <div className="mb-2 text-gray-600">Chọn file CSV/Excel, kiểm tra danh sách preview, sau đó nhấn Import để tải lên.</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input key={inputKey} type="file" accept=".csv,.xls,.xlsx" onChange={handleFileChange} />
        {preview.length > 0 && (
          <div className="max-h-64 overflow-x-auto overflow-y-auto border rounded">
            <table className="min-w-max w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b bg-gray-50 text-left min-w-[60px] whitespace-nowrap font-semibold">STT</th>
                  {Object.keys(preview[0]).map((h) => (
                    <th key={h} className="px-3 py-2 border-b bg-gray-50 text-left min-w-[120px] whitespace-nowrap font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 border-b min-w-[60px] whitespace-nowrap font-semibold">{i + 1}</td>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-3 py-2 border-b min-w-[120px] whitespace-nowrap">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading || !file}>
            {loading ? "Đang import..." : "Import"}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 