import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from "react";

function DateWithTime({ className, dateClass, timeClass }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // RENDER SECTION
  return (
    <div className={cn("text-center font-medium", className)}>
      <p className={cn("text-blue-500", dateClass)}>
        {format(date, "eee, MMM. dd, yyyy")}
      </p>
      <p
        style={{ fontFamily: "Roboto Mono" }}
        className={cn("text-neutral tracking-tighter", timeClass)}
      >
        {date.toLocaleTimeString()}
      </p>
      {/* <p className='text-base text-primary font-bold uppercase tracking-widest -mt-2'>
        {format(date, 'eeee')}
      </p> */}
    </div>
  );
}

export default DateWithTime;
