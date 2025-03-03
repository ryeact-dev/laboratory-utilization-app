import { add } from "date-fns";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  INITIAL_HARDWARE_OBJ,
  STUDENT_SUBMISSION_TYPE,
} from "@/globals/initialValues";
import { useAddHardware } from "@/hooks/hardwares.hook";
import SoftwareListForm from "./components/SoftwareListForm";
import { useCallback, useState } from "react";
import { utils, writeFileXLSX } from "xlsx";
import UsingExcelForm from "./components/UsingExcelForm";
import HardwareInputForm from "./components/HardwareInputForm";
import SelectItems from "@/common/select/SelectIems";
import { Label } from "@/common/ui/label";
import BottomButtons from "@/common/buttons/BottomButtons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hardwareSchema } from "@/schemas/zodSchema";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function AddHardwareBodyModal({ closeModal, extraObject }) {
  const { school_year, laboratory, hardwareData } = extraObject;

  const { currentUser } = useGetCurrentUserData();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUsingExcelFile, setIsUsingExcelFile] = useState("false");
  const [duplicateHardwares, setDuplicateHardwares] = useState([]);

  const { mutate: onAddHardwareMutation, isPending } = useAddHardware(
    closeModal,
    isUsingExcelFile,
    setDuplicateHardwares,
  );

  const form = useForm({
    resolver: zodResolver(hardwareSchema),
    defaultValues: hardwareData
      ? { ...hardwareData, date_acquired: new Date(hardwareData.date_acquired) }
      : INITIAL_HARDWARE_OBJ,
  });

  const onSubmit = (hardwareDetails) => {
    const { date_acquired } = hardwareDetails;

    // Add one day to the date_acquired to sync with gmt+8
    const date = new Date(date_acquired);
    const datePlusOneDay = add(date, { days: 1 });

    let forAddingData = {
      ...hardwareDetails,
      laboratory,
      date_acquired: datePlusOneDay,
    };

    if (hardwareData) {
      forAddingData = {
        ...forAddingData,
        id: hardwareData.id,
      };
      onAddHardwareMutation({ forAddingData, isNew: false });
    } else {
      onAddHardwareMutation({ forAddingData, isNew: true });
    }
  };

  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(duplicateHardwares);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "DuplicateHardwares.xlsx");
  }, [duplicateHardwares]);

  const onSubmitExcelFile = (evt) => {
    evt.preventDefault();
    if (isUsingExcelFile === "true" && !uploadedFile) {
      ToastNotification("error", "No Excel File uploaded");
      return;
    }
    const uploadFormData = new FormData();
    uploadFormData.append("uploadedFile", uploadedFile);
    uploadFormData.append("addedBy", currentUser.fullName);
    uploadFormData.append("laboratory", laboratory);

    onAddHardwareMutation({
      forAddingData: uploadFormData,
      submissionType: "bulk",
    });
  };

  const onUsingExcelFileChange = (value) => {
    setDuplicateHardwares([]);
    setIsUsingExcelFile(value);
  };

  // RENDER SECTION
  return (
    <form
      className="-mt-6 min-h-full w-full"
      onSubmit={
        isUsingExcelFile === "true"
          ? onSubmitExcelFile
          : form.handleSubmit(onSubmit)
      }
    >
      {!hardwareData && (
        <>
          <Label> Select Submission Type</Label>
          <SelectItems
            dataArray={STUDENT_SUBMISSION_TYPE}
            value={isUsingExcelFile}
            onValueChange={onUsingExcelFileChange}
            placeholder={"Select Submission Type"}
            className={"w-full"}
          />
        </>
      )}

      {/* Excel File Upload Section */}
      {isUsingExcelFile === "true" ? (
        <UsingExcelForm
          setUploadedFile={setUploadedFile}
          uploadedFile={uploadedFile}
          duplicateHardwares={duplicateHardwares}
          exportFile={exportFile}
        />
      ) : (
        <HardwareInputForm form={form} />
      )}
      <div className="flex justify-end">
        <BottomButtons closeModal={closeModal} isLoading={isPending} />
      </div>
    </form>
  );
}

export default AddHardwareBodyModal;
