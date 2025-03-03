import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  useGetListOfSchoolYear,
  useSetActiveSchoolYear,
} from "@/hooks/termSemSchoolYear.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { format } from "date-fns";
import { Card, CardContent } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Calendar } from "lucide-react";

// MAIN FUNCTION
function SchoolYearTable({ currentUser, openModal }) {
  const setActiveSchoolYearMutation = useSetActiveSchoolYear();

  const { isLoading, data: listOfSchoolYear } = useGetListOfSchoolYear();

  const onSetActiveSchoolYear = (schoolYearId, value) => {
    if (value) {
      ToastNotification("error", "This School Year is already active");
      return;
    }

    const forUpdatingData = {
      schoolYearId,
    };

    setActiveSchoolYearMutation.mutate(forUpdatingData);
  };

  const openSetDatesModal = (schoolYear) => {
    const title = (
      <>
        <p>{schoolYear.school_year} </p>
        <p className="text-lg">Starting and Ending Dates </p>
      </>
    );

    const extraObject = {
      schoolYearId: schoolYear.id,
      selectedSchoolYear: schoolYear.school_year,
      currentStartingDate: schoolYear.starting_date,
      currentEndingDate: schoolYear.ending_date,
      isSchoolYear: true,
    };

    const payload = {
      title,
      bodyType: MODAL_BODY_TYPES.TERM_SEM_SET_DATES,
      extraObject,
      size: "max-w-lg",
    };

    openModal(payload);
  };

  const onDeleteSchoolYear = (schoolYearId, schoolYear, syIsActive) => {
    const forDeletionData = {
      schoolYearId,
      schoolYear,
    };

    if (syIsActive) {
      ToastNotification("error", "Active School Year cannot be remove");
      return;
    } else {
      const payload = {
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to remove ${schoolYear}?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.SCHOOL_YEAR_DELETE,
          forDeletionData,
        },
      };

      openModal(payload);
    }
  };

  // RENDER SECTION
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoading && listOfSchoolYear ? (
        <article className="bg-grey-100 -mb-4 h-full">
          <div className="-mt-2">
            {listOfSchoolYear?.map((sy, index) => (
              <Card
                key={index}
                className={`mb-3 items-center ${
                  sy.sy_is_active ? "bg-background/40" : ""
                }`}
              >
                <CardContent className="flex items-center justify-between py-2">
                  <div className="flex-1 items-center gap-4 md:flex">
                    <h2
                      className={`card-title text-center text-base font-semibold`}
                    >
                      {sy.school_year}
                    </h2>
                  </div>
                  {currentUser.role === "Admin" && (
                    <Button
                      size="xs"
                      type="button"
                      onClick={() =>
                        onSetActiveSchoolYear(sy.id, sy.sy_is_active)
                      }
                      className={`flex w-24 items-center justify-center border p-0 font-normal hover:cursor-pointer ${
                        sy.sy_is_active
                          ? "border-green-600 bg-green-600 text-white hover:bg-green-600/50"
                          : "bg-gray-200/10 font-thin text-gray-200 hover:bg-gray-200/30"
                      } `}
                    >
                      {sy.sy_is_active ? "Active" : "Inactive"}
                    </Button>
                  )}

                  <div
                    style={{ fontFamily: "Roboto Mono" }}
                    className={`flex flex-1 justify-end tracking-tight`}
                  >
                    <Button
                      variant={sy.sy_is_active ? "secondary" : "default"}
                      size="xs"
                      type="button"
                      onClick={() => {
                        return (
                          currentUser.role === "Admin" && openSetDatesModal(sy)
                        );
                      }}
                      className={`px-2 py-0.5`}
                    >
                      <Calendar size={14} strokeWidth={2.5} className="mr-1" />
                      {sy.starting_date
                        ? `${format(
                            new Date(sy.starting_date),
                            "MMM dd, yyyy",
                          )} to ${format(
                            new Date(sy.ending_date),
                            "MMM dd, yyyy",
                          )} `
                        : "Semestral Date Not Set"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </article>
      ) : (
        <NoRecordsFound>No Records</NoRecordsFound>
      )}
    </>
  );
}

export default SchoolYearTable;
