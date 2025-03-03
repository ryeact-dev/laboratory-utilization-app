import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import {
  useDeleteHardwareUpgrade,
  useGetHardwareUpgrades,
} from "@/hooks/hardwares _upgrades.hook";
import { format } from "date-fns";
import { CircleX } from "lucide-react";

export default function UpgradesTable({ hardwareOBJ, laboratory, form }) {
  const { setValue, reset } = form;

  const { isLoading, data: upgradeList = [] } = useGetHardwareUpgrades(
    hardwareOBJ.id,
    laboratory,
  );

  const { mutate: onDeleteUpgradeMutation } = useDeleteHardwareUpgrade(reset);

  const onDeleteUpgrade = (hardwareUpgradeId) => {
    const forDeletingData = {
      id: hardwareUpgradeId,
      propertyNumber: hardwareOBJ.property_number,
    };

    onDeleteUpgradeMutation(forDeletingData);
  };

  const onSelecteUpgradeDetails = (upgradeDetail) => {
    setValue("upgrade_details", upgradeDetail.upgrade_details);
    setValue("date_upgraded", new Date(upgradeDetail.date_upgraded));
    setValue("upgrade_id", upgradeDetail.id);
  };

  // RENDER SECTION
  return (
    <article className="mb-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-sm`}>
              Date Upgraded
            </TableHead>

            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-sm`}>
              Upgrade Details
            </TableHead>

            <TableHead className={`${TABLE_HEADER_BADGE_CLASS} text-sm`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            upgradeList.map((item, index) => (
              <TableRow key={index}>
                <TableCell onClick={() => onSelecteUpgradeDetails(item)}>
                  {format(new Date(item.date_upgraded), "MMM dd, yyyy")}
                </TableCell>

                <TableCell onClick={() => onSelecteUpgradeDetails(item)}>
                  {item.upgrade_details}
                </TableCell>

                <TableCell>
                  <CircleX
                    size={18}
                    onClick={() => onDeleteUpgrade(item.id)}
                    className="hover:cursor-pointer hover:text-primary"
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </article>
  );
}
