import {
  CalendarClock,
  CalendarPlus,
  ChartLine,
  ClipboardList,
} from "lucide-react";

export default function DataCard({ chartData }) {
  return (
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
      {chartData &&
        chartData.weekly_usage.map((item, index) => (
          <div
            key={index}
            className={`relative flex w-full flex-col items-start justify-between overflow-hidden rounded-lg bg-zinc-700/20 px-4 py-2 transition duration-500 ease-in-out hover:shadow-lg`}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-yellow-300">{`\u00a0`}</div>
            <p className="flex items-center gap-2 pb-1 font-medium text-secondary">
              {item.week}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <CalendarClock size={16} className="text-primary-focus" />{" "}
              Regular:
              <span className="font-medium">
                {item.regularClassUsage
                  ? ` 
              ${item.regularClassUsage < 1 ? item.regularClassUsage.toString().split(".")[1] : item.regularClassUsage} ${
                item.regularClassUsage > 1
                  ? "hrs"
                  : item.regularClassUsage === 1
                    ? "hr"
                    : "mins"
              }`
                  : 0}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <CalendarPlus size={16} className="text-primary-focus" /> Make-up:{" "}
              <span className="font-medium">
                {item.reservationClassUsage
                  ? ` 
              ${item.reservationClassUsage < 1 ? item.reservationClassUsage.toString().split(".")[1] : item.reservationClassUsage} ${
                item.reservationClassUsage > 1
                  ? "hrs"
                  : item.reservationClassUsage === 1
                    ? "hr"
                    : Number(item.reservationClassUsage) < 0
                      ? ""
                      : "mins"
              }`
                  : 0}
              </span>
            </p>
            <p className="flex items-center gap-2 pb-1 text-sm text-gray-300">
              <ClipboardList size={16} className="text-primary-focus" /> Weekly:
              <span className="font-medium">
                {item.weeklyUsage
                  ? ` 
              ${item.weeklyUsage < 1 ? item.weeklyUsage.toString().split(".")[1] : item.weeklyUsage} ${
                item.weeklyUsage > 1
                  ? "hrs"
                  : item.weeklyUsage === 1
                    ? "hr"
                    : "mins"
              }`
                  : 0}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm font-medium text-secondary">
              <ChartLine size={16} /> Accumulated:{" "}
              <span>
                {` 
              ${item["Usage Hr"]} ${
                item["Usage Hr"] > 1 ? "hrs" : item["Usage Hr"] ? "hr" : ""
              }`}
              </span>
            </p>
          </div>
        ))}
    </div>
  );
}
