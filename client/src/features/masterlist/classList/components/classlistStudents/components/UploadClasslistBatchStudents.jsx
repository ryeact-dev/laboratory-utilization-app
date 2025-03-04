import { useState } from "react";
import { read, utils } from "xlsx";
import { useAddBulkStudents } from "@/hooks/subjects.hook";
import BottomButtons from "@/common/buttons/BottomButtons";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import UploadExcelFile from "@/common/uploadExcelFile/UploadExcelFile";
import { Info } from "lucide-react";

export default function UploadClasslistBatchStudents({
  closeModal,
  extraObject,
}) {
  const { subjectId, activeSchoolYear, classlist } = extraObject;
  const [uploadedFile, setUploadedFile] = useState(null);

  const { mutate: uploadStudentsMutation, isPending } =
    useAddBulkStudents(closeModal);

  const onSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!uploadedFile) {
      ToastNotification("error", "No Excel file submitted");
      return;
    }

    // READ EXCEL FILE AND MAP THE DATA FOR CLASSLIST STUDENTS UPLOAD
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(uploadedFile);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      let idNumbers = d.map((item) => item.id_number);

      const forUpdatingData = {
        idNumbers,
        subjectId,
        activeSchoolYear,
      };

      if (idNumbers.length >= 55) {
        ToastNotification(
          "error",
          `Only 55 students are allowed per classlist, you uploaded ${idNumbers.length} students`,
        );
        return;
      }

      uploadStudentsMutation(forUpdatingData);
    });
  };

  // RENDER SECTION
  return (
    <form onSubmit={onSubmitHandler}>
      {classlist.length > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-accent bg-accent/20 p-2">
          <Info size={20} className="h-10 w-10 text-white" />
          <p className="text-sm font-thin leading-4 tracking-wide text-white">
            Uploading excel file will replace all currently listed students in
            this classlist
          </p>
        </div>
      )}

      <UploadExcelFile
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      />
      <BottomButtons closeModal={closeModal} isLoading={isPending} />
    </form>
  );
}
