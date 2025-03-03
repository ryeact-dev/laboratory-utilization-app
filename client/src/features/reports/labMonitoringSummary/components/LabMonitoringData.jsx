import { aggregatedWeeklyMonitoring } from "@/lib/helpers/aggregatedWeeklyMonitoring";
import LabMonitoringForPrint from "./LabMonitoringForPrint";
import Information from "@/common/information/Information";
import ReactToPrint from "react-to-print";
import {
  getRelativeWeekNumber,
  getWeekDatesExcludeSunday,
} from "@/lib/helpers/dateTime";
import { Button } from "@/common/ui/button";
import {
  SUB_CARD_BG_CLASS,
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
import { Printer } from "lucide-react";

export default function LabMonitoringData({
  listOfLabMonitoring,
  weekDates,
  componentToPrintRef,
  laboratory,
  TermSemStartingDate,
  currentUser,
  date,
}) {
  const aggredatedMonitoring = aggregatedWeeklyMonitoring(
    listOfLabMonitoring,
    weekDates,
  );

  const printLabMonitoringBtn = (
    <Button disabled={listOfLabMonitoring.length === 0}>
      <Printer size={20} strokeWidth={2.5} />
      Print Monitoring
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printLabMonitoringBtn}
      content={() => componentToPrintRef.current}
    />
  );

  return (
    <>
      <div className="-mt-4 flex items-center justify-between">
        {reactToPrintBtn}
        <div className="text-right">
          <p className="-mb-1 text-lg text-secondary">
            Week: {getRelativeWeekNumber(TermSemStartingDate, date)}
          </p>
          <p>{getWeekDatesExcludeSunday(date).week}</p>
        </div>
      </div>
      <Information
        title={"Print Info"}
        message={
          "For better print result please set the ff. settings: Scaling: 78, Papersize: A4, Layout: Landscape "
        }
        className={"mb-4 rounded-md"}
      />

      <Card className={`${SUB_CARD_BG_CLASS}`}>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>Date</TableHead>

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
                  Subject
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggredatedMonitoring?.map(
                (
                  {
                    usage_date,
                    network_average,
                    other_remarks,
                    subjectWithProblems,
                  },
                  index,
                ) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ fontFamily: "Roboto Mono" }}
                      className="w-[10%]"
                    >
                      {usage_date}
                    </TableCell>

                    <TableCell className="w-[20%] space-y-2">
                      <p>
                        {network_average !== "NaN" ? "Internet Speed" : ""}{" "}
                      </p>
                      <p>
                        {other_remarks.length > 0
                          ? other_remarks[0].remark.indexOf(".") > -1
                            ? other_remarks[0].remark.split(".")[1]
                            : other_remarks[0].remark
                          : "No remarks entered"}
                      </p>
                    </TableCell>

                    <TableCell className="w-[20%] space-y-2">
                      <p>{network_average !== "NaN" && "-"}</p>
                      <p style={{ fontFamily: "Roboto Mono" }}>
                        {other_remarks.length > 0
                          ? other_remarks[0].unit_number !== ""
                            ? other_remarks[0].unit_number
                            : "-"
                          : "-"}
                      </p>
                    </TableCell>

                    <TableCell className="w-[30%] space-y-2">
                      <p>
                        {network_average !== "NaN" ? (
                          <span>
                            {network_average} mbps{" "}
                            <span className="text-sm italic">
                              (avg. internet speed)
                            </span>
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                      <p>
                        {other_remarks.length > 0
                          ? other_remarks[0].problem !== ""
                            ? other_remarks[0].problem
                            : `-`
                          : "-"}
                      </p>
                    </TableCell>

                    <TableCell className="w-[15%] space-y-2">
                      <p>{`-`}</p>
                      {/* <p>{`\u0000`}</p> */}
                      <p>{subjectWithProblems[0]}</p>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <LabMonitoringForPrint
        componentToPrintRef={componentToPrintRef}
        tableData={aggredatedMonitoring}
        laboratory={laboratory}
        TermSemStartingDate={TermSemStartingDate}
        currentUser={currentUser}
        date={date}
      />
    </>
  );
}
