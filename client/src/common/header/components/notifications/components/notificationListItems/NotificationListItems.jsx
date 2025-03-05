import { addDays, format } from "date-fns";
import { Link } from "react-router-dom";

export default function NotificationListItems({
  userRole,
  isLoading,
  listItems,
  onItemClick,
}) {
  const items =
    userRole === "Admin" ? (
      listItems?.length > 0 ? (
        listItems?.map((item, index) => (
          <Link
            onClick={onItemClick}
            key={index}
            to={`/lumens/app/inventory-stock-card?termsem=2nd+Term+-+2nd+Sem&tab=3&page=1&q=${item.laboratory_name}`}
            className="flex flex-col items-start rounded-md p-2 hover:bg-gray-500/10"
          >
            <p className="text-xs text-secondary">MISM Submission</p>
            <p className="text-sm">{item.laboratory_name}</p>
            <p className="text-[10px] italic text-gray-300">
              {format(
                addDays(new Date(item.date_submitted), 1),
                "MMM. dd, yyyy",
              )}
            </p>
          </Link>
        ))
      ) : (
        <p className="text-xs">No Notifications</p>
      )
    ) : listItems?.length > 0 ? (
      listItems?.map((item, index) => (
        <Link
          onClick={onItemClick}
          key={index}
          to={
            item.isSubject
              ? `/lumens/app/reports-utilizations-weekly-instructor?termsem=${item.termSem}&page=1&tab=1`
              : `/lumens/app/reports-utilizations-weekly-laboratory?termsem=${item.termSem}&page=1&tab=1`
          }
          className="flex flex-col items-start rounded-md p-2 hover:bg-gray-500/10"
        >
          <p className="text-xs text-secondary">{item.subHeader}</p>
          <p className="text-sm">{item.Header}</p>
          <p className="text-[10px] italic text-gray-300">
            {format(new Date(item.dateSubmitted), "MMM. dd, yyyy")}
          </p>
        </Link>
      ))
    ) : (
      <p className="text-xs">No Notifications</p>
    );
  return isLoading ? <p>Loading...</p> : items;
}
