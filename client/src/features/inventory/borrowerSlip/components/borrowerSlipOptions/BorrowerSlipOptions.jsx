import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { borrowerSlipStore } from "@/store";
import {
  Ellipsis,
  LogIn,
  LogOut,
  Printer,
  SquarePen,
  Trash,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function BorrowerSlipOptions({
  borrowerSlipData,
  isLaboratorySubjects,
  openModal,
  currentUser,
}) {
  const navigate = useNavigate();
  const setBorrowerSlipData = borrowerSlipStore(
    (state) => state.setBorrowerSlipData,
  );

  const openPrintModal = () => {
    const modalSettings = {
      title: "Print Borrower Slip",
      bodyType: MODAL_BODY_TYPES.BORROWER_SLIP_PRINT,
      extraObject: borrowerSlipData,
      size: "max-w-md",
    };

    openModal(modalSettings);
  };

  const onReleasedReturn = () => {
    const step = borrowerSlipData?.released_date ? "3" : "2";

    setBorrowerSlipData({
      id: borrowerSlipData.id,
      laboratory: borrowerSlipData.laboratory,
      step,
    });

    navigate(
      `/lumens/app/inventory-single-borrower-slip/${borrowerSlipData.id}?step=${step}`,
    );
  };

  const onEditBorrowerSlip = () => {
    setBorrowerSlipData({
      id: borrowerSlipData.id,
      laboratory: borrowerSlipData.laboratory,
      step: "1",
    });

    navigate(
      `/lumens/app/inventory-single-borrower-slip/${borrowerSlipData.id}`,
    );
  };

  const onDeleteBorrowerSlip = () => {
    const borrowerSlipId = borrowerSlipData.id;

    const modalSettings = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to delete this borrower slip?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_DELETE,
        forDeletionData: borrowerSlipId,
      },
    };

    openModal(modalSettings);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={!borrowerSlipData?.returned_date}
            onClick={openPrintModal}
          >
            <Printer size={16} />
            Print
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            disabled={
              borrowerSlipData?.returned_date && currentUser.role === "Admin"
            }
            onClick={onEditBorrowerSlip}
          >
            <LuFileText size={16} />
            Details
          </DropdownMenuItem> */}

          <DropdownMenuItem
            disabled={
              (currentUser.role !== "STA" ||
                currentUser.role !== "Custodian") &&
              borrowerSlipData?.released_date
            }
            onClick={onReleasedReturn}
          >
            <LogOut size={16} />
            Release
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={
              (currentUser.role !== "STA" ||
                currentUser.role !== "Custodian") &&
              (!borrowerSlipData?.released_date ||
                borrowerSlipData?.returned_date)
            }
            onClick={onReleasedReturn}
          >
            <LogIn size={16} />
            Return
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={
              borrowerSlipData?.returned_date || currentUser.role === "Admin"
            }
            onClick={onEditBorrowerSlip}
          >
            <SquarePen size={16} />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:!bg-primary"
            disabled={currentUser.userId !== borrowerSlipData?.user_id}
            onClick={onDeleteBorrowerSlip}
          >
            <Trash size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
