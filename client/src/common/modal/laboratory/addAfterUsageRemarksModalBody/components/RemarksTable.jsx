import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { Button } from "@/common/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { Trash } from "lucide-react";

export default function RemarksTable({
  isLoading,
  listOfRemarks,
  onRemarkRemoveClick,
  extraObject,
  isComputingLab,
}) {
  // RENDER SECTION
  return (
    <article className="mt-2">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>Remark</TableHead>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>Desc</TableHead>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Ticket No
              </TableHead>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listOfRemarks?.map(
              ({ id, remark, unit_number, problem, ticket_no }, index) => (
                <TableRow key={index}>
                  <TableCell className="min-w-[10rem]">
                    {!isComputingLab ? null : unit_number > 0 ? (
                      remark !== "No problems found" &&
                      remark !== "Internet Speed" ? (
                        <p>Unit : {unit_number} </p>
                      ) : (
                        ""
                      )
                    ) : null}
                    <p className="capitalize">
                      {remark.indexOf(".") > -1 ? remark.split(".")[1] : remark}
                    </p>
                  </TableCell>

                  <TableCell className="w-full">
                    {remark === "Internet Speed" ? `${problem} mbps` : problem}
                  </TableCell>

                  <TableCell className="w-full min-w-[6rem]">
                    {ticket_no === null ? "-" : ticket_no}
                  </TableCell>

                  <TableCell className="min-w-[5px]">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:bg-primary hover:text-white"
                      onClick={() => onRemarkRemoveClick(extraObject, id)}
                    >
                      <Trash size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      )}
    </article>
  );
}
