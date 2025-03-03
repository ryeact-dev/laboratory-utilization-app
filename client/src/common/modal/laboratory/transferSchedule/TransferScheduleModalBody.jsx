import BottomButtons from "@/common/buttons/BottomButtons";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";

import { LABORATORIES_LIST } from "@/globals/initialValues";
import {
  useGetSchedulerSchedules,
  useTransferSchedule,
} from "@/hooks/schedules.hook";
import { getScheduleAvailability } from "@/lib/helpers/scheduleAvailability";
import { format } from "date-fns";
import { useState } from "react";
import { SelectWeekdays } from "../addScheduleModalBody/components/SelectWeekdays";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import { Label } from "@/common/ui/label";

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA"];

export default function TransferScheduleModalBody({ closeModal, extraObject }) {
  const {
    currentUser,
    scheduleObj,
    laboratory,
    selectedTermAndSem,
    activeSchoolYear,
  } = extraObject;

  const [selectedLaboratory, setSelectedLaboratory] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDays, setSelectedDays] = useState(WEEKDAYS);

  const useTransferScheduleMutation = useTransferSchedule(closeModal);

  const {
    isLoading,
    data: listOfSchedules,
    error,
    isError,
  } = useGetSchedulerSchedules(
    selectedLaboratory,
    activeSchoolYear,
    selectedTermAndSem,
    currentUser,
  );

  isError && ToastNotification("error", error?.response.data);

  const subjectSelections = listOfSchedules
    ?.map((schedule) => {
      return {
        value: schedule.ScheduleId,
        name: `${schedule.Subject} :: ${format(
          new Date(schedule.StartTime),
          "hh:mm a",
        )}-${format(new Date(schedule.EndTime), "hh:mm a")} ${
          schedule.RegularClass ? "( Regular Class )" : "( Reservation Class )"
        }`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const laboratorySelections =
    currentUser.role !== "Admin" ? currentUser.laboratory : LABORATORIES_LIST;

  const onSelectLaboratoryChange = (value) => {
    setSelectedLaboratory(value);
  };

  const onSelectSubjectChange = (value) => {
    setSelectedSubject(value);

    const selectedSchedule = listOfSchedules?.find(
      (schedule) => schedule.ScheduleId === value,
    );

    setSelectedDays(selectedSchedule?.ScheduleData?.recurrence_rule.split(","));
    setSelectedSchedule(selectedSchedule);
  };

  console.log("selectedLaboratory", selectedLaboratory);
  console.log("laboratory", laboratory);

  const onSubmit = (evt) => {
    evt.preventDefault();

    if (!selectedLaboratory) {
      return ToastNotification("error", "Please select a laboratory");
    }

    if (!selectedSubject) {
      return ToastNotification("error", "Please select a subject");
    }

    if (!selectedDays.length) {
      return ToastNotification("error", "Please select at least one day");
    }

    const {
      SubjectId,
      Subject,
      StartTime,
      EndTime,
      ClassSchedule,
      RegularClass,
      ScheduleId,
      RecurrenceRule,
    } = selectedSchedule;

    const isSameLaboratory = selectedLaboratory === laboratory;

    const { isScheduleAvailable, conflictMessage } = getScheduleAvailability(
      scheduleObj.current,
      StartTime,
      EndTime,
      null,
      RegularClass,
      selectedDays, //Subject Scheduled Days
      Subject, // Subject name
      true, // Transfer Schedule
      isSameLaboratory, // Transfer to same/not same laboratory
      { id: SubjectId },
    );

    if (!isScheduleAvailable) {
      return ToastNotification("error", conflictMessage);
    }

    const forUpdatingData = {
      scheduleId: ScheduleId,
      fromLaboratory: isSameLaboratory ? laboratory : selectedLaboratory,
      toLaboratory: isSameLaboratory ? selectedLaboratory : laboratory,
      selectedDays,
      subject: Subject,
      endTime: EndTime,
      startTime: StartTime,
      recurrenceRule: RecurrenceRule,
    };

    useTransferScheduleMutation.mutate({ forUpdatingData });
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <Label className={"font-normal"}>Laboratory</Label>
        <Select
          onValueChange={onSelectLaboratoryChange}
          defaultValue={selectedLaboratory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Laboratory" />
          </SelectTrigger>
          <SelectContent>
            {laboratorySelections.map((lab, k) => {
              return (
                <SelectItem value={lab} key={k}>
                  {lab}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={"font-normal"}>Subject</Label>
        <Select
          onValueChange={onSelectSubjectChange}
          defaultValue={selectedSubject}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={isLoading ? "Loading subjects" : "Select subject"}
            />
          </SelectTrigger>
          <SelectContent>
            {subjectSelections?.map((subject, k) => {
              return (
                <SelectItem value={subject.value} key={k}>
                  {subject.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className={"font-normal"}>Days</Label>
        <SelectWeekdays
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          isRegularClass={selectedSchedule?.RegularClass}
        />
      </div>
      <div className="mt-4">
        <BottomButtons
          closeModal={closeModal}
          isLoading={useTransferScheduleMutation?.isPending}
          isPayload={false}
        />
      </div>
    </form>
  );
}
