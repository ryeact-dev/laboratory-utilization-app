import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function ActiveAcademicDuration({
  className,
  activeSchoolYear,
  activeTermSem,
}) {
  return (
    <>
      <Badge className={"shadow-none hover:bg-primary"}>
        <p className={"text-xs font-medium text-white"}>
          Active Academic Duration
        </p>
      </Badge>
      <div className={cn("text-base text-secondary", className)}>
        <p className="-mb-1 uppercase">{activeTermSem}</p>
        <p>{activeSchoolYear}</p>
      </div>
    </>
  );
}
