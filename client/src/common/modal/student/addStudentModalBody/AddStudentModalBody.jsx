import { useCallback, useState } from "react";
import { useAddEditStudent } from "@/hooks/students.hook";
import AddStudentInputForm from "./components/AddStudentInputForm";
import { INITIAL_STUDENT_OBJ } from "@/globals/initialValues";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@/schemas/zodSchema";
import { useGetCurrentUserData } from "@/hooks/users.hook";

export default function AddStudentModalBody({
  closeModal,
  extraObject: student,
}) {
  const { currentUser, activeSchoolYear } = useGetCurrentUserData();

  const [uploadedFile, setUploadedFile] = useState();
  const [isUsingExcelFile, setIsUsingExcelFile] = useState("false");
  const [duplicateStudents, setDuplicateStudents] = useState([]);
  const [esign, setEsign] = useState(student ? student?.e_sign : null);
  const [photo, setPhoto] = useState(student ? student?.photo : null);

  const addEditStudentMutation = useAddEditStudent(
    closeModal,
    isUsingExcelFile,
    setDuplicateStudents,
  );

  const exportFile = useCallback(async () => {
    const { utils, writeFileXLSX } = await import("xlsx");

    const ws = utils.json_to_sheet(duplicateStudents);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "DuplicateStudents.xlsx");
  }, [duplicateStudents]);

  const onSubmitExcelFile = (evt) => {
    evt.preventDefault();

    if (isUsingExcelFile === "true" && !uploadedFile) {
      ToastNotification("error", "No File uploaded");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("uploadedFile", uploadedFile);
    uploadFormData.append("addedBy", currentUser.fullName);

    addEditStudentMutation.mutate({
      studentData: uploadFormData,
      submissionType: "bulk",
    });
  };

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: student ? student : INITIAL_STUDENT_OBJ,
  });

  // TODO: REMOVE PHOTO AND ESIGN IN FRONTEND AND REMOVE MULTER FOR STUDENTS
  const onSubmit = ({ id_number, full_name }) => {
    const data = {
      id: student ? student.id : null,
      current_photo: student ? student.photo : null,
      current_esign: student ? student.e_sign : null,
      schoolYear: activeSchoolYear,
      id_number,
      full_name,
      esign,
      photo,
      addedBy: currentUser.fullName,
    };

    const studentData = new FormData();
    // studentData.append('id', data.id);
    // studentData.append('current_photo', data.current_photo);
    // studentData.append('current_esign', data.current_esign);
    // studentData.append('esign', data.esign);
    // studentData.append('photo', data.photo);
    // studentData.append('id_number', data.id_number);
    // studentData.append('full_name', data.full_name);
    // studentData.append('addedBy', data.addedBy);

    for (const name in data) {
      studentData.append(name, data[name]);
    }

    if (student) {
      addEditStudentMutation.mutate({
        studentData,
        submissionType: "update",
      });
    } else {
      addEditStudentMutation.mutate({ studentData, submissionType: "new" });
    }
    setEsign(null);
    setPhoto(null);
  };

  // RENDER SECTION
  return (
    <form
      onSubmit={
        isUsingExcelFile === "true"
          ? onSubmitExcelFile
          : form.handleSubmit(onSubmit)
      }
      className="mx-auto -mt-6 w-full"
    >
      <AddStudentInputForm
        form={form}
        photo={photo}
        setPhoto={setPhoto}
        esign={esign}
        setEsign={setEsign}
        student={student}
        exportFile={exportFile}
        duplicateStudents={duplicateStudents}
        setDuplicateStudents={setDuplicateStudents}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        isUsingExcelFile={isUsingExcelFile}
        setIsUsingExcelFile={setIsUsingExcelFile}
        closeModal={closeModal}
        isLoading={addEditStudentMutation.isLoading}
      />
    </form>
  );
}
