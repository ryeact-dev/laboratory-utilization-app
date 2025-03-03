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
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { SquarePen } from "lucide-react";

export default function ReturnBorrowerSlipItemTable({
  borrowerSlipItems,
  itemTypeFilter,
  singleBorrowerSlip,
  borrowerSlipId,
  openModal,
}) {
  const filteredItems = borrowerSlipItems
    ?.filter((item) => item.item_type === itemTypeFilter)
    .sort((a, b) => a.item_name.localeCompare(b.item_name));

  const onEditItem = (item) => {
    const extraObject = {
      borrowerSlipId,
      borrowerSlipItems,
      forRelease: singleBorrowerSlip?.released_date !== null,
      itemTypeFilter,
      selectedItem: item,
    };

    const modalSettings = {
      title: "Update Item",
      bodyType: MODAL_BODY_TYPES.BORROWER_SLIP_ADD_ITEM,
      extraObject,
      size: "max-w-xl",
    };

    openModal(modalSettings);
  };

  console.log(filteredItems);

  return (
    <div className="mt-16 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Item Name
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Quantity</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Status</TableHead>

            {itemTypeFilter === "materials" && (
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Damaged
              </TableHead>
            )}

            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Remarks</TableHead>

            <TableHead className={`${TABLE_HEADER_BADGE_CLASS}`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p className="-mb-1 capitalize">{item.item_name}</p>
                <p className="text-xs text-gray-400">{item.item_category}</p>
              </TableCell>

              <TableCell>
                {`${item.item_quantity} ${
                  item.item_type === "equipments" ? "unit" : item.item_unit
                }`}
              </TableCell>

              <TableCell>{item.returned_status}</TableCell>

              {itemTypeFilter === "materials" && (
                <TableCell>
                  {item.item_damaged_quantity > 0
                    ? item.item_damaged_quantity
                    : "-"}
                </TableCell>
              )}

              <TableCell>
                {!item.item_remarks ? "-" : item.item_remarks}
              </TableCell>

              <TableCell>
                {item.item_category !== "Consumable" ? (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onEditItem(item)}
                    disabled={singleBorrowerSlip?.returned_date !== null}
                  >
                    <SquarePen size={16} strokeWidth={2.5} />
                  </Button>
                ) : (
                  ""
                )}
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
