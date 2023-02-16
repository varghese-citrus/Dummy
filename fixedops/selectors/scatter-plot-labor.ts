export class ScatterPlotLaborSelectors {
  public static scatterPlotLaborLink = "#Scatter-Plot-Labor";
  public static scatterPlotLaborHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/div[1]/h4";
  public static scatterPlotDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/div[2]/p";
  public static resetBtn = "#reset-layout";
  public static getTab(id: number) {
    return `.MuiTabs-root > .MuiTabs-scroller > .MuiTabs-flexContainer > .MuiButtonBase-root:nth-child(${id}) > .MuiTab-wrapper`;
  }

  public static chart = "div[class='highcharts-container chartid-1090']";
  public static rowTable =
    "div[class='ag-root ag-unselectable ag-layout-normal']";
  public static viewDetailBtn = "#view-details-1090";
  public static infoIcon =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div[1]/div[2]/button[3]";
  public static chartName =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div[1]/div[1]/span[1]";
  public static chartNumber =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div[1]/div[1]/span[2]";
  public static chartExpandBtn =
    "//*[@id='chartConteiner-1090']/div[1]/div[2]/button[2]";
  public static expandCls = "form[class='MuiBox-root jss451 jss449']";
  public static chartCollapseBtn =
    "(//*[@id='chartConteiner-1090']/div[1]/div[2]/button[3])[2]";
  public static popup = "div[role='dialog']";

  public static highChartPoint(id: number) {
    return `(//*[@class='highcharts-point highcharts-color-0'])[${id}]`;
  }
  public static resetButton = "button[id='reset-layout']";
  public static itemRow =
    "//*[@id='ItemizationGrid']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div";
  public static rowItem =
    "//*[@id='ItemizationGrid']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[2]";
  public static popupCloseBtn = "/html/body/div[2]/div[3]/div/div/form/button";
  public static resetBtnXpath = "//*[@id='reset-layout']";

  public static canvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div/div";

  public static cpElrLaborSoliHoursHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";

  public static cpElrLaborSoliHoursbackBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";

  public static cpElrLaborSoliHoursDataAsOf =
    "/html/body/div[1]/div[2]/div/div/div/div/div[1]/div[2]/p";

  public static cpElrLaborSoliHoursResetBtn =
    "/html/body/div[1]/div[2]/div/div/div/div/div[1]/div[2]/button";

  public static cpElrLaborSoliHoursDownloadIcon =
    "/html/body/div[1]/div[2]/div/div/div/div/div[1]/div[2]/a";

  public static dataTable = "div[id='data-tab']";

  public static cpElrLaborSoliHoursRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[7]";

  public static tglBtn_1 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[3]/td[2]/span/span[2]/button";
  public static tglBtn_2 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[7]/td[2]/span/span[2]/button";
  public static tglBtn_3 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[11]/td[2]/span/span[2]/button";
  public static tglBtn_4 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[15]/td[2]/span/span[2]/button";
  public static tglBtn_5 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[19]/td[2]/span/span[2]/button";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";

  public static popupHeading =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[1]/h4";

  public static scatterPlotCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[1]/div[2]/div/div/div";

  public static tBtn_1 =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[3]/div/table/tbody/tr[3]/td[2]/span/span[2]/button";
  public static tBtn_2 =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[3]/div/table/tbody/tr[7]/td[2]/span/span[2]/button";
  public static tBtn_3 =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[3]/div/table/tbody/tr[11]/td[2]/span/span[2]/button";
  public static tBtn_4 =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[3]/div/table/tbody/tr[15]/td[2]/span/span[2]/button";
  public static tBtn_5 =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[3]/div/table/tbody/tr[19]/td[2]/span/span[2]/button";
  public static tBtn_6 =
    "/html/body/div[3]/div[3]/div/div/form/div/div/div/div/div[3]/div/table/tbody/tr[23]/td[2]/span/span[2]/button";

  public static toggleBtn(id: number) {
    return `(//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall'])[${id}]`;
  }
  public static overviewContainer =
    "div[class='diagram-section diagram-section-scatter-details']";

  public static legendsCompetitive =
    ".highcharts-root > .highcharts-legend > g > g > .highcharts-legend-item:nth-child(1) > text > tspan";
  public static legendsMaintenance =
    ".highcharts-root > .highcharts-legend > g > g > .highcharts-legend-item:nth-child(2) > text > tspan";
  public static legendsRepair =
    ".highcharts-root > .highcharts-legend > g > g > .highcharts-legend-item:nth-child(1) > text > tspan";
}
