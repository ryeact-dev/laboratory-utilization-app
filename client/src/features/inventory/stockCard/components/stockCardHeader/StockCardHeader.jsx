import StockCardLabHeader from "./components/stockCardLabHeader/StockCardLabHeader";
import StockCardMISMHeader from "./components/stockCardMISMHeader/StockCardMISMHeader";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import { useCallback } from "react";
import { Button } from "@/common/ui/button";
import SearchDebounceInput from "@/common/inputs/SearchDebounceInput";
import { Label } from "@/common/ui/label";
import { DatePicker } from "@/common/date-picker/DatePicker";
import { useGetCurrentUserData } from "@/hooks/users.hook";

export default function StockCardHeader({
  page,
  onPageClick,
  isPlaceholderData,
  hasMore,
  tab,
  onCategoryChange,
  category,
  laboratory,
  setSearchParams,
  search,
  currentUser,
  submissionDate,
  onDateChange,
  lastDayOfTheMonth,
  formattedDate,
}) {
  const { syEndingDate, syStartingDate } = useGetCurrentUserData();

  const lastMonthOfSchoolYear =
    new Date(syEndingDate) < new Date(lastDayOfTheMonth)
      ? new Date(syEndingDate)
      : new Date(lastDayOfTheMonth);

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("page", "1");
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const onInputValueChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("page", "1");
        prev.set("search", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const viewSelectLaboratory =
    tab !== "1" || currentUser.role === "Admin" || currentUser.role === "Dean";

  return (
    <div className="mb-4 flex items-center justify-end space-x-2">
      {tab === "2" ? (
        <div className="flex flex-col space-y-2">
          <Label>Stock type</Label>
          <StockCardLabHeader
            category={category}
            onCategoryChange={onCategoryChange}
          />
        </div>
      ) : tab === "3" ? (
        <div className="flex flex-col space-y-2">
          <Label>Status</Label>
          <StockCardMISMHeader
            category={category}
            onCategoryChange={onCategoryChange}
          />
        </div>
      ) : (
        ""
      )}
      <div className="flex w-full items-end justify-between gap-4">
        <div>
          {viewSelectLaboratory && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex flex-col space-y-2">
                <Label>
                  {tab === "1" ? "Office Name" : " Laboratory Name"}
                </Label>
                <SelectLaboratory
                  laboratory={laboratory}
                  onLaboratoryChange={onLaboratoryChange}
                  currentUser={currentUser}
                  isMism={true}
                  width="w-56"
                  tab={tab}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>As of Month of</Label>
                <DatePicker
                  date={submissionDate}
                  setDate={(date) => onDateChange(date)}
                  minDate={new Date(syStartingDate)}
                  maxDate={lastMonthOfSchoolYear}
                  formattedDate={formattedDate}
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {tab !== "3" && (
            <SearchDebounceInput
              setterFunction={onInputValueChange}
              placeholder={"Search item here..."}
              value={search}
            />
          )}
          <Button
            variant="outline"
            onClick={() => {
              const oldPage = Math.max(Number(page) - 1, 0);
              onPageClick(oldPage);
            }}
            disabled={Number(page) === 1}
          >
            Previous
          </Button>
          {/* <label className="px-2">{page}</label> */}
          <Button
            variant="outline"
            onClick={() => {
              if (!isPlaceholderData && hasMore) {
                const nextPage = Number(page) + 1;
                onPageClick(nextPage);
              }
            }}
            disabled={isPlaceholderData || !hasMore}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
