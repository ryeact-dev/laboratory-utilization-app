import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { Button } from "@/common/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { Trash } from "lucide-react";

export default function ReleaseBorrowerSlipItemTable({
  borrowerSlipItems,
  itemTypeFilter,
  singleBorrowerSlip,
  openModal,
  borrowerSlipId,
}) {
  const filteredItems = borrowerSlipItems
    ?.filter((item) => item.item_type === itemTypeFilter)
    .sort((a, b) => a.item_name.localeCompare(b.item_name));

  const onDeleteItem = (item) => {
    const modalSettings = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Delete ${item.item_name}?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_DELETE_ITEM,
        forDeletionData: {
          itemId: item.id,
          borrowerSlipId: item.borrower_slip_id,
          stockcardItemId: item.stockcard_item_id,
        },
      },
    };

    openModal(modalSettings);
  };

  const onEditItem = (item) => {
    const extraObject = {
      borrowerSlipId,
      borrowerSlipItems,
      forRelease: singleBorrowerSlip?.released_date === null,
      itemTypeFilter,
      selectedItem: item,
    };

    const modalSettings = {
      title: "Edit Item",
      bodyType: MODAL_BODY_TYPES.BORROWER_SLIP_ADD_ITEM,
      extraObject,
      size: "max-w-xl",
    };

    openModal(modalSettings);
  };

  return (
    <div className="mt-20 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Item Name
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Quantity</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Status</TableHead>

            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} `}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p className="-mb-1 capitalize">{item.item_name}</p>
                {item.item_type === "materials" && (
                  <p className="text-xs text-gray-400">{item.item_category}</p>
                )}
              </TableCell>

              <TableCell>
                {`${item.item_quantity} ${
                  item.item_type === "equipments" ? "unit" : item.item_unit
                }`}
              </TableCell>

              <TableCell>{item.released_status}</TableCell>

              <TableCell>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onDeleteItem(item)}
                  disabled={singleBorrowerSlip?.released_date !== null}
                >
                  <Trash size={16} strokeWidth={2.5} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredItems?.length === 0 && (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      )}
    </div>
  );
}
