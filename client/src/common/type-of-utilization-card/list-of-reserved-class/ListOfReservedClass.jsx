import { Badge } from "@/common/ui/badge";
import { Button } from "@/common/ui/button";
import { Card, CardContent } from "@/common/ui/card";
import { calculateUsageTime } from "@/lib/helpers/dateTime";
import { format } from "date-fns";
import { CalendarCheck, CalendarClock, Clock9, SquarePen } from "lucide-react";

function ListOfReservedClass({ listOfUsage, onEditSingleUsage, currentUser }) {
  const listOfReservationClass = listOfUsage
    ?.filter(
      (schedType) =>
        schedType.is_regular_class === false && schedType.usage_hours,
    )
    .sort((a, b) => new Date(a.usage_date) - new Date(b.usage_date));

  return (
    listOfReservationClass.length > 0 && (
      <>
        <h2 className="text-base text-white">Make-up Class</h2>
        <div className="mt-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          {listOfReservationClass.map((usage, index) => (
            <Card key={index} className="rounded-lg bg-background/50">
              <CardContent className="relative w-full p-2">
                {currentUser.role === "Admin" && (
                  <Button
                    variant="icon"
                    className="absolute right-1 top-0 z-10 flex items-center gap-2 p-1 text-secondary"
                    onClick={() => onEditSingleUsage(usage)}
                  >
                    <SquarePen size={16} />
                  </Button>
                )}
                <div className="w-full">
                  <div className="flex items-center gap-1 text-secondary">
                    <CalendarCheck size={16} />
                    <p className="text-base font-medium">
                      {format(new Date(usage.usage_date), "MMM dd, yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarClock size={16} />
                      <p className="text-sm font-medium">
                        {`${format(
                          new Date(usage.start_time),
                          "hh:mm a",
                        )} - ${format(new Date(usage.end_time), "hh:mm a")}`}
                      </p>
                    </div>

                    <Badge className="rounded-full bg-green-500/10 hover:bg-green-500/10">
                      <h2 className="flex items-center justify-center gap-1 text-xs font-semibold text-green-500">
                        <Clock9 size={14} />
                        {calculateUsageTime(usage.usage_hours)}
                      </h2>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    )
  );
}

export default ListOfReservedClass;
