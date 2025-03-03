import { getRelativeWeekNumber } from '@/lib/helpers/dateTime';
import { eSign } from '@/lib/helpers/esignatures';
import { endOfWeek, format, sub } from 'date-fns';

const tableClass =
  'w-full text-base border-grey-100 border-t-0 h-[100px] flex flex-col items-center justify-center';

export default function LabMonitoringForPrint({
  componentToPrintRef,
  tableData,
  laboratory,
  TermSemStartingDate,
  currentUser,
  date,
}) {
  // const currentDate = new Date();
  // const lastWeek = sub(currentDate, { weeks: 1 });
  // const lastDayOfLastWeek = endOfWeek(lastWeek, { weekStartsOn: 1 });
  // const formattedDate = format(lastDayOfLastWeek, 'MMM dd, yyyy');
  const summaryHeaderClass = 'border border-grey-100 pl-2';

  return (
    <article
      ref={componentToPrintRef}
      className='font-sans text-grey-100 forPrint'
    >
      <h2 className='my-3 text-center text-2xl font-bold tracking-wide'>
        WEEKLY LABORATORY MONITORING REPORT
      </h2>
      <header
        htmlFor='weekly-summary-header'
        className='flex items-center text-lg font-semibold'
      >
        <div className='w-full'>
          <h2 className={`${summaryHeaderClass}`}>
            Department: Laboratory Management Office
          </h2>
          <h2 className={`${summaryHeaderClass} border-t-0`}>
            Laboratory: {laboratory}
          </h2>
        </div>
        <div className='w-full'>
          <h2 className={`${summaryHeaderClass}`}>
            Date: <span>{format(new Date(), 'MMM dd, yyyy')} </span>
          </h2>
          <h2 className={`${summaryHeaderClass} border-t-0`}>
            For week no.:{' '}
            <span className='pl-2'>
              {getRelativeWeekNumber(TermSemStartingDate, date) || 0}
            </span>
          </h2>
        </div>
      </header>
      <div className='flex md:flex-col flex-row w-full'>
        <div className='flex w-full'>
          <h2
            className={`${tableClass} pr-0.5 border !h-10 !text-lg flex-1 font-semibold`}
          >
            Date
          </h2>
          <h2
            className={`${tableClass} border border-l-0 !h-10 flex-1 !text-lg font-semibold`}
          >
            Remarks
          </h2>
          <h2
            className={`${tableClass} border border-l-0 !h-10 flex-1 !text-lg font-semibold`}
          >
            PC No.
          </h2>
          <h2
            className={`${tableClass} border border-l-0 !h-10 flex-1 !text-lg font-semibold`}
          >
            Description
          </h2>
          <h2
            className={`${tableClass} border border-l-0 !h-10 flex-1 !text-lg font-semibold`}
          >
            Subject
          </h2>
        </div>
        {tableData?.map(
          (
            { usage_date, network_average, other_remarks, subjectWithProblems },
            index
          ) => (
            <div
              key={index}
              className={`flex items-start justify-between w-full ${
                index % 2 === 0 ? 'bg-base-100/5' : ''
              } `}
            >
              <div className={`flex-1 ${tableClass} border border-r-0`}>
                <h2 className='text-base'>{usage_date}</h2>
              </div>
              <div className='flex-[4] flex justify-between items-center '>
                <div className={`${tableClass} border`}>
                  <p> {network_average !== 'NaN' ? 'Internet Speed' : ''} </p>
                  <p>
                    {other_remarks.length > 0
                      ? other_remarks[0].remark.indexOf('.') > -1
                        ? other_remarks[0].remark.split('.')[1]
                        : other_remarks[0].remark
                      : 'No remarks entered'}
                  </p>
                </div>
                <div className={`${tableClass} border-b`}>
                  <p>{network_average !== 'NaN' ? '-' : ''}</p>
                  <p>
                    {other_remarks.length > 0
                      ? other_remarks[0].unit_number !== ''
                        ? other_remarks[0].unit_number
                        : '\u0000'
                      : '\u0000'}
                  </p>
                </div>
                <div className={`${tableClass} border`}>
                  <p>
                    {network_average !== 'NaN' ? (
                      <span>
                        {network_average} mbps{' '}
                        <span className='italic text-sm'>
                          (avg. internet speed)
                        </span>
                      </span>
                    ) : (
                      ''
                    )}
                  </p>
                  <p>
                    {other_remarks.length > 0
                      ? other_remarks[0].problem !== ''
                        ? other_remarks[0].problem
                        : '\u0000'
                      : '\u0000'}
                  </p>
                </div>
                <div className={`${tableClass} border`}>
                  <p>{`\u0000`}</p>
                  <p>{subjectWithProblems[0] || ''}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <footer className='mt-4 flex items-start justify-center px-8'>
        <div className='w-full'>
          <p>Prepared by:</p>
          <div className='flex flex-col justify-end mt-10'>
            <img
              src={eSign(currentUser.fullName)}
              className='w-24 h-14 object-contain object-bottom'
            />
            <h2 className='text-lg font-bold -mb-1'>{currentUser.fullName}</h2>
            <p>Laboratory Custodian</p>
          </div>
        </div>
        <div className='w-full'>
          <p>Noted by:</p>
          <div className='flex flex-col justify-end mt-10'>
            <img
              src={eSign('Arnel Ang')}
              className='w-24 h-14 object-contain object-bottom'
            />
            <h2 className='text-lg font-bold -mb-1'>Arnel Ang</h2>
            <p>LMO - Supervisor</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
