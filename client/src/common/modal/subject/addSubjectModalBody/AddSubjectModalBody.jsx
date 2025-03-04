import { useState } from "react";
import { INITIAL_SUBJECT_OBJ } from "@/globals/initialValues";
import { getHoursBetween } from "@/lib/helpers/dateTime";
import BottomButtons from "@/common/buttons/BottomButtons";
import { useAddEditSubject } from "@/hooks/subjects.hook";
import AddSubjectInputs from "./components/addSubjectInputs/AddSubjectInputs";
import { useGetCurrentUserData, useGetListOfFaculty } from "@/hooks/users.hook";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectSchema } from "@/schemas/zodSchema";

export default function AddSubjectModalBody({ closeModal, extraObject }) {
  const { activeSchoolYear } = useGetCurrentUserData();

  const { subject, currentUser, selectedTermAndSem } = extraObject;
  const [timeError, setTimeError] = useState("");

  const { mutate: addEditSubjectMutation, isPending } =
    useAddEditSubject(closeModal);

  const { isLoading, data: teachers = [] } = useGetListOfFaculty("");

  const form = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: subject ? subject : INITIAL_SUBJECT_OBJ,
  });

  const onSubmit = (subjectDetails) => {
    let termSem = null;
    if (selectedTermAndSem === "First Semester") {
      termSem = `${subjectDetails.term} - 1st Sem`;
    } else termSem = `${subjectDetails.term} - 2nd Sem`;

    const { start_time, end_time } = subjectDetails;

    // Utils to check the total hours between selected times
    const diffHours = getHoursBetween(
      `2023-10-10T${start_time}`,
      `2023-10-10T${end_time}`,
    );

    if (diffHours > 6 || diffHours === 0) {
      setTimeError("Please check subject time");
      return;
    } else {
      setTimeError("");
    }

    const subjectData = {
      ...subjectDetails,
      school_year: activeSchoolYear,
      id: subject && subject.id,
      user: currentUser.fullName,
      term_sem: termSem,
      schedule: 0,
    };

    let isSubjectNew;
    if (subject) {
      isSubjectNew = false;
      addEditSubjectMutation({ subjectData, isSubjectNew });
    } else {
      isSubjectNew = true;
      addEditSubjectMutation({ subjectData, isSubjectNew });
    }
  };

  // RENDER SECTION
  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AddSubjectInputs
          form={form}
          subject={subject}
          timeError={timeError}
          teachers={!isLoading ? teachers : []}
        />
        <BottomButtons
          subject={subject}
          isLoading={isPending}
          closeModal={closeModal}
        />
      </form>
    </>
  );
}
