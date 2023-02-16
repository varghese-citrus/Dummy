export class PartsScatterPlotSelectors {
  public static partsMenu = "#Parts";
  public static scatterPlotMenu = "#Scatter-Plot-Parts";
  public static scatterPlotHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/div[1]/h4";
  public static overviewContainer =
    "div[class='diagram-section diagram-section-scatter-details']";
  public static resetLayout = "#reset-layout";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/div[2]/p";
  public static monthTab(id: number) {
    return `//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div[2]/div/button[${id}]`;
  }
  // public static chartId = "chartConteiner-1096"
  public static chartId = "div[class='highcharts-container chartid-1096']";
  //"div[id='chartConteiner-1096']";
  public static pivotTable =
    "div[class='ag-root-wrapper ag-layout-normal ag-ltr']";

  public static expandBtn =
    "//*[@id='chartConteiner-1096']/div[1]/div[2]/button[2]";
  // "//*[@id='chartConteiner-1090']/div[1]/div[2]/button[3])[2]";
  public static popUp = "div[role='dialog']";
  public static collapseBtn =
    "(//*[@id='chartConteiner-1096']/div[1]/div[2]/button[3])[2]";
  //".jss374 > #chartConteiner-1096 > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3)";
  public static viewDetailBtn = "button[id='view-details-1096']";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";

  public static dataAsOfDetailPage =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";

  public static infoIcon =
    "//*[@id='chartConteiner-1096']/div[1]/div[2]/button[3]";

  public static resetButton = "//*[@id='reset-layout']";
  public static pointPivotTable =
    "//*[@id='ItemizationGrid']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div";
  public static rowItem =
    "//*[@id='ItemizationGrid']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[2]";
  public static highChartPoint(id: number) {
    return `(//*[@class='highcharts-point highcharts-color-1'])[${id}]`;
  }
  public static chartName =
    "//*[@id='chartConteiner-1096']/div[1]/div[1]/span[1]";
  public static chartNumber =
    "//*[@id='chartConteiner-1096']/div[1]/div[1]/span[2]";
  public static roPopup = "div[role='dialog']";
  public static resetBtn = "button[id='reset-layout']";
  public static roPopupCloseBtn =
    "/html/body/div[2]/div[3]/div/div/form/button";

  public static getTab(id: number) {
    return `.MuiTabs-root > .MuiTabs-scroller > .MuiTabs-flexContainer > .MuiButtonBase-root:nth-child(${id}) > .MuiTab-wrapper`;
  }
  public static scatterPlotCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[1]/div[2]/div/div/div";
  public static itemRow =
    "//*[@id='ItemizationGrid']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div";
  public static popupCloseBtn = "/html/body/div[2]/div[3]/div/div/form/button";
  public static resetBtnXpath = "//*[@id='reset-layout']";
  public static popup = "div[role='dialog']";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";
  public static toggleBtn(id: number) {
    return `(//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall'])[${id}]`;
  }
  public static canvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div/div/div[2]/div/div/div";
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
  public static cpPartsMarkupPartsCostbackBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";

  public static cpPartsMarkupPartsCostDataAsOf =
    "/html/body/div[1]/div[2]/div/div/div/div/div[1]/div[2]/p";

  public static cpPartsMarkupPartsCostResetBtn =
    "/html/body/div[1]/div[2]/div/div/div/div/div[1]/div[2]/button";

  public static cpPartsMarkupPartsCostDownloadIcon =
    "/html/body/div[1]/div[2]/div/div/div/div/div[1]/div[2]/a";
  public static dataTable = "div[id='data-tab']";
  public static cpPartsMarkupPartsCostRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[7]";

  public static legendsCompetitive =
    ".highcharts-root > .highcharts-legend > g > g > .highcharts-legend-item:nth-child(1) > text > tspan";
  public static legendsMaintenance =
    ".highcharts-root > .highcharts-legend > g > g > .highcharts-legend-item:nth-child(2) > text > tspan";
  public static legendsRepair =
    ".highcharts-root > .highcharts-legend > g > g > .highcharts-legend-item:nth-child(1) > text > tspan";
}
