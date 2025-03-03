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
import { Ellipsis, SquarePen, Trash } from "lucide-react";

export default function SingleStockCardOptions({
  stockCardItems,
  state,
  category,
  item,
  index,
  openModal,
}) {
  const onEditStockItem = (item, index) => {
    const type = item.released_to
      ? "STOCK_CARD_RELEASE_ITEM"
      : "STOCK_CARD_ADD_ITEM";

    // Calculate the balance before the current transaction
    let stockItemBalance = 0;

    // When editing, we need the balance before this transaction
    // If it's a release, add back the quantity; if it's a receipt, subtract the quantity
    if (stockCardItems?.items.length > 0) {
      const currentItem = stockCardItems.items[index];
      stockItemBalance = currentItem.item_balance;

      console.log("before", stockItemBalance);

      if (item.released_to) {
        // Add back the released quantity
        console.log("item_quantity", currentItem.item_quantity);
        stockItemBalance += currentItem.item_quantity;
      } else {
        // Subtract the received quantity
        console.log("item_received", currentItem.item_received);
        stockItemBalance -= currentItem.item_received;
      }

      console.log("after", stockItemBalance);
    }

    const payload = {
      title: `${item.released_to ? "Issue" : "Receive"} Items`,
      bodyType: MODAL_BODY_TYPES[type],
      extraObject: {
        stockCardData: state,
        totalBalance: stockCardItems.stockCardTotalBalance,
        category,
        stockItemBalance,
        stockItem: item,
        isFirstItem: index === stockCardItems?.items.length - 1,
      },
    };

    openModal(payload);
  };

  const deleteSubject = (item) => {
    const isOffice = state?.tab === "1" ? true : false;

    const forDeletionData = {
      itemId: item.id,
      stockCardReleasedId: item.stockcard_released_id,
      isOffice,
    };

    // console.log(forDeletionData);

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to delete this item?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_DELETE_ITEM,
        forDeletionData,
      },
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
        {state?.tab !== "0" ? (
          <DropdownMenuItem onClick={() => onEditStockItem(item, index)}>
            <SquarePen className="-mr-1 size-4" />
            Edit
          </DropdownMenuItem>
        ) : item.released_to ? (
          <DropdownMenuItem onClick={() => onEditStockItem(item, index)}>
            <SquarePen className="-mr-1 size-4" />
            Edit
          </DropdownMenuItem>
        ) : (
          ""
        )}

        {index === 0 && (
          <DropdownMenuItem
            className="hover:!bg-primary"
            onClick={() => deleteSubject(item)}
          >
            <Trash className="-mr-1 size-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
