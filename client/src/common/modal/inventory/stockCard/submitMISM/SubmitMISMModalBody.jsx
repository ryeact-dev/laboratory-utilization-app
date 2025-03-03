import BottomButtons from "@/common/buttons/BottomButtons";
import { DatePicker } from "@/common/date-picker/DatePicker";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useAddUpdateSubmittedMISM } from "@/hooks/stockCardMISM.hook";
import { format, lastDayOfMonth, subMonths } from "date-fns";
import { useState } from "react";

const currentDate = new Date();
const previousMonth = subMonths(currentDate, 1);
const lastDayOfTheMonth = lastDayOfMonth(previousMonth);

const formattedDate = (date) => {
  return format(new Date(date), "MMMM yyyy");
};

export default function SubmitMISMModalBody({ closeModal, extraObject }) {
  const { listOfMISM, laboratory_name, school_year } = extraObject;
  const [submissionDate, setSubmissionDate] = useState(lastDayOfTheMonth);

  const selectedMonth = format(submissionDate, "MMMM");

  const { mutate: submitMISMMutation, isPending } =
    useAddUpdateSubmittedMISM(closeModal);

  const onDateChange = (date) => {
    const lastDayOfTheMonth = lastDayOfMonth(date);
    setSubmissionDate(lastDayOfTheMonth);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();

    const sameMonth = listOfMISM?.filter(
      (mism) =>
        format(new Date(mism.date_submitted), "MMMM") === selectedMonth &&
        mism.laboratory_name === laboratory_name,
    );

    if (sameMonth.length > 0) {
      return ToastNotification(
        "error",
        "MISM already submitted for this month",
      );
    }

    const forAddingData = {
      laboratory_name,
      school_year,
      date_submitted: submissionDate,
    };

    submitMISMMutation({ forAddingData });
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className="-mt-4 text-center text-xl font-medium text-secondary">
        {laboratory_name}
      </h1>
      <div className="z-10 flex flex-col items-center px-6 pt-2">
        <DatePicker
          date={submissionDate}
          setDate={(date) => onDateChange(date)}
          minDate={new Date("2010-08-01")}
          maxDate={lastDayOfTheMonth}
          formattedDate={formattedDate}
        />
      </div>
      <BottomButtons closeModal={closeModal} isLoading={isPending} />
    </form>
  );
}
