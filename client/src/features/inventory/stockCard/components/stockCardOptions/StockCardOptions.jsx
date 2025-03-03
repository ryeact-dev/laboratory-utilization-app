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
import { SCIENCE_LAB_LIST } from "@/globals/initialValues";
import { modalStore } from "@/store";
import { ClipboardList, Ellipsis, SquarePen, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockCardOptions({
  item,
  tab,
  category,
  laboratory,
  laboratoryCategory,
  submissionDate,
}) {
  const openModal = modalStore((state) => state.openModal);

  const navigate = useNavigate();

  const onOpenModalClick = (option) => {
    let payload;

    const message = (
      <p>
        Are you sure you want to delete{" "}
        <span className="capitalize">{item.item_name}?</span>
      </p>
    );

    const isOffice = tab === "1" ? true : false;

    const isCurrentUserLabIsScienceLab = SCIENCE_LAB_LIST.includes(laboratory);

    const laboratoryName =
      isOffice && isCurrentUserLabIsScienceLab
        ? "Science Lab Office"
        : laboratory;

    switch (option) {
      case "edit":
        payload = {
          title: "Update Stock Card",
          bodyType: MODAL_BODY_TYPES.STOCK_CARD_ADD_NEW,
          extraObject: {
            stockCardData: item,
            isOffice,
            laboratory: laboratoryName,
            isEdit: true,
            submissionDate,
          },
          size: "max-w-md",
        };
        break;

      case "delete":
        payload = {
          title: "Confirmation",
          bodyType: MODAL_BODY_TYPES.CONFIRMATION,
          extraObject: {
            message,
            type: CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_DELETE,
            forDeletionData: item.id,
          },
        };
        break;

      default:
        break;
    }

    openModal(payload);
  };

  const onDetailsClick = () => {
    let selectedTab = tab;

    if (selectedTab === "2") {
      if (laboratoryCategory !== "") selectedTab = "0";
    }

    navigate(`/lumens/app/inventory-stock-card/${item.id}`, {
      state: { ...item, category, tab: selectedTab },
    });
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
        <DropdownMenuItem onClick={onDetailsClick}>
          <ClipboardList size={16} />
          Items
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenModalClick("edit")}>
          <SquarePen size={16} />
          Edit
        </DropdownMenuItem>

        {Number(tab) < 3 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:!bg-primary"
              onClick={() => onOpenModalClick("delete")}
            >
              <Trash size={16} />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
