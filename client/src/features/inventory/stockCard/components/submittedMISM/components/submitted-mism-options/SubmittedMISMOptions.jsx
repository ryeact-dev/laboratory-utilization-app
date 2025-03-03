import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import { format } from "date-fns";
import { Ellipsis, Printer, ThumbsUp, Trash } from "lucide-react";

export default function SubmittedMISMOptions({ currentUser, mism, category }) {
  const openModal = modalStore((state) => state.openModal);

  const onPrintMISM = (mism) => {
    const isOffice = mism?.laboratory_name === "Laboratory Management Office";

    const payload = {
      title: "Print MISM",
      bodyType: MODAL_BODY_TYPES.STOCK_CARD_MISM_PRINT,
      extraObject: { ...mism, isOffice },
      size: "max-w-lg",
    };

    openModal(payload);
  };

  const onDeleteMISM = (mism) => {
    const message = `Remove ${mism?.laboratory_name}'s month of ${format(
      new Date(mism.date_submitted),
      "MMMM",
    )} from the list?`;

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_MISM_DELETE,
        forDeletionData: { mismId: mism.id },
      },
      size: "max-w-md",
    };

    openModal(payload);
  };

  const onAcknowledgeMISM = (selectedMISMId) => {
    const selectedMISMIds = [selectedMISMId];

    const payload = {
      title: "Submit MISM",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Acknowledge selected MISM submitted from ${mism?.laboratory_name}?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_MISM_ACKNOWLEDGE,
        forUpdatingData: { selectedMISMIds },
      },
      size: "max-w-sm",
    };

    openModal(payload);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {category !== 1 && mism.step === 1 && (
          <DropdownMenuItem onClick={() => onAcknowledgeMISM(mism.id)}>
            <ThumbsUp size={18} /> Acknowledge
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onPrintMISM(mism)}>
          <Printer size={18} /> Print
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:!bg-primary"
          onClick={() => onDeleteMISM(mism)}
          disabled={
            currentUser.role !== "Admin" && currentUser.role !== "Custodian"
          }
        >
          <Trash size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
