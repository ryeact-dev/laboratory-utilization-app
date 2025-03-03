import ErrorText from "@/common/typography/ErrorText";
import BottomButtons from "@/common/buttons/BottomButtons";
import { STUDENT_SUBMISSION_TYPE } from "@/globals/initialValues";
import UploadExcelFile from "@/common/uploadExcelFile/UploadExcelFile";
import AddStudentImage from "./AddStudentImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { CloudDownload } from "lucide-react";

export default function AddStudentInputForm({
  form,
  closeModal,
  isLoading,
  isUsingExcelFile,
  setIsUsingExcelFile,
  setUploadedFile,
  uploadedFile,
  duplicateStudents,
  exportFile,
  setDuplicateStudents,
  student,
}) {
  const {
    getValues,
    formState: { errors },
    register,
  } = form;

  const onUsingExcelFileChange = (value) => {
    // const value = evt.target.value;
    setDuplicateStudents([]);
    setIsUsingExcelFile(value);
  };

  // RENDER SECTION
  return (
    <>
      {!student && (
        <div className="my-2 w-full">
          <Label className="font-normal">Select Submission Type</Label>

          <Select onValueChange={onUsingExcelFileChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Submission Type" />
            </SelectTrigger>
            <SelectContent>
              {/* {wasAcknowledged && <option value="">Select All Laboratories</option>} */}
              {STUDENT_SUBMISSION_TYPE.map((submission, index) => {
                return (
                  <SelectItem value={submission.value} key={index}>
                    {submission.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {isUsingExcelFile === "false" ? (
        <>
          <div className="mt-4">
            <Label className="font-normal"> ID Number:</Label>
            <Input
              {...register("id_number")}
              type="number"
              style={{ fontFamily: "Roboto Mono" }}
              placeholder="000000"
            />
            <ErrorText>
              {errors?.id_number ? errors?.id_number.message : ""}
            </ErrorText>
          </div>

          <div>
            <Label className="font-normal"> Full Name</Label>

            <Input {...register("full_name")} placeholder="Arnel L. Ang" />
            <ErrorText>
              {errors?.full_name ? errors?.full_name.message : ""}
            </ErrorText>
          </div>

          <div className="mt-2">
            <Label className="font-normal">eSign</Label>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-700 p-2">
              <AddStudentImage
                // Manually set the image path to the eSign image
                imagePath={`uploads/img/esign/${getValues("id_number")}.webp`}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <UploadExcelFile
            setUploadedFile={setUploadedFile}
            uploadedFile={uploadedFile}
          />

          {duplicateStudents.length > 0 && (
            <Button
              size="sm"
              type="button"
              onClick={exportFile}
              className="mt-4 w-full"
            >
              <CloudDownload size={24} strokeWidth={2} /> Duplicate Students
            </Button>
          )}
        </>
      )}

      <BottomButtons isLoading={isLoading} closeModal={closeModal} />
    </>
  );
}
