export class SpecialMetricsSelectors {
  public static discountSpecialMetricsLink =
    "button[id='Disc. & Special Metrics']";
  public static specialMetricsLink = "a[id='Special Metrics']";

  public static charts(id: number) {
    return `(//canvas)[${id}]`;
  }
  public static chartDiv =
    "//div[@class='react-grid-item diagram-section cssTransforms']";

  public static chartName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }

  public static chartNumber(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']/span)[${id}]`;
  }

  public static chartExpandCollapseBtn(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }

  public static chartInfoIcon(id: number) {
    return `(//*//div[2]/button[3])[${id}]`;
  }

  public static chartViewDetailBtn(id: number) {
    return `(//*//div[2]/button[4])[${id}]`;
  }

  public static chartAddRemBtn(id: number) {
    return `(//button[@id='Add-to-Favorites' or @id='Remove-from-Favorites'])[${id}]`;
  }

  public static popup = "div[role='dialog']";
  public static collapseBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";
  public static canvas_1 = "canvas[id='chart_948']";
  public static canvas_2 = "canvas[id='chart_923']";
  public static canvas_3 = "canvas[id='chart_1354']";
  public static canvas_4 = "canvas[id='chart_1355']";
  public static canvas_5 = "canvas[id='chart_938']";
  public static canvas_6 = "canvas[id='chart_930']";
  public static canvas_7 = "canvas[id='chart_935']";
  public static canvas_8 = "canvas[id='chart_936']";
  public static canvas_9 = "canvas[id='chart_1239']";
  public static canvas_10 = "canvas[id='chart_1316']";
  public static canvas_11 = "canvas[id='chart_1317']";

  public static resetBtn = "button[id='reset-layout']";
  public static favLink = "//*[@id='Favorites']";
  public static specialMetricsDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static pageHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";

  public static getChart(id: number) {
    return `.MuiPaper-root > .react-grid-layout > .react-grid-item:nth-child(${id}) > .MuiPaper-root`;
  }
  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static specialMetricsOverviewContainer =
    "div[class='scrollbar-container ps']";
  public static specialMetricsOverviewCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[2]/canvas";
  public static specialMetricsOverviewCanvasName =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div/div[1]/div[1]/span[1]";

  public static specialMetricsCanvas(id: number) {
    return `(//canvas)[${id}]`;
  }
  public static specialMetricsCanvasName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }
  public static drillBackBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static drillHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static drillDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static drillResetBtn = "//*[@id='reset-layout']";
  public static drillDownloadIcon = "//*[@id='export-to-excel']";
  public static drillDataTable = "div[id='data-tab']";

  public static drillTable(id: number) {
    return `(//div[@id='returnRateDrilldown'])[${id}]`;
  }
  public static drillExpandBtn = "span[class='ag-group-contracted']";
  public static drillVinLastMonthBtn = "(//*[@col-id='ronumber'])[2]";
  public static drillCpHeading =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/h4";
  public static firstDataOpcodeDetail =
    ".ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell:nth-child(4)";

  public static chartsDiv(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[3]/div[${id}]`;
  }

  public static chartTabBtn_1 = "button[id='chartid-948']";
  public static chartTabBtn_2 = "button[id='chartid-923']";
  public static chartTabBtn_3 = "button[id='chartid-1354']";
  public static chartTabBtn_4 = "button[id='chartid-1355']";
  public static chartTabBtn_5 = "button[id='chartid-938']";
  public static chartTabBtn_6 = "button[id='chartid-930']";
  public static chartTabBtn_7 = "button[id='chartid-935']";
  public static chartTabBtn_8 = "button[id='chartid-936']";
  public static chartTabBtn_9 = "button[id='chartid-1239']";
  public static chartTabBtn_10 = "button[id='chartid-1316']";
  public static chartTabBtn_11 = "button[id='chartid-1317']";

  public static backButton(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[3]/div[${id}]/div/div[1]/div[2]/button[6]`;
  }
  public static expandBtn(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static dialogBox = "div[role='dialog']";
  public static noDataAlertMsg(id: string) {
    return `//div[@id='${id}']`;
  }
  public static getChartId(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock'])[${id}]`;
  }
  public static getChartName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }
}
