import { Suspense, useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import routes from "@/setup/routes";
import SuspenseContent from "./SuspenseContent";
import { headerStore } from "@/store";
import { Page404 } from "@/setup/routes/routeComponents";

function PageContent() {
  const mainContentRef = useRef(null);
  const pageTitle = headerStore((state) => state.pageTitle);

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pageTitle]);

  return (
    <main
      className={`scrollbar force-overflow max-h-[calc(100vh)] min-h-[calc(95vh)] px-2 pt-8 sm:px-6`}
      id="scroll-bar-design"
      ref={mainContentRef}
    >
      <Suspense fallback={<SuspenseContent />}>
        <Routes>
          {routes.map((route, key) => {
            return (
              <Route
                key={key}
                exact={true}
                path={`${route.path}`}
                element={<route.component />}
              />
            );
          })}

          {/* Redirecting unknown url to 404 page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
      <div className="h-12">
        <p className="pt-4 text-right text-xs text-foreground/30">{`v${import.meta.env.VITE_CLIENT_VERSION}`}</p>
      </div>
    </main>
  );
}

export default PageContent;
