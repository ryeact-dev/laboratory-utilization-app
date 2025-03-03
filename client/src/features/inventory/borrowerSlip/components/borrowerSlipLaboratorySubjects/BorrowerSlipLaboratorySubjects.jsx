import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { useGetPaginatedLabBorrowerSlips } from "@/hooks/borrowerSlip.hook";
import { getProgramHeads } from "@/lib/helpers/programHeads";
import { format } from "date-fns";
import { useState } from "react";
import BorrowerSlipOptions from "../borrowerSlipOptions/BorrowerSlipOptions";
import { modalStore } from "@/store";
import {
  LIST_OF_ALLOWED_USERS,
  TABLE_HEADER_BADGE_CLASS,
} from "@/globals/initialValues";
import { Card, CardContent } from "@/common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";

export default function BorrowerSlipLaboratorySubjects({
  isLaboratorySubjects,
  selectedLaboratory,
  selectedTermAndSem,
  currentUser,
  bSlipStatus,
}) {
  const openModal = modalStore((state) => state.openModal);
  const [wasReturned, setWasReturned] = useState(false);

  const isCustodian = LIST_OF_ALLOWED_USERS.includes(currentUser.role);

  const { isLoading, data: labBorrowerSlips } = useGetPaginatedLabBorrowerSlips(
    selectedLaboratory,
    selectedTermAndSem,
    wasReturned,
    isCustodian,
    bSlipStatus,
  );

  return (
    <div className="overflow-hidden">
      <Card className="border-none">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Date Filed
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Subject
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Instructor
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Sched of Usage
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Status
                </TableHead>
                <TableHead
                  className={`${TABLE_HEADER_BADGE_CLASS} text-center`}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                labBorrowerSlips?.length > 0 &&
                labBorrowerSlips?.map((borrowerSlip) => (
                  <TableRow key={borrowerSlip.id}>
                    <TableCell>
                      <p>
                        {format(
                          new Date(borrowerSlip.created_at),
                          "MMM dd, yyyy",
                        )}
                      </p>
                      <p className="text-xs opacity-70">
                        {borrowerSlip.created_by}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p>{`${borrowerSlip.code} - ${borrowerSlip.title}`}</p>
                      <p className="text-xs opacity-70">
                        {borrowerSlip.laboratory}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p>{borrowerSlip.instructor}</p>
                    </TableCell>

                    <TableCell>
                      <p>
                        {format(
                          new Date(borrowerSlip.schedule_date_of_use),
                          "MMM dd, yyyy",
                        )}
                      </p>
                      <p className="text-xs opacity-70">
                        {borrowerSlip.term_sem}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div
                        className={`py-.5 w-24 max-w-24 rounded-full border px-1 text-center ${
                          borrowerSlip.returned_date
                            ? "border-green-600 bg-green-600/10 text-green-600"
                            : borrowerSlip.released_date
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-blue-400 bg-blue-400/10 text-blue-400"
                        }`}
                      >
                        <p className="text-xs">
                          {borrowerSlip.returned_date
                            ? "Returned"
                            : borrowerSlip.released_date
                              ? "For return"
                              : "For release"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <BorrowerSlipOptions
                        openModal={openModal}
                        isLaboratorySubjects={isLaboratorySubjects}
                        borrowerSlipData={borrowerSlip}
                        currentUser={currentUser}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        !isLoading &&
        labBorrowerSlips?.length === 0 && (
          <NoRecordsFound>No Records Found</NoRecordsFound>
        )
      )}
    </div>
  );
}
