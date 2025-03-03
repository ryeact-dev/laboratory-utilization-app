import { modalStore } from "@/store";
import { format } from "date-fns";
import { useGetUtilizationRemarks } from "@/hooks/remarks.hook";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import PrintMonitoring from "./components/printMonitoring/PrintMonitoring";
import {
  LABS_NEED_HARDWARE_LIST,
  TABLE_HEADER_BADGE_CLASS,
} from "@/globals/initialValues";
import Information from "@/common/information/Information";
import { Card, CardContent } from "@/common/ui/card";
import { Label } from "@/common/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { Button } from "@/common/ui/button";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { CircleX, Printer } from "lucide-react";

function ListOfLabMonitoringModalBody({ extraObject, closeModal }) {
  const componentToPrintRef = useRef(null);

  const openModal = modalStore((state) => state.openModal);

  const { currentUser, activeSchoolYear, termSemStartingDate } =
    useGetCurrentUserData();

  const { weekDates, date, subjectId, laboratory, selectedTermAndSem } =
    extraObject;

  const { isLoading, data: listOfLabMonitoring = [] } =
    useGetUtilizationRemarks(
      subjectId,
      laboratory,
      activeSchoolYear,
      weekDates,
      selectedTermAndSem,
    );

  // ON REMARKS CLICK
  const openRemarksModal = (usageId, laboratory) => {
    const payload = {
      title: `After usage remarks`,
      bodyType: MODAL_BODY_TYPES.AFTER_USAGE_REMARKS_OPEN,
      extraObject: { usageId, laboratory },
    };

    openModal(payload);
  };

  // ON DELETE REMARK CLICK
  const deleteRemark = (usageId) => {
    // const payload = {
    //   title: `Remove subject remark`,
    //   bodyType: MODAL_BODY_TYPES.AFTER_USAGE_REMARKS_OPEN,
    //   extraObject:  usageId,
    // };
    // openModal(payload);
  };

  const printResultsBtn = (
    <Button>
      <Printer size={18} strokeWidth={2.5} className="" />
      Print Monitoring
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printResultsBtn}
      content={() => componentToPrintRef.current}
    />
  );

  const whatToDisplay =
    !isLoading && listOfLabMonitoring?.length > 0 ? "data" : null;

  const isComputingLab = LABS_NEED_HARDWARE_LIST.slice(0, 7).includes(
    laboratory,
  );

  // RENDER SECTION
  return (
    <>
      {listOfLabMonitoring?.length > 0 &&
        currentUser.role === "Admin" &&
        isComputingLab && (
          <>
            <div className="-mt-4 flex justify-end">{reactToPrintBtn}</div>
            <Information
              title={"Print Info"}
              message={
                "For better print result please set the ff. settings: Scaling: 85, Papersize: A4, Layout: Portrait"
              }
              className={"bg-gray-800/50"}
            />
          </>
        )}
      {isLoading ? (
        <LoadingSpinner />
      ) : whatToDisplay === "data" ? (
        <article className="w-full space-y-4">
          {listOfLabMonitoring?.map((usage, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-4">
                <div className="icons-center flex justify-between">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold uppercase text-secondary">
                        {`${format(new Date(usage.usage_date), "MMM dd, yyyy")}`}
                      </p>
                      <p className="-mt-1 text-sm">
                        {`${format(
                          new Date(usage.start_time),
                          "hh:mm a",
                        )} - ${format(new Date(usage.end_time), "hh:mm a")}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3"></div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                        Remark
                      </TableHead>
                      <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                        PC No.
                      </TableHead>
                      <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                        Description
                      </TableHead>
                      <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                        Ticket No.
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listOfLabMonitoring[index].details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.remark}</TableCell>

                        <TableCell>
                          {Number(detail.unit_number) <= 0
                            ? "-"
                            : detail.unit_number}
                        </TableCell>
                        <TableCell>
                          {detail.remark === "Internet Speed"
                            ? `${detail.problem} MBPS`
                            : detail.problem
                              ? detail.problem
                              : "-"}
                        </TableCell>
                        <TableCell>
                          {detail.ticket_no ? detail.ticket_no : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}

          <div className="float-right">
            <Button
              type="button"
              variant="destructive"
              onClick={() => closeModal()}
            >
              <p className="flex items-center gap-1">
                <CircleX size={18} strokeWidth={2.5} />
                Close
              </p>
            </Button>
          </div>
        </article>
      ) : (
        <NoRecordsFound>No Records Found.</NoRecordsFound>
      )}
      {listOfLabMonitoring?.length > 0 && (
        <PrintMonitoring
          componentToPrintRef={componentToPrintRef}
          listOfLabMonitoring={listOfLabMonitoring}
          currentUser={currentUser}
          termSemStartingDate={termSemStartingDate}
          laboratory={laboratory}
        />
      )}
    </>
  );
}

export default ListOfLabMonitoringModalBody;
