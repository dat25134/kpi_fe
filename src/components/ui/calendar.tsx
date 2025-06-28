"use client"

import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export type CalendarProps = {
  selected: Date | null
  onChange: (date: Date | null) => void
  className?: string
  minDate?: Date
  maxDate?: Date
  placeholderText?: string
  dateFormat?: string
  showPopperArrow?: boolean
  [key: string]: any
}

function Calendar({
  selected,
  onChange,
  className = "",
  minDate,
  maxDate,
  placeholderText = "Chọn ngày",
  dateFormat = "dd/MM/yyyy",
  showPopperArrow = false,
  ...props
}: CalendarProps) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className={className}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholderText}
      dateFormat={dateFormat}
      showPopperArrow={showPopperArrow}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
