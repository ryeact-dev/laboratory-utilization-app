import Information from "@/common/information/Information";
import { Button } from "@/common/ui/button";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import ReactToPrint from "react-to-print";

export default function AttendanceHeader({
  componentToPrintRef,
  page,
  setPage,
  isLoading,
  isPlaceholderData,
  paginatedClasslist,
}) {
  const { currentUser } = useGetCurrentUserData();

  const printResultsBtn = (
    <Button>
      <Printer size={18} strokeWidth={2.5} className="" />
      Print Attendance
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printResultsBtn}
      content={() => componentToPrintRef.current}
    />
  );

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* PRINT BUTTON */}
          <div>
            {currentUser.role !== "Faculty" &&
              currentUser.role !== "Program Head" &&
              reactToPrintBtn}
          </div>
        </div>
        <div>
          {/* PAGINATION BUTTONS */}
          <div className="hideWhenPrinting flex items-center justify-end gap-4">
            <Button
              variant="outline"
              className="hover:bg-accent"
              size="sm"
              type="button"
              onClick={() => setPage((old) => Math.max(old - 1, 0))}
              disabled={page === 0}
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </Button>
            <div>
              <p className="text-gray-300">Page {page + 1}</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="hover:bg-accent"
              type="button"
              onClick={() => {
                if (!isPlaceholderData || paginatedClasslist?.hasMore) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={paginatedClasslist?.hasMore}
            >
              <ChevronRight size={20} strokeWidth={3} />
            </Button>
          </div>
        </div>
      </div>

      {currentUser.role !== "Faculty" &&
        currentUser.role !== "Program Head" && (
          <Information
            title={"Print Info"}
            message={
              "For better print result please set the ff. settings: Scaling: 80-81, Papersize: A4, Layout: Landscape"
            }
            className={"mb-4"}
          />
        )}
    </>
  );
}
