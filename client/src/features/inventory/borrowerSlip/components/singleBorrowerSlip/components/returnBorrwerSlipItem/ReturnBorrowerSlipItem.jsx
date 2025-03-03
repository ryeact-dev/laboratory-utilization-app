import BottomButtons from "@/common/buttons/BottomButtons";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { useGetBorrowerSlipItems } from "@/hooks/borrowerSlip.hook";
import ReturnBorrowerSlipItemTable from "./components/returnBorrowerSlipItemTable/ReturnBorrowerSlipItemTable";
import ItemHeader from "../itemHeader/ItemHeader";

export default function ReturnBorrowerSlipItem({
  openModal,
  closeModal,
  cancelBtnName,
  loadingBtnName,
  btnName,
  borrowerSlipId,
  singleBorrowerSlip,
  navigate,
  setResetBorrowerSlipData,
}) {
  const { data: borrowerSlipItems = [] } =
    useGetBorrowerSlipItems(borrowerSlipId);

  const onReleasedReturnBorrowerSlip = (evt) => {
    evt.preventDefault();

    if (!singleBorrowerSlip?.released_date) {
      return ToastNotification("error", "Items not yet released.");
    }

    if (
      singleBorrowerSlip?.released_date &&
      !singleBorrowerSlip?.returned_date
    ) {
      const modalSettings = {
        title: "Close Borrower Slip",
        bodyType: MODAL_BODY_TYPES.BORROWER_SLIP_RETURN,
        extraObject: {
          borrowerSlipId,
          instructorName: singleBorrowerSlip?.instructor,
          borrowerSlipItems,
        },
        size: "max-w-4xl",
      };

      openModal(modalSettings);
    } else {
      navigate("/lumens/app/inventory-borrower-slip", { replace: true });
      setResetBorrowerSlipData();
    }
  };

  return (
    <form onSubmit={onReleasedReturnBorrowerSlip} className="">
      <div className="space-y-6">
        <div className="border-grey-300 relative mt-4 w-full overflow-hidden rounded-lg border-2 p-4">
          <ItemHeader
            title={"Equipments"}
            borrowerSlipId={borrowerSlipId}
            borrowerSlipItems={borrowerSlipItems}
            singleBorrowerSlip={singleBorrowerSlip}
            itemTypeFilter="equipments"
            modalTitle={"Add Equipment"}
            forReturn={true}
          />

          <ReturnBorrowerSlipItemTable
            singleBorrowerSlip={singleBorrowerSlip}
            borrowerSlipItems={borrowerSlipItems}
            borrowerSlipId={borrowerSlipId}
            openModal={openModal}
            itemTypeFilter="equipments"
          />
        </div>
        <div className="border-grey-300 relative mt-4 w-full overflow-hidden rounded-lg border-2 p-4">
          <ItemHeader
            title={"Materials/Supplies"}
            borrowerSlipId={borrowerSlipId}
            borrowerSlipItems={borrowerSlipItems}
            singleBorrowerSlip={singleBorrowerSlip}
            itemTypeFilter="materials"
            modalTitle={"Add Materials/Supplies"}
            forReturn={true}
          />

          <ReturnBorrowerSlipItemTable
            singleBorrowerSlip={singleBorrowerSlip}
            borrowerSlipItems={borrowerSlipItems}
            borrowerSlipId={borrowerSlipId}
            openModal={openModal}
            itemTypeFilter="materials"
          />
        </div>
      </div>

      <BottomButtons
        closeModal={closeModal}
        cancelBtnName={cancelBtnName}
        loadingBtnName={loadingBtnName}
        btnName={btnName}
      />
    </form>
  );
}
