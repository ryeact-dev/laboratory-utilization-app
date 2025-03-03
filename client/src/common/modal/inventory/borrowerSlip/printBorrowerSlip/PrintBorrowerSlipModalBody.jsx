import Information from "@/common/information/Information";
import { Button } from "@/common/ui/button";
import BorrowerSlipPrint from "@/features/inventory/borrowerSlip/components/borrowerSlipPrint/BorrowerSlipPrint";
import {
  useGetBorrowerSlipItems,
  useGetBorrowerSlipUsers,
} from "@/hooks/borrowerSlip.hook";
import { CircleX, Printer } from "lucide-react";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

export default function PrintBorrowerSlipModalBody({
  closeModal,
  extraObject,
}) {
  const componentToPrintRef = useRef(null);

  const { data: borrowerSlipItems = [] } = useGetBorrowerSlipItems(
    extraObject.id,
  );

  const { data: borrowerSlipUsers = [] } = useGetBorrowerSlipUsers(
    extraObject.id,
  );

  const equipmentItems = borrowerSlipItems?.filter(
    (item) => item.item_type === "equipments",
  );

  const materialItems = borrowerSlipItems?.filter(
    (item) => item.item_type === "materials",
  );

  const printResultsBtn = (
    <Button variant="secondary" className="w-44 font-semibold">
      <Printer size={18} strokeWidth={2.5} className="" />
      Proceed
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printResultsBtn}
      content={() => componentToPrintRef.current}
    />
  );

  return (
    <>
      <Information
        title={"Print Info"}
        message={
          "For better print result please set the ff. settings: Scaling: 70 below, Papersize: A4, Orientation: Portrait."
        }
        className={"mb-4"}
      />
      <div className="flex justify-end gap-2">
        <Button variant="destructive" onClick={() => closeModal()}>
          <p className="flex items-center gap-1">
            <CircleX size={18} strokeWidth={2.5} />
            Cancel
          </p>
        </Button>
        {reactToPrintBtn}
      </div>
      <BorrowerSlipPrint
        componentToPrintRef={componentToPrintRef}
        borrowerSlipData={extraObject}
        borrowerSlipUsers={borrowerSlipUsers}
        equipmentItems={equipmentItems}
        materialItems={materialItems}
      />
    </>
  );
}
