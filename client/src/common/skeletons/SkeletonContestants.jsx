export default function SkeletonContestant() {
  return (
    <div class='flex gap-5'>
      <div class='relative w-72 space-y-3 overflow-hidden rounded-md bg-neutral-800 p-3 shadow before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 hover:shadow-lg'>
        <div className='animate-pulse'>
          <div class='h-40 mb-2 w-full rounded-lg bg-neutral-600'></div>
          <div class='space-y-3 flex flex-col items-center justify-center'>
            <div class='h-5 w-full rounded-full bg-neutral-600'></div>
            <div class='h-5 w-8/12 rounded-full bg-neutral-600'></div>
            <div class='h-24 w-full rounded-xl bg-neutral-600 shadow'></div>
            <div class='h-12 w-full rounded-xl bg-neutral-600'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
