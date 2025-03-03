import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";

import { useGetCurrentUserData } from "@/hooks/users.hook";
import { cn } from "@/lib/utils";
import { modalStore } from "@/store";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export default function EventTemplate({
  ScheduleData,
  Subject,
  Description,
  StartTime,
  EndTime,
  ScheduleStatus,
}) {
  const { currentUser } = useGetCurrentUserData();
  const openModal = modalStore((state) => state.openModal);

  const startTime = new Date(StartTime);
  const formattedStartTime = format(startTime, "hh:mmaaa");
  const endTime = new Date(EndTime);
  const formattedEndTime = format(endTime, "hh:mmaaa");

  const deleteSchedule = () => {
    const message = `Remove ${ScheduleData.code}-${ScheduleData.title} from schedule? `;

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.SCHEDULE_DELETE,
        forDeletionData: { scheduleId: ScheduleData.id },
      },
    };

    openModal(payload);
  };

  const bgAndFontColor =
    ScheduleData.is_regular_class === false
      ? "border-yellow-700 bg-yellow-500 text-black"
      : "border-red-700 bg-red-500";

  // RENDER SECTION
  return (
    <>
      {/* <div className="absolute right-0 top-0 h-full w-full bg-green-200"></div> */}
      <div
        className={cn(
          `absolute right-1 top-1 h-[calc(100%-10px)] w-[calc(100%-10px)] rounded-md border-2 print:right-0 print:top-0 print:h-full print:w-full print:rounded-none print:border-black print:bg-white`,
          bgAndFontColor,
        )}
      >
        {(currentUser.role === "Admin" || currentUser.role === "Custodian") && (
          <article className="absolute right-0 top-0 z-10">
            <button
              className={`hideWhenPrinting hover:bg-base-100/50 hover:text-grey-1000 rounded-full p-2 transition duration-300 ease-in-out`}
              onClick={deleteSchedule}
            >
              <Trash2 className={`h-4 w-4`} />
            </button>
          </article>
        )}

        <div className="absolute right-0 top-0 h-full w-full print:bg-white print:!text-black">
          <div
            className={`flex h-full flex-col items-center justify-center text-center tracking-wide print:leading-4`}
          >
            <div
              className={`subject !w-46 !overflow-hidden text-sm !font-medium tracking-wider`}
            >
              <p className="schedule-text">{Subject}</p>
            </div>
            <div
              className={`event-description -mt-1 !w-44 !overflow-hidden !text-sm tracking-wider print:hidden print:text-base`}
            >
              <p className="truncate">
                {Description !== "N/A" ? Description : ""}
              </p>
            </div>
            <div
              className={`time !font-meduim -mt-1 !overflow-hidden !text-[12px] tracking-wider print:!text-lg`}
            >
              <p className="schedule-subtext truncate">
                {Number(ScheduleStatus) === 1
                  ? "(Pending Request)"
                  : `${formattedStartTime} - ${formattedEndTime}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
