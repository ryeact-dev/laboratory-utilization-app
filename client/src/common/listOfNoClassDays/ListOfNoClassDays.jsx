import { useGetListOfNoClassDays } from "@/hooks/noClassDays.hook";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { memo } from "react";
import TitleCard from "@/common/titleCard/TitleCard";
import TopSideButtons from "@/common/buttons/TopSideButtons";
import ListOfNoClassDaysCard from "./components/listOfNoClassDaysCard/ListOfNoClassDaysCard";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { CirclePlus } from "lucide-react";

const btnName = (name) => {
  return (
    <p className="flex items-center gap-1 font-semibold">
      <CirclePlus size={16} strokeWidth={2.5} />
      {name}
    </p>
  );
};

// MAIN FUNCTION
const MemoedListOfNoClassDays = memo(function ListOfNoClassDays({
  activeSchoolYear,
  activeTermSem,
  selectedTermAndSem,
  isDashboard,
}) {
  const openModal = modalStore((state) => state.openModal);

  const { currentUser } = useGetCurrentUserData();

  const { isLoading, data: listOfNoClassDays } = useGetListOfNoClassDays(
    activeSchoolYear,
    selectedTermAndSem,
  );

  const onRemoveClick = (listId, title) => {
    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Remove ${title} from the list?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.NO_CLASS_DATE_DELETE,
        forDeletionData: listId,
      },
    };

    openModal(payload);
  };

  const termSem = isDashboard === true ? selectedTermAndSem : activeTermSem;
  const filteredList = listOfNoClassDays?.filter(
    (schedule) =>
      (schedule.term_sem === termSem &&
        schedule.type_of_schedule === "School Activities") ||
      schedule.type_of_schedule === "Holidays",
  );

  const noClassHeaderSection = (
    <header className="-mt-2 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="md:flex-2">
        <p className="text-lg text-secondary">List of No Class Days</p>
        <p className="text-xs font-thin">School Activities and Holidays</p>
      </div>
      <div className="md:flex-1">
        {currentUser.role === "Admin" && (
          <TopSideButtons
            btnSize={"sm"}
            btnName={btnName("Add Schedule")}
            title="Add No-Class Date"
            bodyType={MODAL_BODY_TYPES.NO_CLASS_ADD_NEW}
            size={"max-w-lg"}
          />
        )}
      </div>
    </header>
  );

  return (
    <TitleCard
      title={noClassHeaderSection}
      topMargin={`${isDashboard ? "md:-mt-4 mt-0" : "mt-2"}`}
      width={"md:flex-[1.2]"}
      subCard={true}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoading && listOfNoClassDays?.length > 0 ? (
        <ListOfNoClassDaysCard
          listData={filteredList}
          onRemoveClick={onRemoveClick}
          currentUser={currentUser}
        />
      ) : (
        <NoRecordsFound>No Records Found.</NoRecordsFound>
      )}
    </TitleCard>
  );
});

export default MemoedListOfNoClassDays;
