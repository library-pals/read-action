type ThemeVariables = {
  backgroundColor: string;
  titleColor: string;
  axisColor: string;
  tickColor: string;
  plotColorPalette: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  textColor: string;
  borderColor: string;
};

export enum ChartType {
  XYChart = "xychart",
  Pie = "pie",
}

function getCommonThemeVariables(): ThemeVariables {
  return {
    backgroundColor: "#f8f8f2",
    titleColor: "#282a36",
    axisColor: "#282a36",
    tickColor: "#6272a4",
    plotColorPalette: "#bd93f9, #ff79c6, #50fa7b, #ffb86c, #8be9fd, #f1fa8c",
    primaryColor: "#6272a4",
    secondaryColor: "#bd93f9",
    tertiaryColor: "#ffb86c",
    textColor: "#282a36",
    borderColor: "#6272a4",
  };
}

export function createMermaidTheme(chartType: ChartType): string {
  const colors = getCommonThemeVariables();

  // Validate chartType
  if (chartType !== ChartType.XYChart && chartType !== ChartType.Pie) {
    throw new Error(`Invalid chartType: ${chartType}`);
  }

  const xyChart = {
    backgroundColor: colors.backgroundColor,
    titleColor: colors.titleColor,
    xAxisLabelColor: colors.axisColor,
    xAxisTitleColor: colors.axisColor,
    xAxisTickColor: colors.tickColor,
    xAxisLineColor: colors.tickColor,
    yAxisLabelColor: colors.axisColor,
    yAxisTitleColor: colors.axisColor,
    yAxisTickColor: colors.tickColor,
    yAxisLineColor: colors.tickColor,
    plotColorPalette: colors.plotColorPalette,
  };

  const pieChart = {
    primaryColor: colors.primaryColor,
    primaryTextColor: colors.textColor,
    primaryBorderColor: colors.borderColor,
    lineColor: colors.textColor,
    secondaryColor: colors.secondaryColor,
    tertiaryColor: colors.tertiaryColor,
    tertiaryTextColor: colors.textColor,
    background: colors.backgroundColor,
  };

  const json = {
    theme: "base",
    themeVariables: {
      fontFamily: "Courier",
      fontSize: "16px",
      ...(chartType === ChartType.XYChart && { xyChart }),
      ...(chartType === ChartType.Pie && { ...pieChart }),
    },
  };

  return `%%{init: ${JSON.stringify(json)} }%%`;
}

interface BarChart {
  title: string;
  xAxisLabel: string;
  xAxisData: number[];
  yAxisLabel: string;
  yAxisData: string;
  barData: number[];
}

interface PieChart {
  title: string;
  data: string;
}

export function createMermaidDiagram(
  chartType: ChartType,
  data: BarChart | PieChart
): string {
  const theme = createMermaidTheme(chartType);
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
  title "${data.title}"
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
