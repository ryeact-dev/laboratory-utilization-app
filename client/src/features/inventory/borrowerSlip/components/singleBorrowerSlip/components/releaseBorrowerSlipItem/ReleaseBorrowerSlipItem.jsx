import { useGetBorrowerSlipItems } from "@/hooks/borrowerSlip.hook";
import ReleaseBorrowerSlipItemTable from "./components/releaseBorrowerSlipItemTable/ReleaseBorrowerSlipItemTable";
import BottomButtons from "@/common/buttons/BottomButtons";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import ItemHeader from "../itemHeader/ItemHeader";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { CirclePlus } from "lucide-react";

const BTN_NAME_MATERIALS = (
  <h2 className="flex items-center gap-1">
    <CirclePlus size={18} /> <p>Add </p>
  </h2>
);

export default function ReleaseBorrowerSlipItem({
  laboratory,
  closeModal,
  cancelBtnName,
  loadingBtnName,
  btnName,
  setSearchParams,
  creationStep,
  openModal,
  singleBorrowerSlip,
  borrowerSlipId,
}) {
  const { currentUser } = useGetCurrentUserData();

  const { data: borrowerSlipItems = [] } =
    useGetBorrowerSlipItems(borrowerSlipId);

  const onReleasedReturnBorrowerSlip = (evt) => {
    evt.preventDefault();

    if (currentUser.role === "Faculty" || currentUser.role === "Program Head") {
      const modalSettings = {
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Return to Borrower Slip List?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_LIST,
        },
      };
      return openModal(modalSettings);
    }

    if (borrowerSlipItems.length === 0) {
      return ToastNotification(
        "error",
        "There are no items to release. Please add items.",
      );
    }

    if (!singleBorrowerSlip?.released_date) {
      const modalSettings = {
        title: "Items to be released",
        bodyType: MODAL_BODY_TYPES.BORROWER_SLIP_RELEASE,
        extraObject: {
          borrowerSlipId,
          instructorName: singleBorrowerSlip?.instructor,
          borrowerSlipItems,
          setSearchParams,
        },
        size: "max-w-2xl",
      };

      openModal(modalSettings);
    } else
      setSearchParams((prev) => {
        prev.set("step", `3`);
        return prev;
      });
  };

  return (
    <form onSubmit={(evt) => onReleasedReturnBorrowerSlip(evt)} className="">
      <div className="space-y-6">
        <div className="relative mt-4 w-full overflow-hidden rounded-lg border-2 p-4">
          <ItemHeader
            btnName={BTN_NAME_MATERIALS}
            title={"Equipments"}
            borrowerSlipId={borrowerSlipId}
            borrowerSlipItems={borrowerSlipItems}
            singleBorrowerSlip={singleBorrowerSlip}
            itemTypeFilter="equipments"
            modalTitle={"Add Equipment"}
            forReturn={!!singleBorrowerSlip.returned_date}
          />

          <ReleaseBorrowerSlipItemTable
            openModal={openModal}
            singleBorrowerSlip={singleBorrowerSlip}
            borrowerSlipItems={borrowerSlipItems}
            borrowerSlipId={borrowerSlipId}
            itemTypeFilter="equipments"
          />
        </div>

        <div className="border-grey-300 relative mt-4 w-full overflow-hidden rounded-lg border-2 p-4">
          <ItemHeader
            btnName={BTN_NAME_MATERIALS}
            title={"Materials/Supplies"}
            borrowerSlipId={borrowerSlipId}
            borrowerSlipItems={borrowerSlipItems}
            singleBorrowerSlip={singleBorrowerSlip}
            itemTypeFilter="materials"
            modalTitle={"Add Materials/Supplies"}
            forReturn={!!singleBorrowerSlip.returned_date}
            laboratory={laboratory}
          />

          <ReleaseBorrowerSlipItemTable
            laboratory={laboratory}
            openModal={openModal}
            singleBorrowerSlip={singleBorrowerSlip}
            borrowerSlipItems={borrowerSlipItems}
            borrowerSlipId={borrowerSlipId}
            itemTypeFilter="materials"
          />
        </div>
      </div>

      {Number(creationStep) > 1 &&
        (currentUser.role !== "Faculty" ||
          currentUser.role !== "Program Head") && (
          <BottomButtons
            closeModal={closeModal}
            cancelBtnName={cancelBtnName}
            loadingBtnName={loadingBtnName}
            btnName={btnName}
            currentUser={currentUser}
          />
        )}
    </form>
  );
}
