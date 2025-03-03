import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBorrowerSlipItems,
  createBorrowerSlip,
  deleteBorrowerSlip,
  deleteBorrowerSlipItem,
  getBorrowerSlipItems,
  getBorrowerSlipUsers,
  getPaginatedLabBorrowerSlips,
  getSingleLabBorrowerSlip,
  releaseLabBorrowerSlip,
  returnLabBorrowerSlip,
  updateBorrowerSlip,
} from "@/api/borrowerSlip.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useNavigate } from "react-router-dom";
import { borrowerSlipStore } from "@/store";

// *========== BORROWER SLIP ===========

// GET LIST OF SYSTEM UNITS
export function useGetPaginatedLabBorrowerSlips(
  laboratory,
  selectedTermSem,
  wasReturned,
  isCustodian,
  bSlipStatus,
) {
  return useQuery({
    queryKey: [
      "list-of-laboratory-slips",
      laboratory,
      selectedTermSem,
      wasReturned,
      bSlipStatus,
    ],
    queryFn: () =>
      getPaginatedLabBorrowerSlips({
        laboratory,
        selectedTermSem,
        wasReturned,
        isCustodian,
        bSlipStatus,
      }),
    enabled: !!laboratory,
    select: ({ data }) => {
      return data;
    },
  });
}

export const useGetSingleLabBorrowerSlip = (borrowerSlipId) => {
  return useQuery({
    queryKey: ["single-lab-borrower-slip", borrowerSlipId],
    queryFn: () => getSingleLabBorrowerSlip(borrowerSlipId),
    enabled: !!borrowerSlipId,
    select: ({ data }) => {
      return data;
    },
  });
};

// CREATE BORROWER SLIP
export function useCreateBorrowerSlip(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setBorrowerSlipData = borrowerSlipStore(
    (state) => state.setBorrowerSlipData,
  );

  return useMutation({
    mutationFn: createBorrowerSlip,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      ToastNotification("success", "Borrower slip created successfully");
      setBorrowerSlipData(data);
      setIsLoading(false);
      closeModal();
      navigate(`/lumens/app/inventory-single-borrower-slip/${data.id}`, {
        replace: true,
      });
    },
  });
}

// UPDATE BORROWER SLIP
export function useUpdateBorrowerSlip(setSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBorrowerSlip,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      setSearchParams((prev) => {
        prev.set("step", "2");
        return prev;
      });
    },
  });
}

// DELETE BORRWER SLIP
export function useDeleteBorrowerSlip(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setResetBorrowerSlipData = borrowerSlipStore(
    (state) => state.setResetBorrowerSlipData,
  );

  return useMutation({
    mutationFn: deleteBorrowerSlip,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      ToastNotification(
        "success",
        "Borrower slip has been deleted successfully",
      );
      setIsLoading(false);
      closeModal();
      setResetBorrowerSlipData();
      navigate(`/lumens/app/inventory-borrower-slip`, { replace: true });
    },
  });
}

// *========== BORROWER SLIP ITEMS ===========

// GET BORROWER SLIP ITEMS
export function useGetBorrowerSlipItems(borrowerSlipId) {
  return useQuery({
    queryKey: ["list-of-borrower-slip-items", borrowerSlipId],
    queryFn: () => getBorrowerSlipItems({ borrowerSlipId }),
    select: ({ data }) => {
      return data;
    },
    enabled: !!borrowerSlipId,
  });
}

// ADD BORROWER SLIP ITEMS
export function useAddBorrowerSlipItems(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBorrowerSlipItems,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-borrower-slip-items"],
      });
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// ADD BORROWER SLIP ITEMS
export function useDeleteBorrowerSlipItem(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBorrowerSlipItem,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-borrower-slip-items"],
      });
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      ToastNotification(
        "success",
        "Borrower slip item has been deleted successfully",
      );
      setIsLoading(false);
      closeModal();
    },
  });
}

// *======== BORROWER SLIP USERS ===========

export function useGetBorrowerSlipUsers(borrowerSlipId) {
  return useQuery({
    queryKey: ["list-of-borrower-slip-users", borrowerSlipId],
    queryFn: () => getBorrowerSlipUsers(borrowerSlipId),
    enabled: !!borrowerSlipId,
    select: ({ data }) => {
      return data;
    },
  });
}

// RELEASE BORROWER ITEMS
export function useReleaseLabBorrowerSlip(closeModal, setSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: releaseLabBorrowerSlip,

    onError: ({ response }) => {
      ToastNotification("error", response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      ToastNotification(
        "success",
        "Borrower slip items has been released successfully",
      );

      closeModal();
      setSearchParams((prev) => {
        prev.set("step", "3");
        return prev;
      });
    },
  });
}

// MARK BORROWER SLIP AS RETURNED
export function useMarkBorrowerSlipAsReturned(closeModal) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const setResetBorrowerSlipData = borrowerSlipStore(
    (state) => state.setResetBorrowerSlipData,
  );

  return useMutation({
    mutationFn: returnLabBorrowerSlip,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-laboratory-slips"] });
      queryClient.invalidateQueries({
        queryKey: ["list-of-non-laboratory-slips"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-lab-borrower-slip"],
      });
      ToastNotification(
        "success",
        "Borrower slip items has been returned successfully",
      );
      setResetBorrowerSlipData();
      closeModal();
      navigate("/lumens/app/inventory-borrower-slip", { replace: true });
    },
  });
}
