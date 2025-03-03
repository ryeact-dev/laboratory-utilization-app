import { Button } from "@/common/ui/button";
import { Card, CardContent, CardFooter } from "@/common/ui/card";
import UtilizationHeader from "@/common/utilizationHeader/UtilizationHeader";
import { PROGRAM } from "@/globals/initialValues";
import { BookOpen, Monitor, X } from "lucide-react";

export default function ScheduleInfoMoldal({ extraObject, closeModal }) {
  const { ScheduleData } = extraObject;
  const {
    is_regular_class,
    laboratory,
    sched_end_time,
    recurrence_rule,
    program: prog,
  } = ScheduleData;

  const classProgram = prog
    ? PROGRAM.filter((item) => item.value === prog)
    : [{ name: "" }];

  return (
    <Card className="w-full border-none bg-background shadow-none">
      <CardContent>
        <div className="flex flex-col text-secondary">
          <UtilizationHeader headerData={ScheduleData} profClass="my-1" />
          {/* <div className="flex items-center gap-2 text-lg font-normal text-gray-300/80">
            <LuCalendar size={20} />{" "}
            {is_regular_class
              ? recurrence_rule
              : format(new Date(sched_end_time), "EEEE ")}
          </div> */}

          <div className="flex items-center gap-2 text-lg font-normal text-gray-300/80">
            <Monitor size={20} /> {laboratory}
          </div>

          <div className="flex items-center gap-2 text-lg font-normal text-gray-300/80">
            <BookOpen size={20} /> {classProgram[0]?.value || "N/A"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="-mb-6 flex items-center justify-between">
        <div></div>
        <Button size="sm" className="" onClick={closeModal}>
          <X size={20} /> Close
        </Button>
      </CardFooter>
    </Card>
  );
}
