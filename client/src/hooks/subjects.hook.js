import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addClasslistStudents,
  addEditSubject,
  deleteSubject,
  getPaginatedSubjects,
  getSingleSubject,
  removeClasslistStudents,
  uploadBatchStudentsClasslist,
} from "@/api/subjects.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";

// *========= QUERIES ==========

// GET SINGLE SUBJECT
export function useGetSingleSubject(subjectId, activeSchoolYear) {
  return useQuery({
    queryKey: ["single-subject-classlist", subjectId, activeSchoolYear],
    queryFn: () =>
      getSingleSubject({ subjectId, subjectCode: undefined, activeSchoolYear }),
    enabled: !!activeSchoolYear,
  });
}

// GET LIST OF SUBJECTS
export function useGetListOfPaginatedSubjects(
  page,
  activeSchoolYear,
  selectedTermAndSem,
  subjectCode,
  subjectCount,
  isSemestral,
) {
  return useQuery({
    queryKey: [
      "listOfSubjects",
      page,
      activeSchoolYear,
      selectedTermAndSem,
      subjectCode,
      subjectCount,
    ],
    queryFn: () =>
      getPaginatedSubjects(
        page,
        activeSchoolYear,
        selectedTermAndSem,
        subjectCode,
        subjectCount,
        isSemestral,
      ),
    placeholderData: keepPreviousData,
    enabled: !!activeSchoolYear && !!selectedTermAndSem,
    refetchInterval: 3000, //refetch every 3 seconds
    select: ({ data }) => {
      return data;
    },
  });
}

// *========= MUTATIONS =========

// ADD/EDIT SUBJECT
export function useAddEditSubject(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEditSubject,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["listOfSubjects"] });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// DELETE SUBJECT
export function useDeleteSubject(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listOfSubjects"] });
      ToastNotification("info", "Subject successfully removed");
      setIsLoading(false);
      closeModal();
    },
  });
}

// ADD STUDENT IN A CLASSLIST
export function useAddClasslistStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addClasslistStudents,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studentsOnClasslistPage"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-subject-classlist"],
      });
      ToastNotification("success", "Student successfully added");
    },
  });
}

// ADD BULK STUDENTS ON CLASSLIST
export function useAddBulkStudents(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadBatchStudentsClasslist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studentsOnClasslistPage"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-subject-classlist"],
      });
      ToastNotification("success", "Students successfully added");
      closeModal();
    },
  });
}

// REMOVE STUDENT/S IN A CLASSLIST
export function useRemoveStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeClasslistStudents,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["studentsOnClasslistPage"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-subject-classlist"],
      });
      ToastNotification("info", "Student successfully removed");
    },
  });
}
