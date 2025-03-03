import { format, parseISO } from "date-fns";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import HardwareOptions from "../hardwareOptions/HardwareOptions";
import HardwareHeader from "./components/HardwareHeader";
import { getDateObsolescence } from "@/lib/helpers/calculateObsolescence";
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

export default function ListOfAllHardware({
  activeSchoolYear,
  laboratory,
  propertyno,
  page,
  setSearchParams,
  isLoading,
  listOfHardwares,
  isPlaceholderData,
  componentToPrintRef,
  currentUser,
}) {
  const listOfHardwaresWithObsolescence = listOfHardwares?.list
    ?.map((hardware) => {
      const obsolesenceDate = getDateObsolescence(
        hardware.date_acquired,
        hardware.hardware_upgrades,
      );
      return {
        ...hardware,
        obsolesenceDate,
      };
    })
    .sort((a, b) => a.obsolesenceDate - b.obsolesenceDate);

  // Create Page Numbers
  const pageNumber = Math.ceil(listOfHardwaresWithObsolescence?.length / 6);
  const pageArray = Number(pageNumber) > 0 ? Array(pageNumber)?.fill(null) : [];

  return (
    <>
      <HardwareHeader
        listOfHardwares={listOfHardwares}
        isPlaceholderData={isPlaceholderData}
        propertyno={propertyno}
        setSearchParams={setSearchParams}
        page={page}
      />

      <Table>
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

            <TableHead className={TABLE_HEADER_BADGE_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            listOfHardwares?.list?.length > 0 &&
            listOfHardwaresWithObsolescence.map((hardware) => (
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
                <TableCell>
                  <HardwareOptions
                    laboratory={laboratory}
                    hardwareOBJ={hardware}
                    school_year={activeSchoolYear}
                    hardwareId={hardware.id}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* For Print Section */}
      <div
        ref={componentToPrintRef}
        className="forPrint print:text-grey-100 font-sans"
      >
        {pageArray.map((_, index) => (
          <PrintHardwareList
            key={index}
            listOfHardwares={listOfHardwaresWithObsolescence}
            title={"Invetory of Hardwares"}
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
        listOfHardwares?.list?.length === 0 && (
          <NoRecordsFound>No Records Found</NoRecordsFound>
        )
      )}
    </>
  );
}
