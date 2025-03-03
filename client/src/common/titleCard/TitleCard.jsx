import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/common/ui/card";

import { headerStore } from "@/store";
import Subtitle from "../typography/Subtitle";
import { cn } from "@/lib/utils";

export default function TitleCard({
  title,
  children,
  topMargin,
  TopSideButtons,
  isHeaderOnly,
  width,
  minHeight,
  subCard,
}) {
  const pageTitle = headerStore((state) => state.pageTitle);

  return (
    <Card className={cn(`h-auto min-h-min`, minHeight, width, topMargin)}>
      <CardHeader>
        <CardTitle>
          {!subCard && (
            <h1 className="text-blue-eraser mb-4 text-center text-2xl font-semibold lg:hidden">
              {pageTitle}
            </h1>
          )}
          {/* Title for Card */}
          <Subtitle
            className={`${
              TopSideButtons
                ? "text-neutral inline-block tracking-wide"
                : title
                  ? "text-neutral tracking-wide"
                  : null
            } text-lg font-medium`}
          >
            {title}

            {/* Top side button, show only if present */}
            {TopSideButtons && (
              <div className="float-right inline-block">{TopSideButtons}</div>
            )}
            {title && !isHeaderOnly && <div className="divider mt-2"></div>}
          </Subtitle>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {/** Card Body */}
        <section className="bg-base-100 h-full w-full">{children}</section>
      </CardContent>
      {/* <CardFooter className="flex justify-between"></CardFooter> */}
    </Card>
  );
}
