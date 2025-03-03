import {
  LABORATORIES_LIST,
  LABS_NEED_HARDWARE_LIST,
  OFFICE_LIST,
} from "@/globals/initialValues";
import { memo, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";

const SelectLaboratory = memo(function SelectLaboratory({
  onLaboratoryChange,
  currentUser,
  laboratory,
  width,
  tab,
  wasAcknowledged = false,
  isInventory = false,
  isMism = false,
  isEdit = false,
  additionalItems = [],
}) {
  // const onLaboratoryChange = useCallback(
  //   (evt) => {
  //     const value = evt.target.value;
  //     setSearchParams((prev) => {
  //       prev.set("q", value);
  //       return prev;
  //     });
  //   },
  //   [setSearchParams],
  // );

  const officeMapList = OFFICE_LIST.map((item) => item.value);

  const filteredLaboratories = useMemo(() => {
    if (isMism) {
      if (currentUser.role !== "Admin" && currentUser.role !== "Dean") {
        // IF USER IS A SCIENCE LAB STAFF
        if (currentUser.laboratory.includes("Biology Lab - Main")) {
          const labs =
            tab !== "3"
              ? ["Science Lab Stockroom", ...currentUser.laboratory]
              : [
                  "Science Lab Office",
                  "Science Lab Stockroom",
                  ...currentUser.laboratory,
                ];

          return isEdit ? labs : ["All Laboratories", ...labs];
        }

        // ELSE
        return isEdit
          ? currentUser.laboratory
          : ["All Laboratories", ...currentUser.laboratory];
      }

      switch (tab) {
        case "1":
          return ["All Offices", ...officeMapList];
        case "2":
          return [
            "All Laboratories",
            "Science Lab Stockroom",
            ...LABORATORIES_LIST,
          ];
        case "3":
          return [
            "All Laboratories",
            ...officeMapList,
            "Science Lab Stockroom",
            ...LABORATORIES_LIST,
          ];
        default:
          break;
      }
    }

    const baseList = isInventory
      ? LABS_NEED_HARDWARE_LIST
      : [...additionalItems, ...LABORATORIES_LIST];

    if (currentUser.role !== "Admin" && currentUser.role !== "Dean") {
      const filteredList = baseList
        .filter((location) => currentUser.laboratory.includes(location))
        .sort((a, b) => a.localeCompare(b));

      if (wasAcknowledged) {
        return ["All Laboratories", ...filteredList];
      }

      return filteredList;
    }

    return baseList;
  }, [isMism, isInventory, currentUser.role, currentUser.laboratory]);

  // RENDER SECTION
  return (
    <Select onValueChange={onLaboratoryChange} value={laboratory}>
      <SelectTrigger className={`truncate ${width ? width : "sm:w-60"} `}>
        <SelectValue placeholder="Select Laboratory" />
      </SelectTrigger>
      <SelectContent>
        {filteredLaboratories.map((lab, k) => {
          return (
            <SelectItem value={lab} key={k}>
              {lab}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
});

export default SelectLaboratory;
