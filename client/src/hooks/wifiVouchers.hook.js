import {
  addLaboratoryWifiVoucher,
  getLaboratoryWifiVouchers,
  getSingleLabWifiVoucher,
} from "@/api/wifiVoucher.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========= QUERIES ==========

// GET ALL LABORATORY WIFI VOUCHERS
export function useGetLabWifiVouchers({ laboratory }) {
  return useQuery({
    queryKey: ["list-of-voucher-codes", laboratory],
    queryFn: () => getLaboratoryWifiVouchers({ laboratory }),
    select: ({ data }) => {
      return data;
    },
  });
}

// GET ALL LABORATORY WIFI VOUCHERS
export function useGetSingleLabWifiVoucher(laboratory) {
  return useQuery({
    queryKey: ["single-lab-voucher", laboratory],
    queryFn: () => getSingleLabWifiVoucher({ laboratory }),
    select: ({ data }) => {
      return data;
    },
  });
}

// ========= ADD/UPDATE MUTATIONS =========

// ADD LABORATORY WIFI VOUCHER
export function useUpdateWifiVoucher(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLaboratoryWifiVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-voucher-codes"] });
      queryClient.invalidateQueries({ queryKey: ["single-lab-voucher"] });
      ToastNotification("success", "Vouchers successfully updated");
      closeModal();
    },
  });
}
