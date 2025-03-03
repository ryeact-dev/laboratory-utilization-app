import { getSingleSubject } from "@/api/subjects.api";
import SearchInput from "@/common/inputs/SearchInput";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ErrorText from "@/common/typography/ErrorText";
import { Label } from "@/common/ui/label";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { useState } from "react";

export default function BorrowerListOfSubjects({
  form,
  setFetchedSubject,
  fetchedSubject,
}) {
  const { activeSchoolYear, activeTermSem } = useGetCurrentUserData();

  const [subjectCode, setSubjectCode] = useState(fetchedSubject?.code || "");

  const {
    setValue,
    formState: { errors, touched },
  } = form;

  const fetchSubject = async (subjectCode) => {
    if (!subjectCode) {
      ToastNotification("error", "Please input a subject code");
      return;
    }

    const { data } = await getSingleSubject({
      subjectId: undefined,
      subjectCode,
      activeSchoolYear,
    });

    if (data.length === 0) {
      ToastNotification("error", "Code not found");
      return;
    }

    const result = data.filter((item) => item.term_sem === activeTermSem);

    if (result.length === 0) {
      ToastNotification(
        "error",
        "Selected subject is not avaiblable scheduler term settings",
      );
      return;
    }

    setValue("subject_id", result[0].id);
    setValue("instructor_id", result[0].instructor_id);
    setFetchedSubject(result[0]);
  };

  const onInputValueChange = (evt) => {
    setSubjectCode(evt.target.value);
  };

  return (
    <div className="flex-1">
      <Label>Subject</Label>
      <SearchInput
        value={subjectCode}
        onChange={onInputValueChange}
        placeholder="Search code..."
        maxLength={6}
        onClickSearch={() => fetchSubject(subjectCode)}
      />
      <ErrorText>
        {errors?.subject_id && touched?.subject_id
          ? errors?.subject_id.message
          : ""}
      </ErrorText>
    </div>
  );
}
