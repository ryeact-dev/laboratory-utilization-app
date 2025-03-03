import TitleCard from "@/common/titleCard/TitleCard";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { borrowerSlipStore, modalStore } from "@/store";

import ReleaseBorrowerSlipItem from "./components/releaseBorrowerSlipItem/ReleaseBorrowerSlipItem";
import { useGetSingleLabBorrowerSlip } from "@/hooks/borrowerSlip.hook";
import CreateBorrowerSlip from "./components/createBorrowerSlip/CreateBorrowerSlip";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import ReturnBorrowerSlipItem from "./components/returnBorrwerSlipItem/ReturnBorrowerSlipItem";
import SingleBorrowerSteps from "./components/singleBorrowerSteps/SingleBorrowerSteps";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import Stepper from "@/common/stepper/Stepper";
import { Button } from "@/common/ui/button";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { X } from "lucide-react";

const STEPS = ["Create", "Release", "Return"];

export default function SingleBorrowerSlip() {
  const { currentUser } = useGetCurrentUserData();

  const openModal = modalStore((state) => state.openModal);
  const [borrowerSlipId, laboratory, step, setResetBorrowerSlipData] =
    borrowerSlipStore((state) => [
      state.id,
      state.laboratory,
      state.step,
      state.setResetBorrowerSlipData,
    ]);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams({
    step: step ? step : "1",
  });

  const creationStep = searchParams.get("step");

  const { isLoading, data: singleBorrowerSlip } =
    useGetSingleLabBorrowerSlip(borrowerSlipId);

  const onCancelClick = () => {
    if (creationStep === "1") {
      navigate("/lumens/app/inventory-borrower-slip", { replace: true });
      // If the item_count is greater than zero, it means that the borrower slip is not empty.
      // if (Number(singleBorrowerSlip?.item_count) > 0) {
      //   navigate("/lumens/app/inventory-borrower-slip", { replace: true });
      // } else {
      //   const payload = {
      //     title: "Confirmation",
      //     bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      //     extraObject: {
      //       message: `Cancel / Delete the borrower slip?`,
      //       type: CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_DELETE,
      //       forDeletionData: borrowerSlipId,
      //     },
      //   };

      //   openModal(payload);
      // }
    } else {
      setSearchParams((prev) => {
        prev.set("step", `${Number(creationStep) - 1}`);
        return prev;
      });
    }
  };

  const isBorrowerSlipFilled = singleBorrowerSlip?.borrower_id ? true : false;
  const isFacultyOrProgHead =
    currentUser.role === "Faculty" || currentUser.role === "Program Head"
      ? true
      : false;

  let btnName;
  let loadingBtnName;
  let cancelBtnName;
  switch (creationStep) {
    case "1":
      btnName = isBorrowerSlipFilled ? "Next" : "Create";
      loadingBtnName = "Submitting...";
      cancelBtnName = "Cancel";
      break;
    case "2":
      btnName =
        singleBorrowerSlip?.released_date !== null
          ? "Next"
          : isFacultyOrProgHead
            ? "Return"
            : "Release";
      loadingBtnName = "Releasing...";
      cancelBtnName = "Back";
      break;
    case "3":
      btnName =
        singleBorrowerSlip?.returned_date !== null ? "Main Menu" : "Return";
      loadingBtnName = "Returning...";
      cancelBtnName = "Back";
      break;

    default:
      break;
  }

  const onCLoseClick = () => {
    navigate("/lumens/app/inventory-borrower-slip", { replace: true });
  };

  if (
    Number(creationStep) > 2 &&
    !LIST_OF_ALLOWED_USERS.includes(currentUser.role)
  ) {
    return <Navigate to="/lumens/app/inventory-borrower-slip" replace={true} />;
  }

  return (
    <TitleCard topMargin="-mt-2">
      <Button onClick={onCLoseClick} className="float-right">
        <X
          className="-me-1 -ms-1"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        Close
      </Button>

      {/* STEPS */}
      <div className="-mt-10">
        <Stepper singleReport={singleBorrowerSlip} steps={STEPS} />
      </div>

      {/* FORMS */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {creationStep === "1" ? (
            <CreateBorrowerSlip
              laboratory={laboratory}
              singleBorrowerSlip={singleBorrowerSlip}
              borrowerSlipId={borrowerSlipId}
              setSearchParams={setSearchParams}
              payload={singleBorrowerSlip}
              closeModal={onCancelClick}
              cancelBtnName={cancelBtnName}
              btnName={btnName}
              loadingBtnName={loadingBtnName}
            />
          ) : creationStep === "2" ? (
            <ReleaseBorrowerSlipItem
              laboratory={laboratory}
              borrowerSlipId={borrowerSlipId}
              singleBorrowerSlip={singleBorrowerSlip}
              setSearchParams={setSearchParams}
              creationStep={creationStep}
              closeModal={onCancelClick}
              cancelBtnName={cancelBtnName}
              btnName={btnName}
              openModal={openModal}
            />
          ) : (
            <ReturnBorrowerSlipItem
              singleBorrowerSlip={singleBorrowerSlip}
              borrowerSlipId={borrowerSlipId}
              setSearchParams={setSearchParams}
              creationStep={creationStep}
              closeModal={onCancelClick}
              cancelBtnName={cancelBtnName}
              loadingBtnName={loadingBtnName}
              btnName={btnName}
              openModal={openModal}
              navigate={navigate}
              setResetBorrowerSlipData={setResetBorrowerSlipData}
            />
          )}
        </div>
      )}
    </TitleCard>
  );
}
