import { format, parseISO } from "date-fns";
import DeleteSoftwareBtn from "./components/buttons/DeleteSoftwareBtn";
import EditSoftwareDetailsBtn from "./components/buttons/EditSoftwareDetailsBtn";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import TopSideButtons from "@/common/buttons/TopSideButtons";
import TitleCard from "@/common/titleCard/TitleCard";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { useGetListOfSoftwares } from "@/hooks/softwares.hook";
import { useSearchParams } from "react-router-dom";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { useCallback } from "react";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { PackagePlus } from "lucide-react";

const tableTdClass = "text-base px-2 py-0 text-left";

const tableHeaderClass =
  "bg-accent text-grey-100 text-lg p-2 font-semibold text-left ";

export default function Software() {
  const { currentUser, activeSchoolYear } = useGetCurrentUserData();

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
  });

  const laboratory = searchParams.get("q") || "";

  const extraObject = { school_year: activeSchoolYear, laboratory };

  const {
    isLoading,
    data: listOfSoftwares,
    error,
    isError,
  } = useGetListOfSoftwares(activeSchoolYear, laboratory);

  isError && ToastNotification("error", error?.response.data);

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const btnName = (
    <p className="flex items-center gap-2">
      <PackagePlus size={20} strokeWidth={2} />
      Add Software
    </p>
  );

  const headerSection = (
    <header className="flex items-start justify-between">
      <div className="-mt-2">
        <p className="mb-1 text-sm font-normal text-secondary">Laboratory</p>
        <SelectLaboratory
          laboratory={laboratory}
          onLaboratoryChange={onLaboratoryChange}
          currentUser={currentUser}
        />
      </div>
      <div>
        {/* TODO DISABLED WHEN THE LAB LOCATION IS NOT A COMPUTING LAB */}
        <TopSideButtons
          title="Add Software"
          btnName={btnName}
          bodyType={MODAL_BODY_TYPES.SOFTWARE_ADD}
          extraObject={extraObject}
        />
      </div>
    </header>
  );

  const whatToDisplay =
    !isLoading && listOfSoftwares?.length > 0 ? "data" : null;

  //  RENDER SECTION
  return (
    <TitleCard topMargin="-mt-2" title={headerSection}>
      {!whatToDisplay && (
        <NoRecordsFound>No Data to be displayed</NoRecordsFound>
      )}
      {whatToDisplay === "data" && (
        <>
          {/* <header className='mb-3'>
            <h2 className='text-primary text-xl font-semibold'>
              List of Softwares for: {activeSchoolYear}
            </h2>
          </header> */}
          <div className="overflow-hidden">
            <table className="table-zebra table-xs table text-sm">
              <thead>
                <tr>
                  <th className={`${tableHeaderClass} rounded-tl-xl`}>
                    Software Name
                  </th>
                  <th className={tableHeaderClass}>
                    Subscription/Expiration Date{" "}
                  </th>
                  <th className={`${tableHeaderClass} rounded-tr-xl`}>
                    Options
                  </th>
                </tr>
              </thead>
              <tbody>
                {listOfSoftwares?.map((software) => {
                  return (
                    <tr key={software.id}>
                      <td className={`${tableTdClass}`}>{software.title}</td>
                      <td className={tableTdClass}>
                        {format(
                          parseISO(software.subs_expiration),
                          "MMM dd, yyyy",
                        )}
                      </td>

                      <td className={tableTdClass}>
                        <EditSoftwareDetailsBtn softwareOBJ={software} />
                        <DeleteSoftwareBtn softwareId={software.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </TitleCard>
  );
}
