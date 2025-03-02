export enum ChartType {
  XYChart = "xychart",
  Pie = "pie",
}

interface BarChart {
  title: string;
  xAxisLabel: string;
  xAxisData: number[] | string[];
  yAxisLabel: string;
  yAxisData: string;
  barData: number[] | string[];
}

interface PieChart {
  title: string;
  data: string;
}

export function createMermaidDiagram(
  chartType: ChartType,
  data: BarChart | PieChart,
  chartSubType: "bar" | "line" = "bar" // default to "bar"
): string {
  const theme = `%%{init: ${JSON.stringify({
    themeVariables: {
      fontFamily: "Courier",
    },
  })} }%%`;
  switch (chartType) {
    case ChartType.XYChart:
      return createBarChart(theme, data as BarChart, chartSubType);
    case ChartType.Pie:
      return createPieChart(theme, data as PieChart);
  }
}

export function createPieChart(theme: string, data: PieChart): string {
  return `\`\`\`mermaid
${theme}
pie showData
  title ${data.title}
${data.data}
\`\`\``;
}

export function createBarChart(
  theme: string,
  data: BarChart,
  chartSubType: "bar" | "line"
): string {
  return `\`\`\`mermaid
${theme}
xychart-beta
  title "${data.title}"
  x-axis "${data.xAxisLabel}" [${data.xAxisData.join(", ")}]
  y-axis "${data.yAxisLabel}" ${data.yAxisData}
  ${chartSubType} [${data.barData.join(", ")}]
\`\`\``;
}
