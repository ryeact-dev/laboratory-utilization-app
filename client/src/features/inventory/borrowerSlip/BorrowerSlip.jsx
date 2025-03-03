import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectLaboratory from "@/common/select/SelectLaboratory";

import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";

import BorrowerSlipLaboratorySubjects from "./components/borrowerSlipLaboratorySubjects/BorrowerSlipLaboratorySubjects";
import BorrowerSlipNonLaboratorySubjects from "./components/borrowerSlipNonLaboratorySubjects/BorrowerSlipLaboratorySubjects";
import { modalStore } from "@/store";
import { LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP } from "@/globals/initialValues";
import { useCallback } from "react";
import { Button } from "@/common/ui/button";
import SelectItems from "@/common/select/SelectIems";
import { CirclePlus } from "lucide-react";

const BORROWER_SLIP_STATUS = [
  { label: "All", value: "all" },
  { label: "For Release", value: "for_release" },
  { label: "For Return", value: "for_return" },
  { label: "Returned", value: "returned" },
];

export default function BorrowerSlip({
  currentUser,
  activeTermSem,
  activeSchoolYear,
}) {
  const openModal = modalStore((state) => state.openModal);

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    termsem: activeTermSem,
    tab: "1",
    page: "1",
    q: initialSelectedLaboratory,
    status: "",
  });

  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;
  const tab = searchParams.get("tab") || 1;
  const page = searchParams.get("page") || 1;
  const laboratory = searchParams.get("q") || "";
  const bSlipStatus = searchParams.get("status") || "";

  // const btnName = (
  //   <p className='flex items-center gap-2'>
  //     <LuCirclePlus size={18} /> Create Borrower Slip
  //   </p>
  // );

  const isLaboratorySubjects = Number(tab) === 1 ? true : false;
  const selectedLaboratory = Number(tab) === 1 ? laboratory : null;

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const onStatusChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("status", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const onCreateBorrowerSlip = () => {
    const forAddingData = {
      laboratory,
      term_sem: selectedTermAndSem,
      schoolYear: activeSchoolYear,
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Proceed creating borrower slip?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.BORROWER_SLIP_CREATE,
        forAddingData,
      },
    };

    openModal(payload);
  };

  const isUserAllowedForBorrowerSlip =
    LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP.slice(1, 5).includes(
      currentUser.role,
    );

  const headerSection = (
    <div className="-mt-6 mb-6 flex items-center justify-between gap-3">
      <div className="-mt-2 flex items-center gap-2">
        <div>
          <p className="mb-1 text-sm font-normal text-secondary">Laboratory</p>
          <SelectLaboratory
            laboratory={laboratory}
            onLaboratoryChange={onLaboratoryChange}
            currentUser={currentUser}
            additionalItems={["All Laboratories"]}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-normal text-secondary">Status</p>
          <SelectItems
            dataArray={BORROWER_SLIP_STATUS}
            onValueChange={onStatusChange}
            value={bSlipStatus}
            placeholder={"Select Status"}
          />
        </div>
      </div>

      <div>
        {isUserAllowedForBorrowerSlip && (
          <Button variant="secondary" onClick={onCreateBorrowerSlip}>
            <CirclePlus size={18} /> Create Borrower Slip
          </Button>
        )}
      </div>
    </div>
  );

  // RENDER SECTION
  return (
    <TitleCard
      topMargin="-mt-2"
      width="lg:min-w-[1000px] xl:min-w-[1200px]"
      minHeight="min-h-min"
    >
      {headerSection}
      {Number(tab) === 1 ? (
        <BorrowerSlipLaboratorySubjects
          isLaboratorySubjects={isLaboratorySubjects}
          selectedLaboratory={laboratory}
          selectedTermAndSem={selectedTermAndSem}
          currentUser={currentUser}
          bSlipStatus={bSlipStatus}
        />
      ) : (
        <BorrowerSlipNonLaboratorySubjects />
      )}
    </TitleCard>
  );
}
