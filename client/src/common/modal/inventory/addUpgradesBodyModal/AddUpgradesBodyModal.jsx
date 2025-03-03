import AddUpgradeInputs from "./components/AddUpgradeInputs";
import UpgradesTable from "./components/UpgradesTable";
import { useAddHardwareUpgrade } from "@/hooks/hardwares _upgrades.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { INITIAL_HARDWARE_UPGRADE_OBJ } from "@/globals/initialValues";
import { Button } from "@/common/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hardwareUpgradeSchema } from "@/schemas/zodSchema";
import { X } from "lucide-react";

export default function AddUpgradesBodyModal({ closeModal, extraObject }) {
  const { hardwareOBJ, laboratory } = extraObject;

  const { mutate: onAddUpgradeMutation, isPending } =
    useAddHardwareUpgrade(closeModal);

  const form = useForm({
    resolver: zodResolver(hardwareUpgradeSchema),
    defaultValues: INITIAL_HARDWARE_UPGRADE_OBJ,
  });

  const { reset } = form;

  const onSubmit = (hardwareUpgradeDetails) => {
    const hardwareDateAcquired = new Date(hardwareOBJ.date_acquired);

    if (hardwareUpgradeDetails.date_upgraded < hardwareDateAcquired) {
      return ToastNotification(
        "error",
        "Upgrade date cannot be before acquisition date",
      );
    }

    let forAddingData = {
      ...hardwareUpgradeDetails,
      hardware_id: hardwareOBJ.id,
      laboratory,
    };

    if (hardwareUpgradeDetails.upgrade_id) {
      onAddUpgradeMutation({ forAddingData, isNew: false });
    } else {
      onAddUpgradeMutation({ forAddingData, isNew: true });
    }
    reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10">
      <AddUpgradeInputs
        form={form}
        onAddUpgradeMutation={onAddUpgradeMutation}
        isPending={isPending}
      />

      <UpgradesTable
        hardwareOBJ={hardwareOBJ}
        laboratory={laboratory}
        form={form}
      />

      <Button
        onClick={closeModal}
        variant="destructive"
        className="float-right mt-4"
      >
        <X size={16} strokeWidth={2.5} />
        Close
      </Button>
    </form>
  );
}
