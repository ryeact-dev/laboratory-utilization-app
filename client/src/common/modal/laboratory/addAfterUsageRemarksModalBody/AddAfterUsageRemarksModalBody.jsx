import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  COMPUTING_LAB_REMARKS,
  INITIAL_AFTER_USAGE_REMARKS_OBJ,
  LABS_NEED_HARDWARE_LIST,
} from "@/globals/initialValues";
import {
  useAddRemarkMutation,
  useGetListOfRemarks,
  useRemoveMarkMutation,
} from "@/hooks/remarks.hook";
import AddRemarkInputs from "./components/AddRemarkInputs";
import RemarksTable from "./components/RemarksTable";
import { Button } from "@/common/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { afterUsageRemarksSchema } from "@/schemas/zodSchema";
import { CircleX } from "lucide-react";

export default function AddAfterUsageRemarksModalBody({
  extraObject,
  closeModal,
}) {
  const { usageId, laboratory, usageDate } = extraObject;

  const form = useForm({
    resolver: zodResolver(afterUsageRemarksSchema),
    defaultValues: INITIAL_AFTER_USAGE_REMARKS_OBJ,
  });

  const { isLoading, data: listOfRemarks } = useGetListOfRemarks(usageId);

  const { mutate: addRemarksMutation, isPending: isAddingPending } =
    useAddRemarkMutation(form.reset);

  const { mutate: removeRemarkMutation, isPending: isRemovingPending } =
    useRemoveMarkMutation(form.reset);

  // CHECK IF THE CURRENT LABORATORY IS NEED OF HARDWARE/SOFTWARE/NETWORK
  const isComputingLab =
    LABS_NEED_HARDWARE_LIST.findIndex((lab) => lab === laboratory) > -1;

  const onSubmit = (usageRemarksDetails) => {
    const { remark, unit_no, description } = usageRemarksDetails;
    // Basic validation
    if (!remark) {
      ToastNotification("error", "Please select a remark");
      return;
    }

    if (remark !== "No problems found" && remark !== "Internet Speed") {
      if (unit_no <= 0) {
        ToastNotification("error", "Unit Number is required");
        return;
      }

      // if(!ticket_no.trim()){
      //   ToastNotification("error", "Ticket Number is required");
      //   return;
      // }
    }

    // Helper function to check if a remark exists
    const hasRemark = (remarkType) =>
      listOfRemarks?.some((item) => item.remark === remarkType);

    let internetSpeed;
    let speed;

    // Validate based on remark type
    switch (remark) {
      case "No problems found":
        // If there are any existing remarks (except Internet Speed), prevent adding "No problems found"
        if (listOfRemarks?.length > 0) {
          const hasOnlyInternetSpeed =
            listOfRemarks.length === 1 && hasRemark("Internet Speed");
          if (!hasOnlyInternetSpeed) {
            ToastNotification(
              "error",
              "You already listed a remark problem(s)",
            );
            return;
          }
        }

        // Prevent duplicate "No problems found" remarks
        if (hasRemark("No problems found")) {
          ToastNotification(
            "error",
            "No problems found remark was already posted",
          );
          return;
        }
        break;

      case "Internet Speed":
        if (hasRemark("Internet Speed")) {
          ToastNotification("error", "Internet Speed was already posted");
          return;
        }

        speed = Number(description.trim());
        if (!description.trim() || speed < 0) {
          ToastNotification(
            "error",
            !description.trim()
              ? "Please enter the Internet Speed in the description box."
              : "Invalid Internet Speed",
          );
          return;
        }
        internetSpeed = Math.round(speed);
        break;

      default:
        if (hasRemark("No problems found")) {
          ToastNotification(
            "error",
            "No problems found remark was already posted",
          );
          return;
        }

        if (Number(unit_no) < 0) {
          ToastNotification("error", "Unit Number is required");
          return;
        }

        if (isComputingLab !== true || remark === "h. others") {
          if (!description.trim()) {
            ToastNotification("error", "Description required");
            return;
          }
        }
    }

    let desc = description.trim();

    // Check if a remark is need a description
    const listOfRemarksThatDontNeedDesc = COMPUTING_LAB_REMARKS.slice(
      1,
      11,
    ).some((item) => item.value === remark);

    if (listOfRemarksThatDontNeedDesc) {
      desc = "-";
    }

    const forAddingData = {
      ...usageRemarksDetails,
      remark,
      unit_no: isComputingLab ? unit_no : 0,
      description: remark === "Internet Speed" ? internetSpeed : desc,
      usageDate: new Date(usageDate) || new Date(),
      usageId,
    };

    // console.log(forAddingData);
    addRemarksMutation(forAddingData);
  };

  const onRemarkRemoveClick = (extraObject, remarkId) => {
    const { activeSchoolYear } = extraObject;
    const forDeletionData = {
      activeSchoolYear,
      remarkId,
    };
    removeRemarkMutation(forDeletionData);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <AddRemarkInputs
        form={form}
        isComputingLab={isComputingLab}
        isPending={isAddingPending}
      />
      <RemarksTable
        isLoading={isLoading}
        listOfRemarks={listOfRemarks || []}
        onRemarkRemoveClick={onRemarkRemoveClick}
        extraObject={extraObject}
        isComputingLab={isComputingLab}
        isPending={isRemovingPending}
      />

      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => closeModal()}
        className="float-right mt-4"
      >
        <p className="flex items-center gap-1">
          <CircleX size={18} strokeWidth={2.5} />
          Close
        </p>
      </Button>
    </form>
  );
}
