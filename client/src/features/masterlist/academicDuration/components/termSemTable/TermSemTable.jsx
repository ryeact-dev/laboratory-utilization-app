import { format } from "date-fns";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  useGetListOfTermSem,
  useSetActiveTermSem,
} from "@/hooks/termSemSchoolYear.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { Card, CardContent } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Calendar } from "lucide-react";

const TERM_LIST = [
  "1st Term - 1st Sem",
  "1st Term - 2nd Sem",
  "2nd Term - 1st Sem",
  "2nd Term - 2nd Sem",
  "Summer",
];

// MAIN FUNCTION
export default function TermSemTable({
  currentUser,
  openModal,
  activeSchoolYear,
}) {
  const setActiveTermSemMutation = useSetActiveTermSem();

  const { isLoading, data: listOfTermSem } = useGetListOfTermSem();

  const onSetActiveTermSem = (termSemId, whatTermSem, value) => {
    if (value) {
      ToastNotification("error", "This Term and Sem is already active");
      return;
    }

    const forUpdatingData = {
      termSemId,
      whatTermSem,
    };

    setActiveTermSemMutation.mutate(forUpdatingData);
  };

  const openSetDatesModal = (termSemInfo, index) => {
    const title = (
      <>
        <p>{TERM_LIST[index]} </p>
        <p className="text-lg">Starting and Ending Dates </p>
      </>
    );

    const extraObject = {
      termSemId: termSemInfo?.id || null,
      whatTermSem: termSemInfo?.term_sem || TERM_LIST[index],
      currentEndingDate: termSemInfo?.ending_date || new Date(),
      currentStartingDate: termSemInfo?.starting_date || new Date(),
      isSchoolYear: false,
    };

    const payload = {
      title,
      bodyType: MODAL_BODY_TYPES.TERM_SEM_SET_DATES,
      extraObject,
      size: "max-w-lg",
    };

    openModal(payload);
  };

  // RENDER SECTION
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : !isLoading && listOfTermSem ? (
        <article className="bg-grey-100 -mb-4 h-full">
          <div className="-mt-2">
            {/* {listOfTermSem?.map((termSem) => {
              return (
                <div
                  key={termSem.id}
                  className={`card card-side mb-3 items-center justify-between overflow-hidden px-4 text-neutral shadow-sm transition duration-500 ease-in-out md:flex lg:rounded-lg xl:rounded-full ${
                    termSem.termsem_is_active ? "bg-base-200" : ""
                  }`}
                >
                  <div className="card-body w-full items-center justify-between px-1 py-2 md:flex-row">
                    <div className="flex-1 items-center gap-4 md:flex">
                      <h2
                        className={`card-title text-base font-medium md:items-end`}
                      >
                        {termSem.term_sem}
                      </h2>
                    </div>
                    <div className="flex justify-center">
                      {currentUser.role === "Admin" && (
                        <button
                          type="button"
                          onClick={() =>
                            onSetActiveTermSem(
                              termSem.id,
                              termSem.term_sem,
                              termSem.termsem_is_active,
                            )
                          }
                          className={`btn btn-xs h-6 w-24 rounded-full font-medium normal-case text-white ${
                            termSem.termsem_is_active
                              ? "btn-primary"
                              : "btn-secondary"
                          } `}
                        >
                          {termSem.termsem_is_active ? "Active" : "Inactive"}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-1 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          return (
                            currentUser.role === "Admin" &&
                            openSetDatesModal(termSem)
                          );
                        }}
                        className={`badge h-6 px-3 py-2.5 text-xs text-white ${
                          termSem.termsem_is_active
                            ? "badge-primary"
                            : "badge-secondary"
                        } `}
                      >
                        <LuCalendar
                          size={14}
                          strokeWidth={2.5}
                          className="mr-1"
                        />
                        {termSem.starting_date && termSem.ending_date
                          ? `${format(
                              new Date(termSem.starting_date),
                              "MMM dd, yyyy",
                            )} to ${format(
                              new Date(termSem.ending_date),
                              "MMM dd, yyyy",
                            )} `
                          : "Class Date Not Set"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })} */}
            {TERM_LIST.map((list, index) => (
              <Card
                key={index}
                className={`mb-3 items-center ${
                  listOfTermSem[index]?.termsem_is_active
                    ? "bg-background/40"
                    : ""
                }`}
              >
                <CardContent className="flex items-center justify-between py-2">
                  <div className="flex-1 items-center gap-4 md:flex">
                    <h2
                      className={`card-title text-base font-medium md:items-end`}
                    >
                      {list}
                    </h2>
                  </div>
                  {currentUser.role === "Admin" && (
                    <Button
                      size="xs"
                      type="button"
                      onClick={() =>
                        onSetActiveTermSem(
                          listOfTermSem[index]?.id,
                          listOfTermSem[index]?.term_sem,
                          listOfTermSem[index]?.termsem_is_active,
                        )
                      }
                      className={`flex w-24 items-center justify-center border p-0 font-normal hover:cursor-pointer ${
                        listOfTermSem[index]?.termsem_is_active
                          ? "border-green-600 bg-green-600 text-white hover:bg-green-600/50"
                          : "bg-gray-200/10 font-thin text-gray-200 hover:bg-gray-200/30"
                      } `}
                      disabled={
                        !listOfTermSem[index]?.starting_date ||
                        !listOfTermSem[index]?.ending_date
                      }
                    >
                      {listOfTermSem[index]?.termsem_is_active
                        ? "Active"
                        : "Inactive"}
                    </Button>
                  )}
                  <div
                    style={{ fontFamily: "Roboto Mono" }}
                    className={`flex flex-1 justify-end tracking-tight`}
                  >
                    <Button
                      variant={
                        listOfTermSem[index]?.termsem_is_active
                          ? "secondary"
                          : "default"
                      }
                      size="xs"
                      type="button"
                      onClick={() => {
                        return (
                          currentUser.role === "Admin" &&
                          openSetDatesModal(listOfTermSem[index], index)
                        );
                      }}
                      className={`px-2 py-0.5`}
                    >
                      <Calendar size={14} strokeWidth={2.5} className="mr-1" />
                      {listOfTermSem[index]?.school_year === activeSchoolYear
                        ? listOfTermSem[index]?.starting_date &&
                          listOfTermSem[index]?.ending_date
                          ? `${format(
                              new Date(listOfTermSem[index]?.starting_date),
                              "MMM dd, yyyy",
                            )} to ${format(
                              new Date(listOfTermSem[index]?.ending_date),
                              "MMM dd, yyyy",
                            )} `
                          : "Class Date Not Set"
                        : "Class Date Not Set"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </article>
      ) : (
        <NoRecordsFound>No Records Found.</NoRecordsFound>
      )}
    </>
  );
}
