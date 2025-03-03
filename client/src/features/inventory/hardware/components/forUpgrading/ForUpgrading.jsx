import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { forUpgrading } from "@/lib/helpers/calculateObsolescence";
import { format, parseISO } from "date-fns";
import PrintHardwareList from "../printerHardwareList/PrintHardwareList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";

export default function ForUpgrading({
  isLoading,
  listOfSystemUnits,
  componentToPrintRef,
  laboratory,
  currentUser,
}) {
  const forUpgradingList = forUpgrading(listOfSystemUnits);

  // Create Page Numbers
  const pageNumber = Math.ceil(forUpgradingList?.length / 6);
  const pageArray = Number(pageNumber) > 0 ? Array(pageNumber)?.fill(null) : [];

  return (
    <>
      <Table className="mt-12">
        <TableHeader>
          <TableRow>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Item Specifications
            </TableHead>

            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Date Aquired
            </TableHead>

            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Date Upgraded
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Upgrade Details
            </TableHead>
            <TableHead className={TABLE_HEADER_BADGE_CLASS}>
              Date of Obsolescence
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            forUpgradingList?.map((hardware) => (
              <TableRow key={hardware.id}>
                <TableCell className="">
                  <p className="text-secondary">{hardware.property_number}</p>
                  <p> {hardware.specs}</p>
                </TableCell>

                <TableCell>
                  {format(parseISO(hardware.date_acquired), "MMM dd, yyyy")}
                </TableCell>

                <TableCell>
                  {hardware?.hardware_upgrades?.length > 0
                    ? hardware?.hardware_upgrades?.map(
                        ({ date_upgraded }, i) => (
                          <p key={i}>
                            {format(new Date(date_upgraded), "MMM dd, yyyy")}
                          </p>
                        ),
                      )
                    : "No upgrades"}
                </TableCell>

                <TableCell>
                  {hardware?.hardware_upgrades?.length > 0
                    ? hardware?.hardware_upgrades?.map(
                        ({ upgrade_details }, i) => (
                          <p key={i}>{upgrade_details}</p>
                        ),
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {format(hardware.obsolesenceDate, "MMM dd, yyyy")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* For Print Section */}
      <div
        ref={componentToPrintRef}
        className="text-grey-100 forPrint font-sans"
      >
        {pageArray.map((_, index) => (
          <PrintHardwareList
            key={index}
            listOfHardwares={forUpgradingList}
            title={"For Upgrading"}
            laboratory={laboratory}
            currentUser={currentUser}
            index={index}
          />
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        !isLoading &&
        forUpgradingList?.length === 0 && (
          <NoRecordsFound>No Records Found</NoRecordsFound>
        )
      )}
    </>
  );
}
