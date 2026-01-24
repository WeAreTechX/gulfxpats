import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  error,
  disabled = false,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Normalize date value to YYYY-MM-DD format
  const normalizedValue = React.useMemo(() => {
    if (!value) return '';
    const date = dayjs(value);
    if (date.isValid()) {
      return date.format('YYYY-MM-DD');
    }
    return '';
  }, [value]);

  const [currentMonth, setCurrentMonth] = React.useState(
    normalizedValue ? dayjs(normalizedValue) : dayjs()
  );

  React.useEffect(() => {
    if (normalizedValue) {
      setCurrentMonth(dayjs(normalizedValue));
    }
  }, [normalizedValue]);

  const selectedDate = normalizedValue ? dayjs(normalizedValue) : null;

  const handleDateSelect = (date: dayjs.Dayjs) => {
    // Check min/max constraints
    if (minDate && date.isBefore(dayjs(minDate), 'day')) {
      return;
    }
    if (maxDate && date.isAfter(dayjs(maxDate), 'day')) {
      return;
    }
    
    const formattedDate = date.format('YYYY-MM-DD');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  };

  const goToToday = () => {
    const today = dayjs();
    setCurrentMonth(today);
    if (!minDate || today.isAfter(dayjs(minDate), 'day') || today.isSame(dayjs(minDate), 'day')) {
      if (!maxDate || today.isBefore(dayjs(maxDate), 'day') || today.isSame(dayjs(maxDate), 'day')) {
        handleDateSelect(today);
      }
    }
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startOfCalendar = startOfMonth.startOf('week');
    const endOfCalendar = endOfMonth.endOf('week');
    
    const days: dayjs.Dayjs[] = [];
    let current = startOfCalendar;
    
    while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }
    
    return days;
  };

  const days = getCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const displayValue = selectedDate && selectedDate.isValid() 
    ? selectedDate.format('MMM D, YYYY') 
    : '';

  return (
    <div className={cn("w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full h-12 px-4 py-3 text-left text-sm border rounded-md",
              "bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00A558] focus:border-[#00A558]",
              "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300",
              "flex items-center justify-between"
            )}
          >
            <span className={cn(!displayValue && "text-gray-500")}>
              {displayValue || placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-semibold text-gray-900">
                {currentMonth.format('MMMM YYYY')}
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-xs font-medium text-gray-500 text-center py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                const isSelected = selectedDate?.isSame(day, 'day');
                const isCurrentMonth = day.month() === currentMonth.month();
                const isToday = day.isSame(dayjs(), 'day');
                const isDisabled = 
                  (minDate && day.isBefore(dayjs(minDate), 'day')) ||
                  (maxDate && day.isAfter(dayjs(maxDate), 'day'));

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    // @ts-ignore
                    disabled={isDisabled}
                    className={cn(
                      "h-9 w-9 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00A558]",
                      !isCurrentMonth && "text-gray-300",
                      isCurrentMonth && !isSelected && !isToday && "text-gray-900",
                      isToday && !isSelected && "bg-blue-50 text-green-600 font-medium",
                      isSelected && "bg-[#00A558] text-white font-medium hover:bg-[#00A558]",
                      isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {day.date()}
                  </button>
                );
              })}
            </div>

            {/* Today button */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={goToToday}
                className="w-full text-sm text-[#00A558] hover:text-[#00A558]/80 font-medium py-2"
              >
                Today
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

