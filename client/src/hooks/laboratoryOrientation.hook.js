import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";

import {
  deleteLaboratoryOrientation,
  getLaboratoryOrientation,
  getSingleLaboratoryOrientation,
  updateMultipleLaboratoryOrientations,
  updateSingleLaboratoryOrientations,
} from "@/api/laboratoryOrientation.api";

// ========= QUERIES ==========

// GET ALL LABORATORY ORIENTATIONS
export function useGetLaboratoryOrientations(
  page,
  limit,
  laboratory,
  schoolYear,
  termSem,
  userRole,
  statusSelection,
) {
  const forQueryData = {
    page,
    limit,
    laboratory,
    schoolYear,
    termSem,
    userRole,
    statusSelection,
  };

  return useQuery({
    queryKey: [
      "list-of-laboratory-orientations",
      laboratory,
      schoolYear,
      statusSelection,
      termSem,
      page,
    ],
    queryFn: () => getLaboratoryOrientation({ forQueryData }),
    select: ({ data }) => {
      return data;
    },
    enabled: userRole === "Admin" || userRole === "Custodian",
  });
}

// GET ALL LABORATORY WIFI VOUCHERS
export function useGetSingleLaboratoryOrientation({ forQueryData }) {
  const { scheduleId, dateConducted, isSemestral, selectedTermAndSem } =
    forQueryData || {};

  return useQuery({
    queryKey: [
      "single-laboratory-orientation",
      scheduleId,
      dateConducted,
      selectedTermAndSem,
    ],
    queryFn: () => getSingleLaboratoryOrientation({ forQueryData }),
    select: ({ data }) => {
      return data;
    },
    enabled: !!dateConducted,
  });
}

// GET ALL LABORATORY WIFI VOUCHERS
// export function useGetSingleLabWifiVoucher(laboratory) {
//   return useQuery({
//     queryKey: ["single-lab-voucher", laboratory],
//     queryFn: () => getSingleLabWifiVoucher({ laboratory }),
//     select: ({ data }) => {
//       return data;
//     },
//   });
// }

// ========= ADD/UPDATE MUTATIONS =========

// UPDATE MULTIPLE LABORATORY ORIENTATIONS
export function useUpdateMultipleLaboratoryOrientations(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMultipleLaboratoryOrientations,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-laboratory-orientation"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-orientations"],
      });
      ToastNotification("success", "Orienatation(s) updated successfully");
      closeModal();
    },
  });
}

// UPDATE SINGLE LABORATORY ORIENTATION
export function useUpdateSingleLaboratoryOrientations(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSingleLaboratoryOrientations,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-laboratory-orientation"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-orientations"],
      });
      ToastNotification("success", "Orienatation updated successfully");
      closeModal();
    },
  });
}

// DELETE LABORATORY ORIENTATION
export function useDeletelaboratoryOrientation(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLaboratoryOrientation,
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["single-laboratory-orientation"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-orientations"],
      });
      ToastNotification("success", "Orienatation(s) deleted successfully");
      setIsLoading(false);
      closeModal();
    },
  });
}
