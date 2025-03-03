import TopSideButtons from "@/common/buttons/TopSideButtons";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";

export default function ItemHeader({
  laboratory,
  title,
  btnName,
  borrowerSlipId,
  borrowerSlipItems,
  singleBorrowerSlip,
  itemTypeFilter,
  modalTitle,
  forReturn,
}) {
  const extraObject = {
    borrowerSlipId,
    borrowerSlipItems,
    forRelease: singleBorrowerSlip?.released_date === null,
    itemTypeFilter,
    laboratory,
  };

  return (
    <div className="bg-grey-300 absolute left-0 top-0 flex w-full items-center justify-between p-4 text-xl font-medium">
      <p>{title}</p>
      {!forReturn && singleBorrowerSlip?.released_date === null && (
        <TopSideButtons
          btnSize={"sm"}
          btnName={btnName}
          extraObject={extraObject}
          bodyType={MODAL_BODY_TYPES.BORROWER_SLIP_ADD_ITEM}
          title={modalTitle}
          size={"max-w-xl"}
        />
      )}
    </div>
  );
}
