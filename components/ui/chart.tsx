"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

// Chart

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <Chart />")
  }

  return context
}

type ChartContextProps = {
  config: ChartConfig
  /**
   * The id of the currently active data point.
   */
  activeId?: string
  /**
   * Index of the currently active data point.
   */
  activeIdx?: number
  /**
   * The user's preferred color scheme.
   * @default "light"
   */
  theme: "light" | "dark"
  /**
   * Whether the chart is interactive.
   * @default true
   */
  is: boolean
}

type ChartProps = {
  config: ChartConfig
  children: React.ReactNode
  /**
   * The id of the currently active data point.
   */
  activeId?: string
  /**
   * Index of the currently active data point.
   */
  activeIdx?: number
  /**
   * The user's preferred color scheme.
   * @default "light"
   */
  theme?: "light" | "dark"
  /**
   * Whether the chart is interactive.
   * @default true
   */
  is?: boolean
} & React.ComponentPropsWithoutRef<"div">

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ config, activeId, activeIdx, theme = "light", is = true, className, children, ...props }, ref) => {
    return (
      <ChartContext.Provider
        value={{
          config,
          activeId,
          activeIdx,
          theme,
          is,
        }}
      >
        <div ref={ref} className={cn("w-full h-full", className)} {...props}>
          <ChartContainer config={config} className="w-full h-full">
            {children}
          </ChartContainer>
        </div>
      </ChartContext.Provider>
    )
  },
)
Chart.displayName = "Chart"

// ChartContainer

const ChartCrosshairComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-muted", className)}
      {...props}
    />
  ),
)
ChartCrosshairComponent.displayName = "ChartCrosshair"

// ChartTooltip

const ChartTooltipComponent = ({ ...props }) => (
  <ChartTooltip cursor={<ChartCrosshairComponent />} content={<ChartTooltipContent />} {...props} />
)

// ChartLegend

const ChartLegendComponent = ({ ...props }) => <ChartLegend content={<ChartLegendContent />} {...props} />

// ChartBrush

type ChartBrushProps = {
  /**
   * The id of the brush.
   */
  id?: string
  /**
   * The name of the data key for the brush's x-axis.
   */
  dataKey?: string
  /**
   * The fill color of the brush.
   * @default "hsl(var(--primary) / 8%)"
   */
  fill?: string
  /**
   * The stroke color of the brush.
   * @default "hsl(var(--primary) / 80%)"
   */
  stroke?: string
} & React.ComponentPropsWithoutRef<"div">

const ChartBrushComponent = React.forwardRef<HTMLDivElement, ChartBrushProps>(
  ({ id, dataKey, fill, stroke, className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn(
          "h-10 w-full [&_.recharts-brush-texts]:fill-foreground [&_.recharts-brush-texts]:text-xs [&_.recharts-brush-texts]:font-bold [&_.recharts-brush-traveller]:stroke-primary [&_.recharts-brush-traveller-line]:stroke-primary [&_.recharts-brush-background]:fill-primary/5 [&_.recharts-brush-map]:fill-primary/80",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartBrushComponent.displayName = "ChartBrush"

// ChartAxis

const ChartAxisComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground [&_.recharts-cartesian-axis-tick_line]:stroke-border [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground [&_.recharts-radial-bar-axis-tick_text]:fill-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
ChartAxisComponent.displayName = "ChartAxis"

// ChartGrid

const ChartGridComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-radial-bar-grid_angle]:stroke-border [&_.recharts-polar-grid_angle]:stroke-border [&_.recharts-polar-grid_radius]:stroke-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
ChartGridComponent.displayName = "ChartGrid"

// ChartLabel

const ChartLabelComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => (
    <Label ref={ref} className={cn("fill-foreground text-primary", className)} {...props} />
  ),
)
ChartLabelComponent.displayName = "ChartLabel"

// ChartActiveDot

const ChartActiveDotComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-active-dot]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartActiveDotComponent.displayName = "ChartActiveDot"

// ChartDot

const ChartDotComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-dot]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartDotComponent.displayName = "ChartDot"

// ChartMinMax

const ChartMinMaxComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn(
          "fill-foreground stroke-foreground [&_.recharts-rectangle.recharts-active-rectangle]:fill-muted [&_.recharts-rectangle.recharts-active-rectangle]:stroke-muted",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartMinMaxComponent.displayName = "ChartMinMax"

// ChartReferenceLine

const ChartReferenceLineComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn(
          "stroke-muted-foreground [&_.recharts-reference-line-line]:stroke-muted-foreground [&_.recharts-reference-line-text]:fill-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartReferenceLineComponent.displayName = "ChartReferenceLine"

// ChartReferenceDot

const ChartReferenceDotComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn(
          "fill-muted-foreground stroke-muted-foreground [&_.recharts-reference-dot-dot]:fill-muted-foreground [&_.recharts-reference-dot-text]:fill-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartReferenceDotComponent.displayName = "ChartReferenceDot"

// ChartReferenceArea

const ChartReferenceAreaComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn(
          "fill-muted stroke-muted [&_.recharts-reference-area-rectangle]:fill-muted [&_.recharts-reference-area-rectangle]:stroke-muted",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartReferenceAreaComponent.displayName = "ChartReferenceArea"

// ChartErrorBar

const ChartErrorBarComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn("stroke-foreground [&_.recharts-error-bar-line]:stroke-foreground", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartErrorBarComponent.displayName = "ChartErrorBar"

// ChartScatter

const ChartScatterComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Scatter>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <Scatter
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-scatter-dot]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </Scatter>
    )
  },
)
ChartScatterComponent.displayName = "ChartScatter"

// ChartLine

const ChartLineComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Line>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <Line
        ref={ref}
        className={cn("stroke-primary [&_.recharts-line]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </Line>
    )
  },
)
ChartLineComponent.displayName = "ChartLine"

// ChartBar

const ChartBarComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Bar>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <Bar
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-bar]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </Bar>
    )
  },
)
ChartBarComponent.displayName = "ChartBar"

