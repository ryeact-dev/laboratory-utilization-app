import { useGetReservationSchedules } from "@/hooks/schedules.hook";
import TitleCard from "@/common/titleCard/TitleCard";
import Reservations from "./components/Reservations";
import { useGetCurrentUserData } from "@/hooks/users.hook";

// TODO ONLY FETCH THE CURRENT USER LABORATORY IF NOT AN ADMIN
function ListOfReservations() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const { isLoading, data: listOfReservations } = useGetReservationSchedules(
    activeSchoolYear,
    activeTermSem,
    currentUser,
  );

  const headerSection = (
    <article className="justify-between md:flex">
      <div className="leading-6 md:text-left">
        <p>{activeTermSem}</p>
        <p>{activeSchoolYear}</p>
      </div>
      <div></div>
    </article>
  );

  const whatToDisplay =
    !isLoading && listOfReservations?.length > 0 ? "data" : null;

  // TODO REVISED THE RESERVATIONS LIST COMPONENT
  // TODO IT WILL DISPLAY ALL RESERVATIONS WITH STATUS OF THE REQUEST. (PENDING, APPROVED, DISAPPROVED)
  // TODO A DETAIL BUTTON THAT WILL SHOW A MODAL OF STEPS COMPONENT TO DISPLAY WHERE OR WHOM THE REQUEST IS PENDING
  // RENDER SECTION
  return (
    <TitleCard topMargin="-mt-2" minWidth="min-w-max">
      {/* {whatToDisplay === null && (
        <p className='text-center font-medium'>No Data to be isplayed</p>
      )}
      {whatToDisplay === 'data' && (
        <div className='w-full -mt-3 '>
          <h2 className='text-xl text-white font-medium my-2 p-3 rounded-lg bg-primary'>
            Reservation Class
          </h2>
          <Reservations reservationData={listOfReservations} />
        </div>
      )} */}
      <h2>Coming Soon</h2>
    </TitleCard>
  );
}

export default ListOfReservations;
