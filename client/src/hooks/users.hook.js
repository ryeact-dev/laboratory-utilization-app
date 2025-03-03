import {
  assignUserLaboratories,
  assignUserOffices,
  deleteUser,
  getCurrentUserData,
  getListOfFaculty,
  getListOfProgramHeadAndDean,
  getPaginatedUsers,
  googleLogin,
  loginUser,
  logoutUser,
  pageReload,
  updateUserPassword,
  updateUserStatus,
  userMutation,
} from "@/api/users.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { PROGRAM } from "@/globals/initialValues";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMatches, useNavigate, useRevalidator } from "react-router-dom";

// *========= QUERIES ==========
export function useGetCurrentUserData() {
  // THIS FUNCTION RETURNS DATA IN STRINGS FORMAT
  const { currentUserInfo, schoolYearInfo } = useMatches()[0].data;

  if (!currentUserInfo) {
    return {
      currentUser: null,
      activeSchoolYear: null,
      activeTermSem: null,
      termSemEndingDate: null,
      termSemStartingDate: null,
    };
  }

  const laboratory =
    currentUserInfo.user_role === "Admin" ||
    currentUserInfo.user_role === "Dean"
      ? []
      : currentUserInfo.laboratory;

  const office =
    currentUserInfo.user_role === "Admin" ||
    currentUserInfo.user_role === "Dean"
      ? []
      : currentUserInfo.office;

  const currentUser = {
    email: currentUserInfo.email,
    userId: currentUserInfo.id,
    role: currentUserInfo.user_role,
    fullName: currentUserInfo.full_name,
    laboratory,
    office,
    photoURL:
      currentUserInfo.photo_url === "null" ? null : currentUserInfo.photo_url,
    esignURL:
      currentUserInfo.esign_url === "null" ? null : currentUserInfo.esign_url,
    program:
      currentUserInfo.user_program === "null"
        ? null
        : currentUserInfo.user_program,
    department: currentUserInfo.department,
  };

  const activeSchoolYear = schoolYearInfo.school_year;
  const activeTermSem = schoolYearInfo.term_sem;
  const termSemStartingDate = schoolYearInfo.starting_date;
  const termSemEndingDate = schoolYearInfo.ending_date;
  const syStartingDate = schoolYearInfo.sy_starting_date;
  const syEndingDate = schoolYearInfo.sy_ending_date;

  return {
    currentUser,
    activeSchoolYear,
    activeTermSem,
    termSemEndingDate,
    termSemStartingDate,
    syEndingDate,
    syStartingDate,
  };
}

// GET PAGINATED USERS LIST
export function useGetPaginatedUsers(page, count, username) {
  return useQuery({
    queryKey: ["paginated-users", page, count, username],
    queryFn: () => getPaginatedUsers({ page, count, username }),
    select: ({ data }) => {
      return data;
    },
  });
}

// GET LIST OF FACULTY
export function useGetListOfFaculty(facultyName) {
  return useQuery({
    queryKey: ["list-of-faculty", facultyName],
    queryFn: () => getListOfFaculty({ facultyName }),
    select: ({ data }) => {
      let teacherOptions = [];
      if (data) {
        teacherOptions = [...data]
          .filter((teacher) => teacher.is_active)
          .map((teacher) => {
            return {
              value: teacher.id,
              label: teacher.full_name,
            };
          });
      }

      return teacherOptions;
    },
  });
}

const userProgram = (userData) => {
  const isDean = userData.user_role === "Dean";
  return isDean
    ? userData.department
    : PROGRAM.filter((item) => item.value === userData.user_program)[0]?.label;
};

// GET LIST OF PROGRAM HEAD AND DEAN
export function useGetListOfProgramHeadAndDean(facultyName) {
  return useQuery({
    queryKey: ["list-of-program-head-and-dean", facultyName],
    queryFn: () => getListOfProgramHeadAndDean({ facultyName }),
    select: ({ data }) => {
      let list = [];
      if (data) {
        list = [...data].map((user) => {
          return {
            value: user.id,
            label: user.full_name,
            subLabel: userProgram(user),
            role: user.user_role,
            // department: user.department,
          };
        });
      }
      return list;
    },
  });
}

// *========= MUTATIONS =========

// ADD / UPDATE USER
export function useAddEditUser(closeModal) {
  const revalidator = useRevalidator();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userMutation,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-data"] });

      ToastNotification("success", "User successfully added/updated");
      revalidator.revalidate();
      closeModal();
    },
  });
}

// UPDATE USER PASSWORD
export function useUpdateUserPassword(closeModal, isPasswordReset) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserPassword,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-users"] });
      ToastNotification(
        "success",
        isPasswordReset
          ? "Successfully reset the password"
          : "Password successfully updated",
      );
      closeModal();
    },
  });
}

// UPDATE USER LABORATORIES
export function useAssignUserLaboratories(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignUserLaboratories,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-data"] });
      ToastNotification("success", "Successfully assigned laboratories");
      closeModal();
    },
  });
}

// UPDATE USER OFFICES
export function useAssignUserOffices(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignUserOffices,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-data"] });
      ToastNotification("success", "Successfully assigned offices");
      closeModal();
    },
  });
}

// UPDATE USER STATUS
export function useUpdateUserStatus(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-data"] });
      ToastNotification("success", "User status updated");
      setIsLoading(false);
      closeModal();
    },
  });
}
// DELETE USER
export function useDeleteUser(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginated-users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user-data"] });
      ToastNotification("info", "User successfully removed");
      setIsLoading(false);
      closeModal();
    },
  });
}

// LOGIN USER
export function useLoginUser(isGoogleLogin) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: isGoogleLogin ? googleLogin : loginUser,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user-data"] });
      navigate("/lumens/app/lab-scheduler", { replace: true });
    },
  });
}

// LOGOUT USER
export function useLogoutUser(closeModal, setIsLoading) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      navigate("/lumens/login", { replace: true });
      localStorage.removeItem("user-data");
      setIsLoading(false);
      closeModal();
    },
  });
}

// LOGOUT USER WHEN DECLINE THE AGREEMENT
export function useDeclineLogoutUser() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logoutUser,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      navigate("/lumens/login", { replace: true });
    },
  });
}

// PAGE RELOAD
export function usePageReload(closeModal, setIsLoading) {
  return useMutation({
    mutationFn: pageReload,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      ToastNotification("success", "Page successfully reloaded");
      setIsLoading(false);
      closeModal();
    },
  });
}
