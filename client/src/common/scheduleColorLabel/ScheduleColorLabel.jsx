import { useGetCurrentUserData } from "@/hooks/users.hook";

function ScheduleColorLabel({ isScheduler }) {
  const { activeSchoolYear, activeTermSem } = useGetCurrentUserData();

  return (
    <section className="bg-base-200/80 -mt-2 mb-4 items-center justify-between gap-4 rounded-lg px-6 py-2 text-sm md:flex">
      <article className="flex flex-wrap justify-center gap-2 md:flex-row lg:items-start lg:gap-4">
        <div className="flex items-center gap-2">
          <p className="h-4 w-4 bg-green-500" />
          <span>Reserved Class</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="h-4 w-4 bg-primary" />
          <span>MSA1 Class</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="h-4 w-4 bg-secondary" />
          <span>MSA2 Class</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="bg-orange-medium h-4 w-4" />
          <span>Weekly Class</span>
        </div>
      </article>
      {isScheduler && (
        <article className="text-right">
          {activeTermSem} || {activeSchoolYear}
        </article>
      )}
    </section>
  );
}

export default ScheduleColorLabel;
