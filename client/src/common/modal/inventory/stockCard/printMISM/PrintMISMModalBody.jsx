import Information from "@/common/information/Information";
import { Button } from "@/common/ui/button";
import StockCardMISMPrint from "@/features/inventory/stockCard/components/stockMISMPrint/StockCardMISMPrint";
import { CircleX, Printer } from "lucide-react";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

export default function PrintMISMModalBody({ closeModal, extraObject }) {
  const componentToPrintRef = useRef(null);

  const printResultsBtn = (
    <Button variant="secondary" className="w-40">
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
          "For better print result please set the ff. settings: Scaling: 80 below, Papersize: A4, Orientation: Portrait."
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

      <StockCardMISMPrint
        componentToPrintRef={componentToPrintRef}
        mismData={extraObject}
      />
    </>
  );
}
