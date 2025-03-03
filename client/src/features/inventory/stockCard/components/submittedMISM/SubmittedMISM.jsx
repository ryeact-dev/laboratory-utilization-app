import StockCardHeader from "../stockCardHeader/StockCardHeader";
import { addDays, format } from "date-fns";

import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { Card, CardContent } from "@/common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { Badge } from "@/common/ui/badge";
import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/tooltip";
import { Checkbox } from "@/common/ui/checkbox";
import SubmittedMISMOptions from "./components/submitted-mism-options/SubmittedMISMOptions";

export default function SubmittedMISM({
  tab,
  onPageClick,
  page,
  isPlaceholderData,
  data,
  isLoading,
  category,
  onCategoryChange,
  setSelectAll,
  setSelectedMISMIds,
  selectedMISMIds,
  selectAll,
  forAcknowledgement,
  currentUser,
  setSearchParams,
  laboratory,
  submissionDate,
  onDateChange,
  lastDayOfTheMonth,
  formattedDate,
}) {
  // TODO: FILTER THE REPORTS BY AS OF MONTH OF
  const onSelectAllSubmittedMISM = (checkValue) => {
    if (data?.listOfMISM.length === 0)
      return ToastNotification("error", "No reports to be selected");

    if (forAcknowledgement.length === 0)
      return ToastNotification("error", "No reports to be selected");

    const checkedValue = checkValue;
    setSelectAll(checkedValue);

    const reportIds = forAcknowledgement.map((report) => report.id);
    if (checkedValue) {
      setSelectedMISMIds(reportIds);
    } else setSelectedMISMIds([]);
  };

  const onCheckedChange = (checkValue, mismId) => {
    const isSelected = checkValue;

    setSelectAll(false);
    setSelectedMISMIds((prev) => {
      if (!isSelected) {
        return prev.filter((id) => id !== mismId);
      } else {
        return [...prev, mismId];
      }
    });
  };

  return (
    <div className="mt-6">
      <StockCardHeader
        onPageClick={onPageClick}
        page={page}
        isPlaceholderData={isPlaceholderData}
        hasMore={data?.hasMore}
        tab={tab}
        category={category}
        onCategoryChange={onCategoryChange}
        onSelectAllSubmittedMISM={onSelectAllSubmittedMISM}
        currentUser={currentUser}
        setSearchParams={setSearchParams}
        laboratory={laboratory}
        submissionDate={submissionDate}
        onDateChange={onDateChange}
        lastDayOfTheMonth={lastDayOfTheMonth}
        formattedDate={formattedDate}
      />
      {laboratory?.trim() !== "" && isLoading ? (
        <LoadingSpinner />
      ) : laboratory?.trim() !== "" && data?.listOfMISM.length === 0 ? (
        <p className="my-4 text-center">No Data to be displayed</p>
      ) : (
        <Card className="border-none">
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-3">
                      {category === 1 && currentUser.role === "Admin" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                className={`${selectAll && "bg-primary text-white"}`}
                                checked={selectAll}
                                onCheckedChange={(evt) =>
                                  onSelectAllSubmittedMISM(evt)
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select All</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <div className={`${TABLE_HEADER_BADGE_CLASS} w-40`}>
                        Laboratory
                      </div>
                    </div>
                  </TableHead>

                  <TableHead
                    className={`${TABLE_HEADER_BADGE_CLASS} text-center`}
                  >
                    Month of
                  </TableHead>

                  {/* <TableHead
                    className={`${TABLE_HEADER_BADGE_CLASS} text-center`}
                  >
                    Date Submittted
                  </TableHead> */}

                  <TableHead
                    className={`${TABLE_HEADER_BADGE_CLASS} text-center`}
                  >
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
                {data?.listOfMISM.map((mism) => (
                  <TableRow key={mism.id} className="uppercase">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category === 1 && currentUser.role === "Admin" && (
                          <Checkbox
                            checked={selectedMISMIds.includes(mism.id)}
                            onCheckedChange={(evt) =>
                              onCheckedChange(evt, mism.id)
                            }
                          />
                        )}
                        <div>
                          <p className="-mb-1 font-medium text-secondary">
                            {mism.laboratory_name}
                          </p>
                          <p className="text-xs opacity-60">
                            {mism?.laboratory_name?.toLowerCase() ===
                            "laboratory management office"
                              ? "Joe Ritz Bunhayag"
                              : mism.submitted_by}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {format(
                        addDays(new Date(mism.date_submitted), 1),
                        "MMMM yyyy",
                      )}
                    </TableCell>

                    {/* <TableCell className="text-center">
                      {format(
                        addDays(new Date(mism.created_at), 1),
                        "MMM. dd, yyyy",
                      )}
                    </TableCell> */}

                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Badge
                          className={`flex w-32 justify-center rounded-full border-none py-0 text-[10px] shadow-none ${
                            mism.step === 1
                              ? "bg-sky-500/20 text-sky-500 hover:bg-sky-500/20"
                              : "bg-green-600/10 text-green-600 hover:bg-green-600/10"
                          }`}
                        >
                          {`${mism.step === 1 ? "Submitted" : "Acknowledged"}`}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="flex items-center justify-center">
                      <SubmittedMISMOptions
                        category={category}
                        currentUser={currentUser}
                        mism={mism}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
