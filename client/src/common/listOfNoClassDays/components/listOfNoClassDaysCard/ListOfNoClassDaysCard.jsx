import { Button } from "@/common/ui/button";
import { Card } from "@/common/ui/card";
import { format } from "date-fns";
import { Trash } from "lucide-react";

export default function ListOfNoClassDaysCard({
  listData,
  onRemoveClick,
  currentUser,
}) {
  // RENDER SECTION
  return (
    <div className="bg-grey-100 w-full overflow-hidden">
      <div
        className="scrollbar force-overflow h-[600px] overflow-auto pr-4"
        id="scroll-bar-design"
      >
        {listData.map(({ no_class_date, title, id }) => (
          <Card
            key={id}
            className={`relative mb-2 flex items-start justify-between overflow-hidden rounded-md px-3 py-2`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 bg-secondary/80`}
            >{`\u00a0`}</div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                <p>{format(new Date(no_class_date), "MMM dd, yyyy")}</p>
              </div>
              <p className="mb-1 text-xs uppercase opacity-60">
                {format(new Date(no_class_date), "EEEE")}
              </p>
              <h2 className="">{title}</h2>
            </div>
            <div>
              {currentUser.role === "Admin" && (
                <Button
                  size="icon"
                  variant="outline"
                  className={`hover:bg-primary hover:text-primary-foreground`}
                  onClick={() => onRemoveClick(id, title)}
                >
                  <Trash strokeWidth={2} />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
