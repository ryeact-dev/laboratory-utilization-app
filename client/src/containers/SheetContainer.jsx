import { Button } from "@/common/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/common/ui/sheet";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";

export default function SheetContainer({
  children,
  dataObj,
  isSheetOpen,
  setIsSheetOpen,
  closeModal,
}) {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent
        id="scroll-bar-design"
        side="right"
        className={cn("w-full overflow-y-auto", dataObj?.className)}
        isNeedClose={false}
      >
        <SheetHeader className="-mt-3 mb-3 flex-row items-center justify-between">
          <div>
            <SheetTitle>{dataObj?.title}</SheetTitle>
            <SheetDescription>{dataObj?.description}</SheetDescription>
          </div>
          <div className="!m-0">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => closeModal()}
            >
              <p className="flex items-center gap-1">
                <CircleX size={14} strokeWidth={2.5} />
                Close
              </p>
            </Button>
          </div>
        </SheetHeader>
        <div className="min-h-[calc(100vh-120px)]">{children}</div>
        {/* <SheetFooter className={"mt-2"}>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => closeModal()}
          >
            <p className="flex items-center gap-1">
              <LuCircleX size={18} strokeWidth={2.5} />
              Close
            </p>
          </Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
