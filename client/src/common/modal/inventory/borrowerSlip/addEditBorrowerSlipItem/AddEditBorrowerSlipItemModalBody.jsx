import { useSearchParams } from "react-router-dom";
import AddBorrowerSlipItemModalBody from "./components/addBorrowerSlipItem/AddBorrowerSlipItemModalBody";
import ReturnBorrowerSlipItemModalBody from "./components/returnBorrowerSlipItem/ReturnBorrowerSlipItemModalBody";

export default function AddEditBorrowerSlipItemModalBody({
  extraObject,
  closeModal,
}) {
  const searchParams = useSearchParams()[0];

  const creationStep = searchParams.get("step");

  return creationStep === "2" ? (
    <AddBorrowerSlipItemModalBody
      extraObject={extraObject}
      closeModal={closeModal}
    />
  ) : (
    <ReturnBorrowerSlipItemModalBody
      extraObject={extraObject}
      closeModal={closeModal}
    />
  );
}
