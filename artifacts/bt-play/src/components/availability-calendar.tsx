import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAvailability } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function toDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface Props {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export function AvailabilityCalendar({ onDateSelect, selectedDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { data, isLoading } = useGetAvailability();
  const unavailable = new Set(data?.unavailableDates ?? []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isPastMonth = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={isPastMonth}
          className="p-2 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="font-serif text-slate-900 text-lg">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-slate-50 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold tracking-widest uppercase text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateStr = toDateString(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const isUnavailable = unavailable.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const isAvailable = !isPast && !isUnavailable;

          return (
            <button
              key={i}
              onClick={() => isAvailable && onDateSelect?.(dateStr)}
              disabled={isPast || isUnavailable || isLoading}
              className={cn(
                "relative aspect-square flex items-center justify-center text-sm transition-all",
                isPast && "text-slate-300 cursor-not-allowed",
                isUnavailable && !isPast && "text-slate-300 cursor-not-allowed line-through",
                isAvailable && !isSelected && "text-slate-700 hover:bg-[#B5C2B7]/20 hover:text-[#B5C2B7] cursor-pointer",
                isSelected && "bg-[#B5C2B7] text-white font-medium",
                isToday && !isSelected && "font-bold underline underline-offset-2",
              )}
              aria-label={dateStr}
              title={isUnavailable ? "Already booked" : isAvailable ? "Available" : undefined}
            >
              {day}
              {isUnavailable && !isPast && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-300" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#B5C2B7] rounded-sm inline-block" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-slate-100 rounded-sm inline-block border border-slate-200" /> Unavailable
        </span>
      </div>
    </div>
  );
}