// ChartArea

const ChartAreaComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <div
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-area]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
ChartAreaComponent.displayName = "ChartArea"

// ChartPie

const ChartPieComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Pie>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <Pie
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-pie]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </Pie>
    )
  },
)
ChartPieComponent.displayName = "ChartPie"

// ChartRadar

const ChartRadarComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Radar>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <Radar
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-radar]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </Radar>
    )
  },
)
ChartRadarComponent.displayName = "ChartRadar"

// ChartRadialBar

const ChartRadialBarComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof RadialBar>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <RadialBar
        ref={ref}
        className={cn("fill-primary stroke-primary [&_.recharts-radial-bar]:stroke-[--color-foreground]", className)}
        {...props}
      >
        {children}
      </RadialBar>
    )
  },
)
ChartRadialBarComponent.displayName = "ChartRadialBar"

// ChartPolarGrid

const ChartPolarGridComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof PolarGrid>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <PolarGrid
        ref={ref}
        className={cn(
          "stroke-border [&_.recharts-polar-grid-angle]:stroke-border [&_.recharts-polar-grid-radius]:stroke-border",
          className,
        )}
        {...props}
      >
        {children}
      </PolarGrid>
    )
  },
)
ChartPolarGridComponent.displayName = "ChartPolarGrid"

// ChartPolarRadiusAxis

const ChartPolarRadiusAxisComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PolarRadiusAxis>
>(({ className, children, ...props }, ref) => {
  const { theme } = useChart()

  return (
    <PolarRadiusAxis
      ref={ref}
      className={cn(
        "stroke-border [&_.recharts-polar-radius-axis-line]:stroke-border [&_.recharts-polar-radius-axis-tick]:fill-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </PolarRadiusAxis>
  )
})
ChartPolarRadiusAxisComponent.displayName = "ChartPolarRadiusAxis"

// ChartXAxis

const ChartXAxisComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof XAxis>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <XAxis
        ref={ref}
        className={cn(
          "stroke-border [&_.recharts-cartesian-axis-tick_line]:stroke-border [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </XAxis>
    )
  },
)
ChartXAxisComponent.displayName = "ChartXAxis"

// ChartYAxis

const ChartYAxisComponent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof YAxis>>(
  ({ className, children, ...props }, ref) => {
    const { theme } = useChart()

    return (
      <YAxis
        ref={ref}
        className={cn(
          "stroke-border [&_.recharts-cartesian-axis-tick_line]:stroke-border [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </YAxis>
    )
  },
)
ChartYAxisComponent.displayName = "ChartYAxis"

// ChartLegendContent

const ChartLegendContentComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ChartLegendContent>
>(({ className, ...props }, ref) => {
  const { config } = useChart()

  return (
    <ChartLegendContent
      ref={ref}
      className={cn("flex flex-wrap justify-center gap-2 [&_svg]:h-3 [&_svg]:w-3 [&_svg]:rounded-full", className)}
      itemContainerClassName="flex items-center gap-1.5"
      labelClassName="text-muted-foreground"
      {...props}
    />
  )
})
ChartLegendContentComponent.displayName = "ChartLegendContent"

// ChartTooltipContent

const ChartTooltipContentComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ChartTooltipContent>
>(({ className, ...props }, ref) => {
  const { config } = useChart()

  return (
    <ChartTooltipContent
      ref={ref}
      className={cn("rounded-lg border border-border bg-background p-2 text-sm shadow-md", className)}
      itemClassName="flex items-center gap-2"
      labelClassName="font-medium text-foreground"
      formatter={(value, name) => {
        const formattedValue = new Intl.NumberFormat("en-US").format(value as number)
        return (
          <span className="text-foreground">
            {config[name as keyof typeof config]?.label}: {formattedValue}
          </span>
        )
      }}
      {...props}
    />
  )
})
ChartTooltipContentComponent.displayName = "ChartTooltipContent"

export {
  Chart,
  ChartContainer,
  ChartTooltipComponent,
  ChartTooltipContentComponent,
  ChartLegendComponent,
  ChartLegendContentComponent,
  ChartBrushComponent,
  ChartAxisComponent,
  ChartGridComponent,
  ChartLabelComponent,
  ChartCrosshairComponent,
  ChartActiveDotComponent,
  ChartDotComponent,
  ChartMinMaxComponent,
  ChartReferenceLineComponent,
  ChartReferenceDotComponent,
  ChartReferenceAreaComponent,
  ChartErrorBarComponent,
  ChartScatterComponent,
  ChartLineComponent,
  ChartBarComponent,
  ChartAreaComponent,
  ChartPieComponent,
  ChartRadarComponent,
  ChartRadialBarComponent,
  ChartPolarGridComponent,
  ChartPolarRadiusAxisComponent,
  ChartXAxisComponent,
  ChartYAxisComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
  ResponsiveContainer,
}
