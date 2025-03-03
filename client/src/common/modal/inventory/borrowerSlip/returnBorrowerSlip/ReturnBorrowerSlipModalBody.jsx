import BottomButtons from "@/common/buttons/BottomButtons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { useMarkBorrowerSlipAsReturned } from "@/hooks/borrowerSlip.hook";

export default function ReturnBorrowerSlipModalBody({
  extraObject,
  closeModal,
}) {
  const { borrowerSlipId, instructorName, borrowerSlipItems } = extraObject;

  const { mutate: onReturnLabBorrowerSlipMutation, isPending } =
    useMarkBorrowerSlipAsReturned(closeModal);

  const onSubmit = (evt) => {
    evt.preventDefault();

    const forUpdatingData = {
      borrowerSlipId,
      instructorName,
    };
    onReturnLabBorrowerSlipMutation({ forUpdatingData });
  };

  return (
    <form onSubmit={onSubmit}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Item Name
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Quantity</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Status</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Damaged</TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {borrowerSlipItems
            ?.sort((a, b) => a.item_name.localeCompare(b.item_name))
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell className="capitalize">{item.item_name}</TableCell>

                <TableCell className="capitalize">
                  {`${item.item_quantity} ${
                    item.item_type === "equipments" ? "unit" : item.item_unit
                  }`}
                </TableCell>

                <TableCell>{item.returned_status}</TableCell>

                <TableCell>
                  {item.item_damaged_quantity > 0
                    ? item.item_damaged_quantity
                    : "-"}
                </TableCell>

                <TableCell>{item.item_remarks || "-"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <BottomButtons
        isLoading={isPending}
        btnName="Confirm"
        closeModal={closeModal}
      />
    </form>
  );
}
