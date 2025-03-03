import { getProgramHeads } from '@/lib/helpers/programHeads';
import { format } from 'date-fns';
import React from 'react';

export default function HeaderSection({ borrowerSlipData }) {
  return (
    <>
      <article className='flex items-start border border-x-0 border-t-0'>
        <div className='flex-[2] px-1'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            Date of Filing:
          </p>
          <p>{format(new Date(borrowerSlipData.created_at), 'MMM dd, yyyy')}</p>
        </div>
        <div className='flex-[2] px-1 border border-y-0'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            Course:
          </p>
          <p>{getProgramHeads(borrowerSlipData.program, 'e')?.course}</p>
        </div>
        <div className='flex-[2] px-1 border border-y-0 border-l-0'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            Subject:
          </p>
          <p>{borrowerSlipData.title}</p>
        </div>
        <div className='flex-1 px-1'>
          <p className='text-sm italic text-black font-semibold -mb-1'>Code:</p>
          <p>{borrowerSlipData.code}</p>
        </div>
      </article>
      <article className='flex items-start border border-x-0 border-t-0'>
        <div className='flex-1 px-1'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            Name of Teacher:
          </p>
          <p>{borrowerSlipData.instructor}</p>
        </div>
        <div className='flex-1 px-1 border border-y-0 border-r-0'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            Name of Borrower:
          </p>
          <p>
            {borrowerSlipData.full_name === 'Dummy Student'
              ? borrowerSlipData.instructor
              : borrowerSlipData.full_name}
          </p>
        </div>
      </article>
      <article className='flex items-start border border-x-0 border-t-0'>
        <div className='flex-1 px-1'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            College/Office:
          </p>
          <p>{borrowerSlipData.college_office}</p>
        </div>
        <div className='flex-1 px-1 border border-y-0 border-r-0'>
          <p className='text-sm italic text-black font-semibold -mb-1'>
            Schedule/Date of Use:
          </p>
          <p>
            {format(
              new Date(borrowerSlipData.schedule_date_of_use),
              'MMM dd, yyyy'
            )}
          </p>
        </div>
      </article>
    </>
  );
}
