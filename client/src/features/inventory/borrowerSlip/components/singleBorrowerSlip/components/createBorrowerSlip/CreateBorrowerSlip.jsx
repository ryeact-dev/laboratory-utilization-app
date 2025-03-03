import { addDays } from "date-fns";
import { INITIAL_BORROWER_LAB_OBJ } from "@/globals/initialValues";
import BorrowerLabInput from "./components/borrowerLabInput/BorrowerLabInput";
import BottomButtons from "@/common/buttons/BottomButtons";
import { useUpdateBorrowerSlip } from "@/hooks/borrowerSlip.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { borrowerSlipLabSchema } from "@/schemas/zodSchema";

export default function CreateBorrowerSlip({
  laboratory,
  payload,
  closeModal,
  cancelBtnName,
  btnName,
  loadingBtnName,
  borrowerSlipId,
  setSearchParams,
  singleBorrowerSlip,
}) {
  const { mutate: onUpdateBorrowerSlipMutation, isPending } =
    useUpdateBorrowerSlip(setSearchParams);

  const form = useForm({
    resolver: zodResolver(borrowerSlipLabSchema),
    defaultValues: payload?.subject_id
      ? { ...payload, instructor_password: "" }
      : INITIAL_BORROWER_LAB_OBJ,
  });

  console.log(form.formState.errors);

  const onSubmit = (borrowerSlipData) => {
    // If the slip is already marked as returned. I cannont be editted
    if (singleBorrowerSlip?.returned_date !== null && singleBorrowerSlip) {
      return setSearchParams((prev) => {
        prev.set("step", "2");
        return prev;
      });
    }

    if (!borrowerSlipData.instructor_password) {
      return ToastNotification("error", "Instructor Password is required");
    }

    let forAddingData = { ...borrowerSlipData, id: borrowerSlipId };

    if (payload.subject_id) {
      //  Datepicker late one day if date of use is selected
      let newDate;
      if (
        new Date(borrowerSlipData.schedule_date_of_use) !==
        new Date(payload.schedule_date_of_use)
      ) {
        newDate = addDays(new Date(borrowerSlipData.schedule_date_of_use), 1);
      }

      forAddingData = {
        ...borrowerSlipData,
        id: payload?.id,
        schedule_date_of_use: newDate,
      };
    }

    onUpdateBorrowerSlipMutation({ forAddingData });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <BorrowerLabInput form={form} laboratory={laboratory} payload={payload} />
      <BottomButtons
        closeModal={closeModal}
        cancelBtnName={cancelBtnName}
        loadingBtnName={loadingBtnName}
        btnName={btnName}
        isLoading={isPending}
      />
    </form>
  );
}
