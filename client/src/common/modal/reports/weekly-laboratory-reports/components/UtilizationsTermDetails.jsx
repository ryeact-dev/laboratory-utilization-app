import { useLocation } from "react-router-dom";
import { modalStore } from "@/store";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import TitleCard from "@/common/titleCard/TitleCard";

import { useGetAllUtilizations } from "@/hooks/utilizations";
import UtilizationHeader from "@/common/utilizationHeader/UtilizationHeader";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import ListOfRegularClass from "@/common/type-of-utilization-card/list-of-regular-class/ListOfRegularClass";
import ListOfReservedClass from "@/common/type-of-utilization-card/list-of-reserved-class/ListOfReservedClass";

function UtilizationsTermDetails() {
  const { laboratory, selectedTermAndSem, subjectId, activeSchoolYear } =
    useLocation().state;
  const openModal = modalStore((state) => state.openModal);

  const { isLoading: isLoadingUsage, data: listOfUsage = [] } =
    useGetAllUtilizations(
      laboratory,
      activeSchoolYear,
      selectedTermAndSem,
      // activeTermSem,
      subjectId, // undefined if no subjectId
      false, // true if data needs to be aggregate
    );

  const headerSection = (
    <article className="justify-between text-center md:flex">
      <div className="mb-2 leading-6 md:mb-0 md:text-left">
        {listOfUsage.length > 0 && (
          <UtilizationHeader headerData={listOfUsage[0]} />
        )}
      </div>
      <div className="leading-6 md:text-right">
        <p className="font-medium">{selectedTermAndSem}</p>
        <p className="font-medium">{activeSchoolYear}</p>
      </div>
    </article>
  );

  const deleteSchedule = (usageId, activeSchoolYear) => {
    const forDeletionData = {
      usageId,
      activeSchoolYear,
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to remove this utilization record?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.CANCEL_CLASS,
        forDeletionData,
      },
    };

    openModal(payload);
  };

  const whatToDisplay = !isLoadingUsage && listOfUsage ? "data" : null;

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width="md:min-w-[1200px]"
    >
      {whatToDisplay === null && (
        <NoRecordsFound>No records found.</NoRecordsFound>
      )}
      {whatToDisplay === "data" && (
        <article>
          <h2 className="bg-blue-eraser -mt-2 mb-2 rounded-lg px-2 py-1 text-lg font-medium text-white">
            Regular Class Utilizations
          </h2>
          <ListOfRegularClass
            listOfUsage={listOfUsage}
            deleteSchedule={deleteSchedule}
            activeSchoolYear={activeSchoolYear}
          />
          <h2 className="my-2 rounded-lg bg-secondary px-2 py-1 text-lg font-medium text-white">
            Make-up Class Utilizations
          </h2>
          <ListOfReservedClass
            listOfUsage={listOfUsage}
            deleteSchedule={deleteSchedule}
            activeSchoolYear={activeSchoolYear}
          />
        </article>
      )}
    </TitleCard>
  );
}

export default UtilizationsTermDetails;
