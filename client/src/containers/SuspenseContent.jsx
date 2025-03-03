import LoadingSpinner from '@/common/loadingSpinner/LoadingSpinner';

function SuspenseContent() {
  return (
    <div className='w-full h-screen text-gray-300 dracula:text-gray-200 bg-base-100'>
      <LoadingSpinner />
    </div>
  );
}

export default SuspenseContent;
