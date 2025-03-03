export default function SkeletonLandingPage() {
  const MENU = [
    { menu: 1 },
    {
      menu: 2,
      submenu: [
        { submenu: 1 },
        { submenu: 2 },
        { submenu: 3 },
        { submenu: 4 },
        { submenu: 5 },
        { submenu: 6 },
      ],
    },
    {
      menu: 3,
      submenu: [
        { submenu: 1 },
        { submenu: 2 },
        { submenu: 3 },
        { submenu: 4 },
        { submenu: 5 },
      ],
    },
    {
      menu: 4,
      submenu: [{ submenu: 1 }, { submenu: 2 }, { submenu: 3 }, { submenu: 4 }],
    },
  ];

  const header = (
    <article className="navbar z-10 flex justify-between bg-base-100 shadow-md">
      {/* Page title */}
      <div className="h-8 w-36 rounded-lg bg-base-200"></div>
      {/* 'Welcome' and Name */}
      <div className="h-8 w-80 rounded-lg bg-base-200"></div>
      {/* theme toogle **/}
      <div className="order-last mr-4">
        <div className="mr-4 h-8 w-36 rounded-lg bg-base-200"></div>
        <div className="h-8 w-8 rounded-lg bg-base-200"></div>
      </div>
    </article>
  );

  const pageContent = (
    <article className="-mt-8 h-full max-h-[900px] px-6 pt-8">
      <div className="card mt-6 h-full w-full items-center justify-center gap-4 bg-base-100 pb-12 pt-12 shadow-xl">
        {/* Content */}
        <div className="h-12 w-80 rounded-lg bg-base-200"></div>
        <div className="h-8 w-60 rounded-lg bg-base-200"></div>
      </div>
    </article>
  );

  const leftSidebar = (
    <section className="drawer-side bg-base-100">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <div className="mx-auto mb-2 h-12 w-48 rounded-bl-lg rounded-br-lg bg-base-200"></div>
      <ul className="menu w-60 shrink-0 p-4 text-base-content">
        {/* <!-- Sidebar content here --> */}

        {MENU.map((menu, i) => {
          return (
            <li className="" key={i}>
              {menu.submenu ? (
                <>
                  <div className="my-3 h-8 w-48 rounded-lg bg-base-200"></div>
                  {menu.submenu.map((_, k) => (
                    <div
                      key={k}
                      className="w-42 my-1.5 ml-2 h-4 rounded-lg bg-base-200"
                    ></div>
                  ))}
                </>
              ) : (
                <div className="my-3 h-8 w-48 rounded-lg bg-base-200"></div>
              )}
            </li>
          );
        })}
      </ul>

      <footer className="flex w-full items-end justify-center pb-5">
        <div className="h-8 w-10/12 rounded-lg bg-base-200"></div>
      </footer>
    </section>
  );

  return (
    <main
      className={`drawer max-h-screen animate-pulse overflow-x-auto overflow-y-hidden bg-base-300 lg:drawer-open`}
    >
      <section className="drawer-content flex flex-col">
        {/* Header */}
        {header}
        {/* Page Content */}
        {pageContent}
      </section>
      {/* Left Sidebar */}
      {/* {leftSidebar} */}
    </main>
  );
}
