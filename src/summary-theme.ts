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
  data: BarChart | PieChart
): string {
  const theme = `%%{init: ${JSON.stringify({
    themeVariables: {
      fontFamily: "Courier",
    },
  })} }%%`;
  switch (chartType) {
    case ChartType.XYChart:
      return createBarChart(theme, data as BarChart);
    case ChartType.Pie:
      return createPieChart(theme, data as PieChart);
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
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

export function createBarChart(theme: string, data: BarChart): string {
  return `\`\`\`mermaid
${theme}
xychart-beta
  title "${data.title}"
  x-axis "${data.xAxisLabel}" [${data.xAxisData.join(", ")}]
  y-axis "${data.yAxisLabel}" ${data.yAxisData}
  bar [${data.barData.join(", ")}]
\`\`\``;
}
