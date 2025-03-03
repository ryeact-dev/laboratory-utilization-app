import TopSideButtons from "@/common/buttons/TopSideButtons";
import Tabbing from "@/common/tabbing/Tabbing";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Button } from "@/common/ui/button";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { SCIENCE_LAB_LIST } from "@/globals/initialValues";
import { modalStore } from "@/store";
import { CircleCheck, CirclePlus, Send } from "lucide-react";

const btnName = (
  <p className="flex items-center gap-2">
    <CirclePlus size={18} /> Create Stock Card
  </p>
);

export default function StockCardTabs({
  tab,
  setSearchParams,
  schoolyear,
  laboratory,
  forAcknowledgementCount,
  currentUser,
  selectedMISMIds,
  category,
  listOfMISM,
  submissionDate,
}) {
  const openModal = modalStore((state) => state.openModal);

  const tabData = [
    {
      title: "Office Supplies",
      data: "",
      badgeColor: "bg-transparent",
      indicator: false,
    },
    {
      title: "Laboratory Supplies",
      data: "",
      badgeColor: "bg-transparent",
      indicator: false,
    },
    {
      title: "MISM List",
      data: forAcknowledgementCount,
      indicator: true,
      badgeColor: forAcknowledgementCount > 0 ? "bg-primary" : "bg-transparent",
    },
  ];

  const onTabChange = (tabValue) => {
    const isAdmin = currentUser.role === "Admin";

    const laboratoryQuery = isAdmin
      ? "All Laboratories"
      : currentUser.laboratory[0];

    const officeQuery = isAdmin ? "All Offices" : currentUser.office;

    const query = Number(tabValue) === 1 ? officeQuery : laboratoryQuery;

    setSearchParams((prev) => {
      prev.set("q", query);
      prev.set("tab", tabValue);
      prev.set("page", 1);
      return prev;
    });
  };

  const onSubmitMISM = () => {
    const extraObject = {
      school_year: schoolyear,
      laboratory_name: laboratory,
      listOfMISM,
    };

    const payload = {
      title: "Submit MISM",
      bodyType: MODAL_BODY_TYPES.STOCK_CARD_MISM_SUBMIT,
      extraObject,
      size: "max-w-sm",
    };

    openModal(payload);
  };

  const onAcknowledgeMISM = () => {
    if (selectedMISMIds.length === 0) {
      return ToastNotification(
        "error",
        "Please select atleast one MISM to acknowledge",
      );
    }

    const payload = {
      title: "Sumbit MISM",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Acknowledge selected MISMs?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.STOCK_CARD_MISM_ACKNOWLEDGE,
        forUpdatingData: { selectedMISMIds },
      },
      size: "max-w-sm",
    };

    openModal(payload);
  };

  const isOffice = tab === "1" ? true : false;
  const isCurrentUserLabIsScienceLab = SCIENCE_LAB_LIST.includes(laboratory);

  const laboratoryName =
    isOffice && isCurrentUserLabIsScienceLab
      ? "Science Lab Office"
      : laboratory;

  const modalData = {
    isOffice,
    laboratory: laboratoryName,
    submissionDate,
  };

  return (
    <div className="relative -mt-6 flex items-center justify-between">
      <div>
        <Tabbing tab={tab} tabData={tabData} onTabChange={onTabChange} />
      </div>
      <div className="flex items-center gap-2">
        {tab !== "3" && (
          <TopSideButtons
            btnName={btnName}
            title={"Create Stock Card"}
            size={"max-w-lg"}
            extraObject={modalData}
            bodyType={MODAL_BODY_TYPES.STOCK_CARD_ADD_NEW}
            disabled={
              laboratory?.trim() === "" ||
              laboratory?.trim() === "All Laboratories" ||
              laboratory?.trim() === "All Offices"
            }
          />
        )}

        {tab === "3" && (
          <>
            {currentUser.role === "Admin" && category === 1 && (
              <Button
                className="bg-yellow-200 text-secondary-foreground hover:bg-yellow-200/90"
                onClick={onAcknowledgeMISM}
                disabled={selectedMISMIds.length === 0}
              >
                <CircleCheck size={18} /> Acknowledge
              </Button>
            )}
            {(currentUser.role === "Admin" ||
              currentUser.role === "Custodian") && (
              <Button
                className="font-semibold"
                variant="secondary"
                onClick={onSubmitMISM}
                disabled={
                  laboratory?.trim() === "" ||
                  laboratory?.trim() === "All Laboratories"
                }
              >
                <Send size={18} /> Submit MISM
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
