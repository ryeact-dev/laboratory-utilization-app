import { format } from 'date-fns';

export default function UsersSection({
  borrowerEsign,
  borrowerName,
  borrowerSlipData,
  borrowerSlipUsers,
}) {
  return (
    <>
      <article className='flex items-center justify-around border-1.5'>
        <div className='flex-1 max-w-[25%] py-1'>
          <p className='ml-4'>Requested & received by:</p>
          <div className='flex flex-col items-center px-4 w-full'>
            <img
              src={import.meta.env.VITE_LOCAL_BASE_URL + borrowerEsign}
              className='w-20 min-h-[52px] max-h-[52px] -mb-2 mt-2 object-contain object-center'
            />
            <div className='flex items-center gap-1 z-[1] -mt-1 w-full divide-x divide-solid'>
              <p className='w-[60%] h-10 flex items-center justify-center'>
                <span className='uppercase text-center leading-4'>
                  {borrowerName}
                </span>
              </p>
              <p className='w-[40%] leading-4 text-center'>
                {format(new Date(borrowerSlipData.released_date), 'yyyy-MM-dd')}
              </p>
            </div>
            <p className='border-b w-full mt-1'></p>
            <p>Name & Signature/Date</p>
          </div>
          <div className='border-t w-full h-10'>
            <p className='ml-4'>Remarks:</p>
          </div>
        </div>

        <div className='flex-1 max-w-[25%] border-2 border-y-0  py-1'>
          <p className='ml-4'>Approved & released by:</p>
          <div className='flex flex-col items-center px-4 w-full '>
            <img
              src={
                import.meta.env.VITE_LOCAL_BASE_URL +
                borrowerSlipUsers?.released_esign
              }
              className='w-20 min-h-[52px] max-h-[52px] -mb-2 mt-2 object-contain object-center'
            />
            <div className='flex items-center gap-1 z-[1] -mt-1 w-full divide-x divide-solid'>
              <p className='w-[60%] h-10 flex items-center justify-center'>
                <span className='uppercase text-center leading-4'>
                  {borrowerSlipUsers?.released_by}
                </span>
              </p>
              <p className='w-[40%] px-1 leading-4 text-center'>
                {format(new Date(borrowerSlipData.released_date), 'yyyy-MM-dd')}
              </p>
            </div>
            <p className='border-b w-full mt-1'></p>
            <p>Name & Signature/Date</p>
          </div>
          <div className='border-t w-full h-10'>
            <p className='ml-4'>Remarks:</p>
          </div>
        </div>

        <div className='flex-1 max-w-[25%] py-1'>
          <p className='ml-4'>Returned by:</p>
          <div className='flex flex-col items-center px-4 w-full'>
            <img
              src={import.meta.env.VITE_LOCAL_BASE_URL + borrowerEsign}
              className='w-20 min-h-[52px] max-h-[52px] -mb-2 mt-2 object-contain object-center'
            />
            <div className='flex items-center gap-1 z-[1] -mt-1 w-full divide-x divide-solid'>
              <p className='w-[60%] h-10 flex items-center justify-center'>
                <span className='uppercase text-center leading-4'>
                  {borrowerName}
                </span>
              </p>
              <p className='w-[40%] leading-4 text-center'>
                {format(new Date(borrowerSlipData.returned_date), 'yyyy-MM-dd')}
              </p>
            </div>
            <p className='border-b w-full mt-1'></p>
            <p>Name & Signature/Date</p>
          </div>
          <div className='border-t w-full h-10'>
            <p className='ml-4'>Remarks:</p>
          </div>
        </div>

        <div className='flex-1 max-w-[25%] border-2 border-y-0 border-r-0 py-1'>
          <p className='ml-4'>Checked by:</p>
          <div className='flex flex-col items-center px-4 w-full'>
            <img
              src={
                import.meta.env.VITE_LOCAL_BASE_URL +
                borrowerSlipUsers?.checked_esign
              }
              className='w-20 min-h-[52px] max-h-[52px] -mb-2 mt-2 object-contain object-center'
            />
            <div className='flex items-center gap-1 z-[1] -mt-1 w-full divide-x divide-solid'>
              <p className='w-[60%] h-10 flex items-center justify-center'>
                <span className='uppercase text-center leading-4'>
                  {borrowerSlipUsers?.checked_by}
                </span>
              </p>
              <p className='w-[40%] leading-4 text-center'>
                {format(new Date(borrowerSlipData.returned_date), 'yyyy-MM-dd')}
              </p>
            </div>
            <p className='border-b w-full mt-1'></p>
            <p>Name & Signature/Date</p>
          </div>
          <div className='border-t w-full h-10'>
            <p className='ml-4'>Remarks:</p>
          </div>
        </div>
      </article>
    </>
  );
}
