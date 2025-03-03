import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  total: {
    label: "total",
    color: "hsl(var(--chart-1))",
  },
  labhour: {
    label: "labhour",
    color: "hsl(var(--chart-2))",
  },
};

export function LineDottedChart({ chartData, chartTitle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="min-h-[500px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              right: 30,
              left: 12,
              top: 30,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              //   tickLine={false}
              //   axisLine={false}
              tickMargin={8}
              //   tickFormatter={(value) => value.slice(0, )}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="min-w-[150px]" />}
            />
            <Line
              dataKey="Usage Hr"
              type="natural"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-total)",
              }}
              activeDot={{
                r: 10,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>

            <Line
              dataKey="Accu Lab Hr"
              type="natural"
              stroke="var(--color-labhour)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-labhour)",
              }}
              activeDot={{
                r: 10,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
