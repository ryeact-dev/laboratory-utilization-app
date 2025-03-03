import { getStudentNameAndId } from "@/api/students.api";
import SearchInput from "@/common/inputs/SearchInput";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ErrorText from "@/common/typography/ErrorText";
import { Label } from "@/common/ui/label";
import { useState } from "react";

export default function BorrowerSearchStudent({
  form,
  setFetchedStudent,
  fetchedStudent,
}) {
  const [studentIdNumber, setStudentIdNumber] = useState(
    fetchedStudent?.id_number || "",
  );

  const {
    setValue,
    formState: { errors, touched },
  } = form;

  const fetchStudent = async (studentIdNumber) => {
    if (!studentIdNumber) {
      return ToastNotification("error", "Please input a student number");
    }

    const { data } = await getStudentNameAndId({
      studentIdNumber,
    });

    if (data.length === 0) {
      return ToastNotification("error", "Student not found");
    }

    setValue("borrower_id", data.id);
    setFetchedStudent(data);
  };

  const onStudentIdChange = (evt) => {
    const value = evt.target.value;
    setStudentIdNumber(value);
  };

  return (
    <div className="flex-1">
      <Label>Borrower</Label>

      <SearchInput
        value={studentIdNumber}
        onChange={onStudentIdChange}
        placeholder="Search Id Number"
        maxLength={6}
        onClickSearch={() => fetchStudent(studentIdNumber)}
      />
      <ErrorText>
        {errors?.borrower_id && touched?.borrower_id
          ? errors?.borrower_id.message
          : ""}
      </ErrorText>
    </div>
  );
}
