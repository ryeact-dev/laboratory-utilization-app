import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ToastNotification } from "@/common/toastNotification/ToastNotification";

import {
  acknowledgeSubmittedMISM,
  addSubmittedMISM,
  deleteMISM,
  getPaginatedMISM,
  getSubmittedMISMNotifications,
} from "@/api/stockCardMISM.api";
import { socket } from "@/lib/helpers/socketIo";
import { useEffect } from "react";

export function useGetPaginatedMISM(
  laboratory,
  category,
  searchTerm,
  page,
  limit,
  schoolyear,
  submissionDate,
) {
  const query = useQuery({
    queryKey: [
      "list-of-mism",
      laboratory,
      category,
      searchTerm,
      page,
      limit,
      submissionDate,
    ],
    queryFn: () =>
      getPaginatedMISM({
        laboratory,
        category,
        searchTerm,
        page,
        limit,
        schoolyear,
        submissionDate,
      }),
    enabled: !!schoolyear,
    isPlaceholderData: keepPreviousData,
    select: ({ data }) => {
      return data;
    },
  });

  useEffect(() => {
    // Guard clause - early return if not allowed
    if (!schoolyear) return;

    // Define the event handler separately for cleanup
    const handleUtilizationUpdate = () => {
      query.refetch();
    };

    // Add the event listener
    socket.on("report:mism-submissions", handleUtilizationUpdate);

    // Cleanup function
    return () => {
      socket.off("report:mism-submissions", handleUtilizationUpdate);
    };
  }, [query, schoolyear, socket]); // Include socket in dependencies

  return query;
}

export function useGetSubmittedMISMNotifications(schoolyear) {
  const query = useQuery({
    queryKey: ["submitted-mism-for-acknowledgement", schoolyear],
    queryFn: () => getSubmittedMISMNotifications({ schoolyear }),
    enabled: !!schoolyear,
    select: ({ data }) => {
      return data;
    },
  });

  useEffect(() => {
    // Guard clause - early return if not allowed
    if (!schoolyear) return;

    // Define the event handler separately for cleanup
    const handleUtilizationUpdate = () => {
      query.refetch();
    };

    // Add the event listener
    socket.on("report:mism-submissions", handleUtilizationUpdate);

    // Cleanup function
    return () => {
      socket.off("report:mism-submissions", handleUtilizationUpdate);
    };
  }, [query, schoolyear, socket]); // Include socket in dependencies

  return query;
}

// SUBMIT MISM
export function useAddUpdateSubmittedMISM(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSubmittedMISM,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["list-of-mism"] });
      queryClient.invalidateQueries({
        queryKey: ["submitted-mism-for-acknowledgement"],
      });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// ACKNOWLEDGE MISM
export function useAcknowledgeMISM(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acknowledgeSubmittedMISM,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-mism"] });
      queryClient.invalidateQueries({
        queryKey: ["submitted-mism-for-acknowledgement"],
      });
      ToastNotification("success", "MISM has been acknowledged successfully");
      setIsLoading(false);
      closeModal();
    },
  });
}

// DELETE MISM
export function useDeleteMISM(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMISM,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-mism"] });
      queryClient.invalidateQueries({
        queryKey: ["submitted-mism-for-acknowledgement"],
      });
      ToastNotification(
        "success",
        "Submitted MISM has been deleted successfully",
      );
      setIsLoading(false);
      closeModal();
    },
  });
}
