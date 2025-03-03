import { updateManyReportsStepStatus } from "@/api/instructorWeeklyUsage.api";
import {
  getSubmittedLabReports,
  submitLaboratoryWeeklyReport,
  updateManyLabWeeklyReports,
} from "@/api/laboratoryWeeklyUsage.api";

import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { socket } from "@/lib/helpers/socketIo";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

// ========= QUERIES ==========

// GET ALL SUBMITTED REPORTS BY USERID AND TERM
export function useGetPaginatedLabReports({
  userRole,
  selectedTermAndSem,
  page,
  reportCount,
  wasAcknowledged,
  laboratory,
}) {
  const forQueryData = {
    selectedTermAndSem,
    page,
    reportCount,
    wasAcknowledged,
    laboratory,
  };

  const query = useQuery({
    queryKey: [
      "list-of-laboratory-weekly-usage",
      userRole,
      selectedTermAndSem,
      page,
      reportCount,
      wasAcknowledged,
      laboratory,
    ],
    queryFn: () => getSubmittedLabReports({ forQueryData }),
    select: ({ data }) => {
      return data;
    },
    placeholderData: keepPreviousData,
    enabled: userRole === "Program Head",
  });

  useEffect(() => {
    // Guard clause - early return if not allowed
    if (userRole !== "Program Head") return;

    // Define the event handler separately for cleanup
    const handleUtilizationUpdate = () => {
      query.refetch();
    };

    // Add the event listener
    socket.on("report:laboratory-utilizations", handleUtilizationUpdate);

    // Cleanup function
    return () => {
      socket.off("report:laboratory-utilizations", handleUtilizationUpdate);
    };
  }, [query, userRole, socket]); // Include socket in dependencies

  return query;
}

// ========= ADD/UPDATE MUTATIONS =========

// SUBMIT AND UPDATE REPORT
export function useSubmitLabWeeklyReport(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLaboratoryWeeklyReport,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-weekly-usage"],
      });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// UPDATE MANY REPORTS
export function useUpdateManyLabWeeklyReports(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateManyLabWeeklyReports,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-weekly-usage"],
      });
      ToastNotification("success", data);
      setIsLoading(false);
      closeModal();
    },
  });
}
