import SelectLaboratory from "@/common/select/SelectLaboratory";
import TopSideButtons from "@/common/buttons/TopSideButtons";
import TitleCard from "@/common/titleCard/TitleCard";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { useSearchParams } from "react-router-dom";
import HardwareTabs from "./components/hardwareTabs/HardwareTabs";
import ListOfAllHardware from "./components/listOfAllHardware/ListOfAllHardware";
import ApproachingObsolesence from "./components/approachingObsolesence/ApproachingObsolesence";
import ForUpgrading from "./components/forUpgrading/ForUpgrading";
import {
  useGetListOfHardwares,
  useGetListOfSystemUnit,
} from "@/hooks/hardwares.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ReactToPrint from "react-to-print";
import { useCallback, useRef } from "react";
import Information from "@/common/information/Information";
import { Button } from "@/common/ui/button";
import { PackagePlus, Printer } from "lucide-react";

const tableTdClass = "text-sm px-2 py-0 text-left";

const tableHeaderClass =
  "bg-accent text-grey-100 text-lg p-2 text-left text-sm font-bold ";

const btnName = (
  <p className="flex items-center gap-2">
    <PackagePlus size={20} strokeWidth={2} />
    Add Hardware
  </p>
);

function Hardware({ currentUser, activeSchoolYear, syEndingDate }) {
  const componentToPrintRef = useRef(null);

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    q: initialSelectedLaboratory,
    tab: "1",
    propertyno: "",
    page: "1",
  });

  const laboratory = searchParams.get("q") || "";
  const tab = searchParams.get("tab") || "1";
  const propertyno = searchParams.get("propertyno");
  const page = searchParams.get("page") || 1;

  const {
    isLoading: isLoadingHardwares,
    data: listOfHardwares,
    error,
    isError,
    isPlaceholderData,
  } = useGetListOfHardwares(
    activeSchoolYear,
    laboratory,
    Number(page - 1),
    60,
    propertyno,
  );
  isError && ToastNotification("error", error?.response.data);

  const {
    isLoading: isLoadingSystemUnits,
    data: listOfSystemUnits = [],
    error: errorLoadingSystemUnits,
    isError: isErrorLoadingSystemUnits,
  } = useGetListOfSystemUnit(laboratory);
  isErrorLoadingSystemUnits &&
    ToastNotification("error", errorLoadingSystemUnits?.response.data);

  const extraObject = { school_year: activeSchoolYear, laboratory };

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const printHardwareBtn = (
    <Button
      disabled={
        tab !== "1"
          ? listOfSystemUnits?.length === 0
          : listOfHardwares?.list?.length === 0
      }
    >
      <Printer size={20} strokeWidth={2.5} />
      Print Hardware
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printHardwareBtn}
      content={() => componentToPrintRef.current}
    />
  );

  const headerSection = (
    <header className="flex items-start justify-between">
      <article className="flex space-x-3">
        <SelectLaboratory
          laboratory={laboratory}
          onLaboratoryChange={onLaboratoryChange}
          currentUser={currentUser}
          isInventory={true}
        />
        {reactToPrintBtn}
      </article>
      <article>
        {tab === "1" && (
          <TopSideButtons
            isInventory={true}
            laboratory={laboratory}
            title="Add Hardware"
            btnName={btnName}
            bodyType={MODAL_BODY_TYPES.HARDWARE_ADD}
            extraObject={extraObject}
            // size={'lg'}
          />
        )}
      </article>
    </header>
  );

  //  RENDER SECTION
  return (
    <TitleCard topMargin="-mt-2" title={headerSection}>
      <Information
        title={"Print Info"}
        message={
          "For better print result please set the ff. settings: Scaling: 80 below, Papersize: A4, Orientation: Landscape."
        }
        className={"-mt-4"}
      />
      <div className="relative mt-6">
        <div className="absolute left-0 top-0 z-10">
          <HardwareTabs
            syEndingDate={syEndingDate}
            listOfSystemUnits={listOfSystemUnits}
            tab={tab}
            setSearchParams={setSearchParams}
          />
        </div>
        {tab === "1" ? (
          <ListOfAllHardware
            componentToPrintRef={componentToPrintRef}
            isLoading={isLoadingHardwares}
            listOfHardwares={listOfHardwares}
            isPlaceholderData={isPlaceholderData}
            activeSchoolYear={activeSchoolYear}
            laboratory={laboratory}
            tableHeaderClass={tableHeaderClass}
            tableTdClass={tableTdClass}
            propertyno={propertyno}
            page={page}
            setSearchParams={setSearchParams}
            currentUser={currentUser}
          />
        ) : tab === "2" ? (
          <ApproachingObsolesence
            syEndingDate={syEndingDate}
            isLoading={isLoadingSystemUnits}
            listOfSystemUnits={listOfSystemUnits}
            tableHeaderClass={tableHeaderClass}
            tableTdClass={tableTdClass}
            laboratory={laboratory}
            componentToPrintRef={componentToPrintRef}
            currentUser={currentUser}
          />
        ) : tab === "3" ? (
          <ForUpgrading
            isLoading={isLoadingSystemUnits}
            listOfSystemUnits={listOfSystemUnits}
            tableHeaderClass={tableHeaderClass}
            tableTdClass={tableTdClass}
            laboratory={laboratory}
            componentToPrintRef={componentToPrintRef}
            currentUser={currentUser}
          />
        ) : (
          ""
        )}
      </div>
    </TitleCard>
  );
}

export default Hardware;
