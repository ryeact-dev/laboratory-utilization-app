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
import { useReleaseLabBorrowerSlip } from "@/hooks/borrowerSlip.hook";

export default function ReleaseBorrowerSlipModalBody({
  extraObject,
  closeModal,
}) {
  const { borrowerSlipId, borrowerSlipItems, instructorName, setSearchParams } =
    extraObject;

  const { mutate: onReleaseLabBorrowerSlipMutation, isPending } =
    useReleaseLabBorrowerSlip(closeModal, setSearchParams);

  const onSubmit = (evt) => {
    evt.preventDefault();

    const forUpdatingData = {
      borrowerSlipId,
      instructorName,
    };
    onReleaseLabBorrowerSlipMutation({ forUpdatingData });
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

                <TableCell>{item.released_status}</TableCell>
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
