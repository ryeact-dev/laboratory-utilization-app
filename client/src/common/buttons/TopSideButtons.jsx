import { modalStore } from "@/store";
import { ToastNotification } from "../toastNotification/ToastNotification";
import { Button } from "../ui/button";

export default function TopSideButtons({
  isInventory = false,
  laboratory,
  title,
  bodyType,
  btnName,
  extraObject,
  size,
  btnSize,
  roundness,
  disabled = false,
}) {
  const openModal = modalStore((state) => state.openModal);

  const openAddNewModal = () => {
    if (isInventory && !laboratory.trim()) {
      return ToastNotification("error", "Please select a laboratory first");
    }

    openModal({
      title,
      bodyType,
      extraObject,
      size,
    });
  };

  return (
    <div className="md:float-right md:inline-block">
      <Button
        variant="secondary"
        size={btnSize ? btnSize : "default"}
        className={`px-6 ${roundness} font-semibold`}
        onClick={() => openAddNewModal()}
        disabled={disabled}
        type="button"
      >
        {btnName ? btnName : "Add New"}
      </Button>
    </div>
  );
}
