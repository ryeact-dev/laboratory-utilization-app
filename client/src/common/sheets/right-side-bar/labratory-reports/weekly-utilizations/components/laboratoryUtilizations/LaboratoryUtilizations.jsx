import ListOfRegularClass from "@/common/type-of-utilization-card/list-of-regular-class/ListOfRegularClass";
import ListOfReservedClass from "@/common/type-of-utilization-card/list-of-reserved-class/ListOfReservedClass";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { Label } from "@/common/ui/label";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";

export default function LaboratoryUtilizations({
  listOfUsage,
  currentUser,
  schedule,
}) {
  const openModal = modalStore((state) => state.openModal);

  const onEditSingleUsage = (usage) => {
    const { students, students_attendance, students_time_log, ...rest } =
      usage || {};

    const payload = {
      title: "Update Laboratory Utilization time",
      bodyType: MODAL_BODY_TYPES.UTILIZATION_UPDATE,
      extraObject: {
        ...rest,
        sched_start_time: schedule?.sched_start_time,
        sched_end_time: schedule?.sched_end_time,
      },
      size: "max-w-lg",
    };

    openModal(payload);
  };

  return (
    <div>
      <div className="space-x-2">
        <Label className="text-lg">Laboratory Utilizations</Label>
      </div>
      {listOfUsage.length > 0 ? (
        <div className="space-y-2 px-4">
          <ListOfRegularClass
            currentUser={currentUser}
            listOfUsage={listOfUsage}
            onEditSingleUsage={onEditSingleUsage}
          />
          <ListOfReservedClass
            currentUser={currentUser}
            listOfUsage={listOfUsage}
            onEditSingleUsage={onEditSingleUsage}
          />
        </div>
      ) : (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      )}
    </div>
  );
}
