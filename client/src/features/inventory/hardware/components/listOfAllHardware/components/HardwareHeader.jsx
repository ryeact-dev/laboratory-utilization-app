import SearchDebounceInput from "@/common/inputs/SearchDebounceInput";
import { Button } from "@/common/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HardwareHeader({
  isPlaceholderData,
  page,
  propertyno,
  setSearchParams,
  listOfHardwares,
}) {
  const onProprtyNumberChange = (value) => {
    setSearchParams(
      (prev) => {
        prev.set("propertyno", value);
        prev.set("page", 1);
        return prev;
      },
      { replace: true },
    );
  };

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  return (
    <div className="mb-3 flex items-center justify-end gap-4">
      <SearchDebounceInput
        setterFunction={onProprtyNumberChange}
        placeholder={"Search Property number here"}
      />
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            const oldPage = Math.max(Number(page) - 1, 0);
            onPageClick(oldPage);
          }}
          disabled={Number(page) === 1}
        >
          <ChevronLeft size={16} strokeWidth={3} />
        </Button>
        <label className="px-2">{page}</label>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            if (!isPlaceholderData && !listOfHardwares?.hasMore) {
              const nextPage = Number(page) + 1;
              onPageClick(nextPage);
            }
          }}
          disabled={
            isPlaceholderData || listOfHardwares?.hasMore || !listOfHardwares
          }
        >
          <ChevronRight size={16} strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
