import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import { useEffect, useState } from "react";
import eventTemplate from "./components/EventTemplate";
import { eSign } from "@/lib/helpers/esignatures";
import { laboratoryName } from "@/lib/helpers/laboratoryName";

// SET THE WORKING DAYS :: MON - SAT
const workDays = [1, 2, 3, 4, 5, 6];

// SET THE WORKING HOURS
const workHours = {
  highlight: true,
  start: "7:00",
  end: "21:30",
};

export default function SchedulerView({
  scheduleObj,
  listOfSchedules,
  componentToPrintRef,
  laboratory,
  currentUser,
  activeSchoolYear,
  activeTermSem,
}) {
  const [display, setDisplay] = useState(
    window.innerWidth < 500 ? "Day" : "WorkWeek",
  );

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 500) {
        setDisplay("Day");
      } else {
        setDisplay("WorkWeek");
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Customizing the cell colors
  const onEventRendered = (args) => {
    applyCategoryColor(args, scheduleObj.current.currentView);
  };

  const applyCategoryColor = (args, currentView) => {
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) {
      return;
    }
    if (currentView === "Agenda") {
      args.element.firstChild.style.borderLeftColor = categoryColor;
      args.element.firstChild.style.color = "#03071E";
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  };

  // RENDER SECTION
  return (
    <article className="-mt-3" ref={componentToPrintRef}>
      <>
        <div className="forPrint text-grey-100 mb-4 mt-6 text-center uppercase">
          <h1 className="text-5xl font-bold">Laboratory Management Office</h1>
          <h2 className="my-0.5 text-4xl font-bold">
            {laboratoryName(laboratory)} - {laboratory}
          </h2>
          <p className="text-4xl font-semibold">
            {`${activeTermSem} , ${activeSchoolYear}`}
          </p>
        </div>
        <ScheduleComponent
          cssClass="event-template"
          height="1132px"
          ref={scheduleObj}
          selectedDate={new Date()}
          workHours={workHours}
          startHour="7:00"
          endHour="21:30"
          firstDayOfWeek={1}
          eventSettings={{
            dataSource: listOfSchedules,
          }}
          readonly={true}
          eventRendered={onEventRendered}
          enablePersistence={true}
        >
          <ViewsDirective>
            {display === "Day" ? (
              <ViewDirective
                enableLazyLoading={true}
                option="Day"
                eventTemplate={(props) =>
                  eventTemplate({ ...props, scheduleObj: scheduleObj })
                }
                isSelected
                workDays={workDays}
              />
            ) : (
              ["WorkWeek", "Week"].map((item) => (
                <ViewDirective
                  enableLazyLoading={true}
                  key={item}
                  option={item}
                  isSelected={item === display ? true : false}
                  workDays={workDays}
                  eventTemplate={(props) =>
                    eventTemplate({ ...props, scheduleObj: scheduleObj })
                  }
                />
              ))
            )}
          </ViewsDirective>
          <Inject services={[Week, WorkWeek, Day]} />
        </ScheduleComponent>
      </>
      <footer className="forPrint">
        <div className="mt-8 flex items-start px-8 text-2xl">
          <div className="flex w-full flex-1 flex-col justify-end">
            <p>Prepared by:</p>
            <div className="ml-32">
              {eSign(currentUser.fullName) === null ? (
                <p className="h-14"></p>
              ) : (
                <img
                  src={eSign(currentUser.fullName)}
                  className="w-26 h-16 object-contain object-bottom"
                  alt="esign"
                />
              )}
              <h2 className="-mb-1 mt-2 font-bold uppercase">
                {currentUser.fullName}
              </h2>
              <p>Laboratory Custodian</p>
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col justify-end">
            <p>Verified by:</p>
            <div className="ml-28">
              <img
                src={eSign("Arnel Ang")}
                className="w-26 h-16 object-contain object-bottom"
                alt="esign"
              />
              <h2 className="-mb-1 mt-2 font-bold uppercase">Arnel Ang</h2>
              <p>LMO - Supervisor</p>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-end">
            <p>Noted by:</p>
            <div className="ml-28">
              <div className="w-26 h-16"></div>
              {/* <img
                src={eSign("Arnel Ang")}
                className="w-26 h-16 object-contain object-bottom"
                alt="esign"
              /> */}
              <h2 className="-mb-1 mt-2 font-bold uppercase">
                Gina Fe G. Israel
              </h2>
              <p>Dean of College</p>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
