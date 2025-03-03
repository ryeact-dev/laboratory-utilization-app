import TitleCard from "@/common/titleCard/TitleCard";
import { modalStore } from "@/store";
import SchoolYearTable from "./components/schoolYearTable/SchoolYearTable";
import TermSemTable from "./components/termSemTable/TermSemTable";
import TopSideButtons from "@/common/buttons/TopSideButtons";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import MemoedListOfNoClassDays from "@/common/listOfNoClassDays/ListOfNoClassDays";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { CirclePlus } from "lucide-react";

const btnName = (name) => {
  return (
    <p className="flex items-center gap-1">
      <CirclePlus size={20} strokeWidth={2.5} />
      {name}
    </p>
  );
};

export default function AcademicDuration() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const openModal = modalStore((state) => state.openModal);

  const termHeaderSection = (
    <div className="flex-2 -mt-2">
      <p className="text-lg text-secondary">Term and Semester</p>
      <p className="text-xs font-thin">List of term and semester with dates</p>
    </div>
  );

  const syHeaderSection = (
    <header className="flex items-start justify-between">
      <div className="flex-2">
        <p className="text-lg text-secondary">School Year</p>
        <p className="text-xs font-thin">List of School Year</p>
      </div>
      {currentUser.role === "Admin" ? (
        <TopSideButtons
          title="Add School Year"
          bodyType={MODAL_BODY_TYPES.SCHOOL_YEAR_ADD_NEW}
          btnName={btnName("Add School Year")}
          btnSize={"sm"}
        />
      ) : (
        <div></div>
      )}
    </header>
  );

  return (
    <TitleCard isHeaderOnly={true} topMargin="-mt-2">
      <article className="flex flex-col items-start gap-4 xl:flex-row">
        <div className={"flex-[2]"}>
          <TitleCard
            title={termHeaderSection}
            topMargin="mt-2"
            width={"bg-grey-100"}
          >
            {/* List of Term, Semester and Summer */}
            <TermSemTable
              currentUser={currentUser}
              openModal={openModal}
              activeSchoolYear={activeSchoolYear}
            />
          </TitleCard>
          <TitleCard title={syHeaderSection} width={"bg-grey-100"}>
            {/* List of School Year */}
            <SchoolYearTable currentUser={currentUser} openModal={openModal} />
          </TitleCard>
        </div>
        <MemoedListOfNoClassDays
          activeSchoolYear={activeSchoolYear}
          activeTermSem={activeTermSem}
          isDashboard={false}
        />
      </article>
    </TitleCard>
  );
}
