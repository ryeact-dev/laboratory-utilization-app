import {
  addHardwareUpgrades,
  deleteHardwareUpgrade,
  getUpgradeList,
} from "@/api/hardware.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// *===== QUERIES ======

// GET LIST OF SYSTEM UNITS
export function useGetHardwareUpgrades(hardwareId, laboratory) {
  return useQuery({
    queryKey: ["list-of-upgrades", hardwareId, laboratory],
    queryFn: () => getUpgradeList({ hardwareId, laboratory }),
    enabled: !!hardwareId && !!laboratory,
    select: ({ data }) => {
      return data;
    },
  });
}

// *===== MUTATION ======
// ADD SOFTWARE
export function useAddHardwareUpgrade(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addHardwareUpgrades,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["list-of-hardwares"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-system-units"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-upgrades"] });
      ToastNotification("success", data);
      // closeModal();
    },
  });
}

// DELETE SOFTWARE
export function useDeleteHardwareUpgrade(reset) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHardwareUpgrade,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-hardwares"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-system-units"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-upgrades"] });
      ToastNotification(
        "info",
        "Hardware Upgrade successfully removed from the list",
      );
      reset(); // Reset Form
    },
  });
}
