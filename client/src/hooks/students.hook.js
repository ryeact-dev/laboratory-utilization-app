import {
  addEditStudent,
  deleteStudent,
  getClasslistStudents,
  getPaginatedClasslist,
  getPaginatedStudents,
  getStudentNameAndId,
} from "@/api/students.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// *========= QUERIES ==========

// GET PAGINATED CLASSLIST
export function useGetPaginatedClasslist(page, classlist, count) {
  return useQuery({
    queryKey: ["paginated-classlist", page, classlist, count],
    queryFn: () => getPaginatedClasslist(page, classlist, count),
    placeholderData: keepPreviousData,
    enabled: !!classlist.length > 0,
    select: ({ data }) => {
      return data;
    },
  });
}

// GET STUDENT ON CLASSLIST PAGE
export function useGetStudentOnClasslistPage(page, studentIdNumber) {
  return useQuery({
    queryKey: ["studentsOnClasslistPage", page, studentIdNumber],
    queryFn: () => getPaginatedStudents(page, studentIdNumber, 20),
    placeholderData: keepPreviousData,
    select: ({ data }) => {
      return data;
    },
  });
}

// GET SINGLE SUBJECT CLASSLIST
export function useGetSingleSubjectClasslist(classlist) {
  return useQuery({
    queryKey: ["attendance-single-subject-classlist", classlist],
    queryFn: () => getClasslistStudents(classlist),
    select: ({ data }) => {
      return data;
    },
  });
}

// GET PAGINATED STUDENTS
export function useGetPaginatedStudents(page, studentIdNumber, count) {
  return useQuery({
    queryKey: ["list-of-students", page, studentIdNumber, count],
    queryFn: () => getPaginatedStudents(page, studentIdNumber, count),
    placeholderData: keepPreviousData,
    select: ({ data }) => {
      return data;
    },
  });
}

// *========= MUTATIONS =========

// ADD STUDENT
export function useAddEditStudent(
  closeModal,
  isUsingExcelFile,
  setDuplicateStudents,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEditStudent,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["list-of-students"] });
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      if (isUsingExcelFile === "false") {
        ToastNotification(
          "success",
          "Student's info successfully added/updated",
        );
        closeModal();
      } else {
        setDuplicateStudents(() => [...data.duplicates]);
        ToastNotification(
          "success",
          `Successfully added ${data.count} students with ${data.duplicates.length} duplicate/s`,
        );
      }
    },
  });
}

// DELETE STUDENT
export function useDeleteStudent(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-students"] });
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
      ToastNotification("info", "Student successfully removed");
      setIsLoading(false);
      closeModal();
    },
  });
}
