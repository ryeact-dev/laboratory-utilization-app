import { useEffect, useState, lazy } from "react";
import { format } from "date-fns";
import TitleCard from "@/common/titleCard/TitleCard";
import { calculateLabHours, lineChartData } from "@/lib/helpers/lineCharData";
import { getRelativeWeekNumber } from "@/lib/helpers/dateTime";
import { useGetListOfNoClassDays } from "@/hooks/noClassDays.hook";
import { LineDottedChart } from "@/common/charts/LineDottedChart";
import SelectItems from "@/common/select/SelectIems";
import { CircleUserRound, Clock, Presentation, TrendingUp } from "lucide-react";
import { Badge } from "@/common/ui/badge";

const DataCard = lazy(() => import("./components/DataCard"));

const INITIAL_SUBJECT = {
  label: "Select Subject",
  value: "",
  instructor: "",
  startTime: "",
  endTime: "",
};

export default function SubjectUtilization({
  laboratory,
  utilizationData,
  selectedTermAndSem,
  activeSchoolYear,
  subjects,
  activatedTermSem,
}) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chartData, setChartData] = useState(null);

  const { data: listOfNoClassDays } = useGetListOfNoClassDays(
    activeSchoolYear,
    selectedTermAndSem,
  );

  const classNumberOfWeeks = getRelativeWeekNumber(
    activatedTermSem?.starting_date,
    activatedTermSem?.ending_date,
  );

  const filteredSubject = utilizationData?.filter(
    (subject) =>
      subject.subject_id === selectedSubject?.value && subject.is_regular_class,
  );

  const labHours = calculateLabHours(
    activatedTermSem?.starting_date,
    activatedTermSem?.ending_date,
    listOfNoClassDays,
    filteredSubject[0],
  );

  let labels = Array(Number(classNumberOfWeeks))
    .fill("")
    .map((_, index) => `Week ${index + 1}`);

  const initialData = chartData
    ? chartData?.weekly_usage.map((usage) => usage["Usage Hr"])
    : labels.map(() => {
        return parseFloat((Math.random() * 11).toFixed(2));
      });

  const onSubjectChange = (value) => {
    if (!value.trim() || utilizationData.length === 0) return;

    setChartData(
      lineChartData(
        utilizationData,
        value,
        activatedTermSem?.starting_date,
        activatedTermSem?.ending_date,
        listOfNoClassDays,
      ),
    );

    const filterSubjectTruId = subjects.filter(
      (subject) => subject.value === value,
    )[0];

    setSelectedSubject(filterSubjectTruId);
  };

  const headerSection = (
    <div className="-mt-2 flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
      <div className="flex-2">
        <p className="text-lg text-secondary"> Subject utilizations</p>
        <p className="text-xs font-thin">
          Data comparison for every subject by term
        </p>
      </div>
      <SelectItems
        dataArray={subjects}
        onValueChange={onSubjectChange}
        value={selectedSubject?.value}
        placeholder={"Select Subject"}
      />
    </div>
  );

  useEffect(() => {
    setSelectedSubject(INITIAL_SUBJECT);
    setChartData(null);
  }, [laboratory, selectedTermAndSem]);

  const chartTitle = (
    <h1 className="flex items-center justify-center gap-6 font-normal">
      <p className="flex items-center gap-2 text-gray-300">
        <TrendingUp strokeWidth={2} size={24} className="text-primary" />
        Accumulated subject utilization hours
      </p>
      <p className="flex items-center gap-2 text-gray-300">
        <TrendingUp strokeWidth={2} size={24} className="text-secondary" />
        Accumulated subject scheduled hours
      </p>
    </h1>
  );

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width={" lg:w-[60%] xl:flex-[2]"}
      subCard={true}
    >
      {chartData ? (
        <>
          <div className="mb-4 flex flex-col items-center justify-between rounded-lg border border-secondary px-4 py-2 font-medium text-secondary md:flex-row">
            <div className="flex items-center gap-2">
              <Presentation strokeWidth={2} size={20} />
              <p>{selectedSubject?.label}</p>
            </div>

            <div className="flex items-center gap-2">
              <CircleUserRound strokeWidth={2} size={20} />
              <p>{selectedSubject?.instructor}</p>
            </div>

            <div className="flex items-center gap-2">
              <Clock strokeWidth={2} size={20} />
              <p>
                {format(new Date(selectedSubject?.startTime), "hh:mma")} -{" "}
                {format(new Date(selectedSubject?.endTime), "hh:mma")}
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-col items-center justify-between rounded-lg border border-secondary px-4 py-2 text-sm text-secondary md:flex-row">
            <div>
              <p className="mb-1 text-gray-300">
                Accumulated subject utilization hours{" "}
              </p>
              <Badge
                variant={"error"}
                className={
                  "space-x-1 border-none bg-primary px-4 py-0.5 font-medium text-white hover:!bg-primary"
                }
              >
                <Clock strokeWidth={3} size={14} />
                <p>{initialData[initialData.length - 1] || 0} Hrs</p>
              </Badge>
            </div>

            <div>
              <p className="mb-1 text-gray-300">
                Accumulated subject scheduled hours
              </p>
              <Badge
                variant={"secondary"}
                className={
                  "space-x-1 rounded-full border-none px-4 py-0.5 font-semibold hover:!bg-secondary"
                }
              >
                <Clock strokeWidth={3} size={14} />
                <p>{labHours[labHours.length - 1] || 0} Hrs</p>
              </Badge>
            </div>
          </div>
          <div className="rounded-lg bg-gray-700/20">
            <LineDottedChart
              chartTitle={chartTitle}
              chartData={chartData?.weekly_usage}
            />
          </div>
          <DataCard chartData={chartData || []} />
        </>
      ) : (
        <p className="text-center text-sm">Please select a subject.</p>
      )}
    </TitleCard>
  );
}
