import UploadExcelFile from "@/common/uploadExcelFile/UploadExcelFile";
import { CloudDownload } from "lucide-react";

export default function UsingExcelForm({
  setUploadedFile,
  uploadedFile,
  duplicateHardwares,
  exportFile,
}) {
  return (
    <>
      <UploadExcelFile
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
      />

      {duplicateHardwares?.length > 0 && (
        <button
          type="button"
          onClick={exportFile}
          className="btn btn-secondary mt-4 w-full text-base font-medium normal-case tracking-wide text-white"
        >
          <CloudDownload size={24} strokeWidth={2} /> Duplicate Hardwares
        </button>
      )}
    </>
  );
}
