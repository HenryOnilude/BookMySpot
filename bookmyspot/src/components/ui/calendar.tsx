'use client';

import * as React from 'react';
import { format } from 'date-fns';

interface CalendarProps {
  mode?: 'single' | 'range';
  selected?: Date | Date[];
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className,
  disabled,
}: CalendarProps) {
  const today = new Date('2024-12-13T15:51:29Z');
  const [currentMonth, setCurrentMonth] = React.useState(today);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    selected instanceof Date ? selected : undefined
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateSelect = (date: Date) => {
    if (disabled?.(date)) return;
    
    setSelectedDate(date);
    onSelect?.(date);
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Render days of week header
    daysOfWeek.forEach((day) => {
      days.push(
        <div key={`header-${day}`} className="text-center font-medium text-sm py-2">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isDisabled = disabled?.(date) || false;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={isDisabled}
          className={`p-2 w-full text-center rounded-md ${
            isSelected
              ? 'bg-blue-600 text-white'
              : isDisabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ←
        </button>
        <div className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
