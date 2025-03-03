import { Badge } from "../ui/badge";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function Tabbing({ tab, onTabChange, tabData }) {
  return (
    <Tabs value={Number(tab)} className="w-[600px]">
      <ScrollArea>
        <TabsList className="mb-3 h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
          {tabData.map((tabItem, index) => (
            <TabsTrigger
              onClick={() => onTabChange(index + 1)}
              value={index + 1}
              key={tabItem.title}
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-gray-100/10 hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-gray-100/10"
            >
              {/* tab Icon */}
              {tabItem.title}

              {tabItem.indicator && (
                <Badge
                  className={`ml-2 flex size-5 items-center justify-center rounded-full p-1 py-0 ${tabItem.badgeColor} text-xs hover:${tabItem.badgeColor}`}
                >
                  <p className="text-center">
                    {Number(tabItem.data) > 0
                      ? Number(tabItem.data) > 99
                        ? "99+"
                        : tabItem.data
                      : `\u00a0`}
                  </p>
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
