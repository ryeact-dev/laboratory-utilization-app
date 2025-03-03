import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import StockCardTabs from "./components/stockCardTabs/StockCardTabs";
import { useGetPaginatedMISM } from "@/hooks/stockCardMISM.hook";
import { lazy, useState } from "react";
import { format, lastDayOfMonth, subMonths } from "date-fns";

const SubmittedMISM = lazy(
  () => import("./components/submittedMISM/SubmittedMISM"),
);

const LaboratorySupply = lazy(
  () => import("./components/laboratorySupply/LaboratorySupply"),
);

const OfficeSupply = lazy(
  () => import("./components/officeSupply/OfficeSupply"),
);

const currentDate = new Date();
const previousMonth = subMonths(currentDate, 1);
const lastDayOfTheMonth = lastDayOfMonth(previousMonth);

const formattedDate = (date) => {
  return format(new Date(date), "MMMM yyyy");
};

export default function StockCard({
  currentUser,
  activeTermSem,
  activeSchoolYear,
}) {
  const [category, setCategory] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedMISMIds, setSelectedMISMIds] = useState([]);

  const initialSelectedLaboratory =
    currentUser.laboratory.length > 0 ? currentUser.laboratory[0] : "";

  const [searchParams, setSearchParams] = useSearchParams({
    termsem: activeTermSem,
    tab: "1",
    page: "1",
    q: initialSelectedLaboratory,
    search: "",
    date: lastDayOfTheMonth,
  });

  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;
  const tab = searchParams.get("tab") || 1;
  const page = searchParams.get("page") || 1;
  const selectedLaboratory = searchParams.get("q") || "";
  const search = searchParams.get("search") || "";
  const submissionDate = searchParams.get("date") || lastDayOfTheMonth;

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  const { data, isPlaceholderData, isLoading } = useGetPaginatedMISM(
    selectedLaboratory,
    category,
    "",
    Number(page) - 1,
    50,
    activeSchoolYear,
    submissionDate,
  );

  const onCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setSelectAll(false);
    setSelectedMISMIds([]);
  };

  const onDateChange = (date) => {
    const lastDayOfTheMonth = lastDayOfMonth(date);

    setSearchParams((prev) => {
      prev.set("date", lastDayOfTheMonth);
      return prev;
    });
  };

  // RENDER SECTION
  return (
    <TitleCard
      topMargin="-mt-2"
      width="lg:min-w-[1000px] xl:min-w-[1200px]"
      minHeight="min-h-min"
    >
      <StockCardTabs
        tab={tab}
        setSearchParams={setSearchParams}
        laboratory={selectedLaboratory}
        schoolyear={activeSchoolYear}
        forAcknowledgementCount={data?.forAcknowledgementCount}
        listOfMISM={data?.listOfMISM}
        currentUser={currentUser}
        selectedMISMIds={selectedMISMIds}
        category={category}
        submissionDate={submissionDate}
      />
      {tab === "1" ? (
        <OfficeSupply
          page={page}
          tab={tab}
          search={search}
          laboratory={selectedLaboratory}
          setSearchParams={setSearchParams}
          onPageClick={onPageClick}
          currentUser={currentUser}
          submissionDate={new Date(submissionDate)}
          onDateChange={onDateChange}
          lastDayOfTheMonth={lastDayOfTheMonth}
          formattedDate={formattedDate}
        />
      ) : tab === "2" ? (
        <LaboratorySupply
          page={page}
          tab={tab}
          search={search}
          laboratory={selectedLaboratory}
          onPageClick={onPageClick}
          currentUser={currentUser}
          setSearchParams={setSearchParams}
          submissionDate={new Date(submissionDate)}
          onDateChange={onDateChange}
          lastDayOfTheMonth={lastDayOfTheMonth}
          formattedDate={formattedDate}
        />
      ) : (
        <SubmittedMISM
          page={page}
          tab={tab}
          onPageClick={onPageClick}
          data={data}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          onCategoryChange={onCategoryChange}
          category={category}
          setSelectAll={setSelectAll}
          setSelectedMISMIds={setSelectedMISMIds}
          selectedMISMIds={selectedMISMIds}
          selectAll={selectAll}
          forAcknowledgement={data?.listOfMISM}
          currentUser={currentUser}
          setSearchParams={setSearchParams}
          laboratory={selectedLaboratory}
          submissionDate={new Date(submissionDate)}
          onDateChange={onDateChange}
          lastDayOfTheMonth={lastDayOfTheMonth}
          formattedDate={formattedDate}
        />
      )}
    </TitleCard>
  );
}
