'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from './input';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const minDate = new Date('2024-12-13T16:02:34Z');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  // Update the parent when our local state changes
  React.useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate, setDate]);

  // Update our local state when the parent date changes
  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      return;
    }

    // If we already have a date selected, preserve the time
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else {
      // If no date was previously selected, set time to current time
      const now = new Date('2024-12-13T16:02:34Z');
      newDate.setHours(now.getHours());
      newDate.setMinutes(now.getMinutes());
    }

    setSelectedDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDate) return;

    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    // Don't allow dates before the minimum date
    if (newDate < minDate) {
      newDate.setTime(minDate.getTime());
    }

    setSelectedDate(newDate);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex gap-2">
          <Input
            type="time"
            value={selectedDate ? format(selectedDate, "HH:mm") : ""}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":");
              const date = selectedDate || new Date();
              date.setHours(parseInt(hours));
              date.setMinutes(parseInt(minutes));
              setSelectedDate(date);
            }}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}
