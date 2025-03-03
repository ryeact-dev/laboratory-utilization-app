import { format } from 'date-fns';

export default function TermsAndConditions({
  borrowerEsign,
  borrowerName,
  borrowerSlipData,
}) {
  return (
    <>
      <article className='px-2 border-2 border-x-0 py-4'>
        <h2 className='uppercase font-bold'>Terms and Conditions</h2>
        <h2 className='flex'>
          1.
          <p className='ml-2'>
            Reservation must be placed three (3) days before the scheduled
            activity; where applicable. Approval shall be on a “FIRST COME FIRST
            SERVED”.
          </p>
        </h2>
        <h2 className='flex'>
          2.
          <p className='ml-2'>
            The borrowed equipment and/or materials & supplies shall be used
            only within the premises of the school.
          </p>
        </h2>
        <h2 className='flex'>
          3.
          <p className='ml-2'>
            The item/s borrowed are presumed to be in working condition at the
            time of release, and expected to be returned of the same condition.
          </p>
        </h2>
        <h2 className='flex'>
          4.
          <p className='ml-2'>
            The faculty/borrower shall be automatically liable over the borrowed
            item/s and assumes the following responsibilities:
          </p>
        </h2>
        <div className='ml-6'>
          <p>
            4.1
            <span className='ml-2'>
              Caring and handling of the equipment/materials/supplies;
            </span>
          </p>
          <p>
            4.2
            <span className='ml-2'>
              Returning the borrowed item/s before the due date and/or after
              use;
            </span>
          </p>
          <p>
            4.3
            <span className='ml-2'>
              Doing the AFTER-CARE before returning; and
            </span>
          </p>
          <p>
            4.4
            <span className='ml-2'>
              Replacing or paying for damaged or lost item/s
            </span>
          </p>
        </div>
        <h2 className='flex'>
          5.
          <p className='ml-2'>
            An “Incident Report” shall be made immediately for any loss/damage
            done to the borrowed equipment/materials.
          </p>
        </h2>
        <h2 className='flex'>
          6.
          <p className='ml-2'>
            No student shall be allowed to withdraw and/or return the
            equipment/materials borrowed without the presence of the subject
            teacher.
          </p>
        </h2>
      </article>

      <article className='px-10 py-1'>
        <h2 className='font-bold text-lg'>
          I HEREBY AGREE WITH THE TERMS AND CONDITIONS STATE ABOVE.
        </h2>

        <div className='flex items-end justify-around mt-8'>
          <div className='flex flex-col items-center'>
            <img
              src={import.meta.env.VITE_LOCAL_BASE_URL + borrowerEsign}
              className='w-20 -mb-2 mt-2'
            />
            <p>{`${borrowerName} / ${format(
              new Date(borrowerSlipData.released_date),
              'yyyy-MM-dd'
            )}`}</p>
            <p className='border-b w-full -mt-1'></p>
            <p>Borrower Name & Signature/Date</p>
          </div>
          <div className='flex flex-col items-center'>
            <img
              src={
                import.meta.env.VITE_LOCAL_BASE_URL +
                borrowerSlipData.instructor_esign
              }
              className='w-20 -mb-2 mt-2'
            />
            <p>{`${borrowerSlipData.instructor} / ${format(
              new Date(borrowerSlipData.released_date),
              'yyyy-MM-dd'
            )}`}</p>
            <p className='border-b w-full -mt-1'></p>
            <p>Subject Teacher Name & Signature/Date</p>
          </div>
        </div>
      </article>
    </>
  );
}
