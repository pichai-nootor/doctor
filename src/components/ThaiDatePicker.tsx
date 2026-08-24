import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import "react-datepicker/dist/react-datepicker.css";

// Register Thai locale
registerLocale('th', th);

interface ThaiDatePickerProps {
  value: string;
  onChange: (dateObj: Date | null, dateString: string) => void;
  className?: string;
  placeholderText?: string;
  required?: boolean;
}

const ThaiDatePicker = forwardRef<any, ThaiDatePickerProps>(({ 
  value, 
  onChange, 
  className,
  placeholderText = "วว/ดด/ปปปป",
  required = false
}, ref) => {
  // Convert string YYYY-MM-DD to Date object
  const selectedDate = value ? new Date(value) : null;

  const handleChange = (date: Date | null) => {
    if (!date) {
      onChange(null, '');
      return;
    }
    
    // Convert back to YYYY-MM-DD for form state
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(date, `${year}-${month}-${day}`);
  };

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    // Thai months Array
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    // Generate years (Current year +/- 10 years in BE)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
      <div className="flex justify-between items-center px-2 py-2 bg-white border-b border-slate-100">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="flex space-x-2">
          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer appearance-none hover:text-emerald-600 transition-colors"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
            className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer appearance-none hover:text-emerald-600 transition-colors"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year + 543} {/* Convert AD to BE for display */}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  };

  return (
    <div className="relative w-full thai-datepicker-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        locale="th"
        dateFormat="dd/MM/yyyy"
        renderCustomHeader={renderCustomHeader}
        className={className}
        calendarClassName="custom-thai-calendar"
        placeholderText={placeholderText}
        required={required}
        portalId="datepicker-portal"
        calendarStartDay={1} // Start week on Monday
        formatWeekDay={nameOfDay => {
          const shortNames: Record<string, string> = {
            "อาทิตย์": "อ", // Sunday (end of week)
            "จันทร์": "จ",
            "อังคาร": "อ",
            "พุธ": "พ",
            "พฤหัสบดี": "พฤ",
            "ศุกร์": "ศ",
            "เสาร์": "ส",
          };
          return shortNames[nameOfDay] || nameOfDay.substring(0, 1);
        }}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
});

ThaiDatePicker.displayName = "ThaiDatePicker";
export default ThaiDatePicker;
