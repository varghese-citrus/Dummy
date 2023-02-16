export class PartsWorkmixSelectors {
  public static partsMenu = "button[id='Parts']";
  public static partsWorkmixMenu = "//*[@id='Parts Work Mix']";
  public static pwxDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div/p";
  public static toggleBtn = "button[id='partialMonthToggle']";
  public static toggleSpan = "(//button[@id='partialMonthToggle']//span)[1]";
  public static workMixTab =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[1]";
  public static cPchart_1 = "#apexchartschart1049";
  public static cPchart_2 = "#apexchartschart966";
  public static cPchart_3 = "#apexchartschart920";
  public static cPchart_4 = "#apexchartschart925";
  public static workMixChart_1 = "div[id='apexchartschart1253'";
  public static workMixChart_2 = "div[id='apexchartschart1258']";
  public static workMixChart_3 = "div[id='apexchartschart1254']";
  public static workMixChart_4 = "div[id='apexchartschart1257']";
  public static workMixChart_5 = "div[id='apexchartschart1255']";
  public static workMixChart_6 = "div[id='apexchartschart1256']";
  public static pWrkMxChartName(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[1]/div[1]/span[1]`;
  }
  public static pWrkMxChartId(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']//span)[${id}]`;
  }
  public static partsExpandBtn(id: number) {
    return `(//*[@title='Expand'])[${id}]`;
  }
  public static partsCollapseBtn =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div[1]/div[2]/button[2]";
  public static partsColBtn = "button[title='Collapse']";
  public static popUp = "/html/body/div[2]/div[3]/div/div";
  public static dialogBox = "div[role='dialog']";
  public static infoIcon(id: number) {
    return `//*[@id='work-mix']/div[2]/div[${id}]/div/div[1]/div[2]/button[3]`;
  }
  public static detailBtn_1 = "#view-details-1253";
  public static detailBtn_2 = "#view-details-1258";
  public static detailBtn_3 = "#view-details-1254";
  public static detailBtn_4 = "#view-details-1257";
  public static detailBtn_5 = "#view-details-1255";
  public static detailBtn_6 = "#view-details-1256";

  public static addRemFavBtn(id: number) {
    return `(//button[@id='Add-to-Favorites' or @id='Remove-from-Favorites'])[${id}]`;
  }
  public static favMenu = "//*[@id='Favorites']";
  public static partialMonthSpan =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div/label/span[2]";

  public static showHideDiv =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div";

  public static sales = "#Sales_report";
  public static cost = "button[id='Cost_report']";
  public static grossProfit = "#grossprofit_report";
  public static markUp = "#markup_report";
  public static jobCount = "#jobcount_report";
  public static workMix = "#workmix_report";

  public static monthlyTable_1 =
    "div[class='MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded']";

  public static monthlyTable_2 = "div[id='data-tab-reports']";

  public static contractedCls(id: number) {
    return `(//*[@class='ag-group-contracted'])[${id}]`;
  }

  public static expandedCls = "//*[@class='ag-group-expanded']";

  public static rankingPerRO =
    "//*[@id='monthlyRankedTables']/div/div/div/div[2]/div/div[1]";

  public static downloadIcon =
    "//*[@id='monthlyRankedTables']/div/div/div/div[2]/a";

  public static monthComparison = "button[id='2 Month Work Mix Comparison']";
  public static monthComparisonTab = "//*[@id='2 Month Work Mix Comparison']";

  public static month_1Select =
    "(//div[@id='mui-component-select-group-by-type'])[1]";

  public static month_2Select =
    "(//div[@id='mui-component-select-group-by-type'])[2]";

  public static getMonth(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static monthWorkMixChart_1 =
    "div[class='highcharts-container chartid-1309']";
  public static monthWorkMixChart_2 =
    "div[class='highcharts-container chartid-1310']";
  public static monthWorkMixChart_3 =
    "div[class='highcharts-container chartid-1312']";
  public static monthWorkMixChart_4 =
    "div[class='highcharts-container chartid-1311']";
  public static monthWorkMixChart_5 =
    "div[class='highcharts-container chartid-1313'";
  public static getChartName(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[1]/span/label[1]`;
  }

  public static getChartDate(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[1]/span/label[2]`;
  }

  public static getChartId(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[1]/span/label[3]`;
  }

  public static monthChartInfoIcon(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[3]`;
  }

  public static viewDetailBtn2MntCom_1 = "#view-details-1309";
  public static viewDetailBtn2MntCom_2 = "#view-details-1310";
  public static viewDetailBtn2MntCom_3 = "#view-details-1312";
  public static viewDetailBtn2MntCom_4 = "#view-details-1311";
  public static viewDetailBtn2MntCom_5 = "#view-details-1313";

  public static wrkMixChartViewDetailBtn_1 = "#view-details-1253";
  public static wrkMixChartViewDetailBtn_2 = "#view-details-1258";
  public static wrkMixChartViewDetailBtn_3 = "#view-details-1254";
  public static wrkMixChartViewDetailBtn_4 = "#view-details-1257";
  public static wrkMixChartViewDetailBtn_5 = "#view-details-1255";
  public static wrkMixChartViewDetailBtn_6 = "#view-details-1256";

  public static monthWrkMixChartExpBtn(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[2]`;
  }

  public static monthComparisonExpColPopup = "div[role='dialog']";
  public static monthComparisonCollapseBtn =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div/div[1]/div[2]/button[2]";

  public static monthWorkMixChartAddRemFavorite(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[5]`;
  }

  public static opcodeSummaryTab = "//*[@id='Opcode - Summary']";
  public static opcodeSummaryTable = "div[id='data-tab']";

  public static opCodeDetailViewTab = "[id='Opcode - Detailed View']";
  public static opCodeDetailViewTable = "#data-tab";

  public static resetLayoutBtn = "#reset-layout";

  public static monthWrkMixTab =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[2]";

  public static downloadBtn = "#export-to-excel";
  public static monthDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div";

  public static opcodeMonthSelector =
    "div[id='mui-component-select-group-by-type']";

  public static opcodeSummeryTab = "button[id='Opcode - Summary']";
  public static opcodeTab =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[4]";
  public static opcodeTable = "#data-tab";
  public static opcodeColumnToggleBtn =
    ".ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > .ag-side-button:nth-child(1) > .ag-side-button-button";
  public static opcodeColumnSelBox =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[2]/div[2]/div";

  public static opcodeFilterToggleBtn =
    ".ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > .ag-side-button:nth-child(2) > .ag-side-button-button";
  public static opcodeFilterSelBox =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[3]";

  public static opcodeDetailedViewTab = "button[id='Opcode - Detailed View']";

  public static dataTab = "#data-tab-reports";
  public static dt =
    ".containerMain > .containersub > #data-tab-reports > div > .ag-root-wrapper";
  public static dataTable = "div[id='data-tab']";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";
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

  public static workmixCanvas(id: number) {
    return `.MuiGrid-root > .MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiCardContent-root > div`;
  }

  public static partsWorkmixOtherHeading =
    "/html/body/div[1]/div[2]/div/div/div/div[2]/div/div/div/button[1]/span[1]/div";
  public static partsWorkmixOtherDataAsOf =
    "/html/body/div[1]/div[2]/div/div/div/div[2]/div/div/div/span/p";
  public static partsWorkmixOtherResetBtn =
    "/html/body/div[1]/div[2]/div/div/div/div[2]/div/div/div/button[2]";

  public static partsWorkmixOtherDownloadIcon = "//*[@id='export-to-excel']";

  public static rowDataId =
    ".ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell > .ag-cell-wrapper > .ag-group-value";

  public static workmixCanvasDiv(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[2]/div`;
  }

  public static workmixCanvasName(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[1]/div[1]/span[1]`;
  }

  public static monthlyTable = "table[class='MuiTable-root sales-table']";

  public static competetive =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[15]/span/span[2]/span";
  public static maintenance =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[2]/div[15]/span/span[2]/span";
  public static repair =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[3]/div[15]/span/span[2]/span";

  public static competetiveRow =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]";
  public static maintenanceRow =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[15]";
  public static repairRow =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[13]";

  public static barCharts(id: number) {
    return `(//*[@class='apexcharts-bar-area'])[${id}]`;
  }

  public static canvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[2]/div/div";

  public static cv =
    ".MuiPaper-root > .MuiGrid-root > .MuiGrid-root > .MuiPaper-root > .MuiCardContent-root";

  public static summaryRowData =
    ".ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell > span > a";

  public static opcodeDetailViewRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[4]";

  public static opcodeSummary = "button[id='Opcode - Summary']";

  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";

  public static getMonthCmpViewDetailBtn(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[4]
      `;
  }
  public static overviewContainer = "div[class='scrollbar-container ps']";
  public static overviewCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div[2]/div/div";

  public static monthCmpGraphs(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[2]/div/div`;
  }
  public static opcodeSummeryRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[12]";

  public static partsWorkmixOtherRowData =
    "/html/body/div/div[2]/div/div/div/div[4]/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[9]/div[11]";

  public static bar(id: number) {
    return `(//*[@class='highcharts-point highcharts-color-0'])[${id}]`;
  }
  public static resetBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained jss278 reset-btn']";

  public static wrkMixChartInfoIcon(id: number) {
    return `.MuiGrid-root:nth-child(${id}) >.MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root`;
  }
  public static barId(id: number) {
    return `svg > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-0.highcharts-tracker > rect:nth-child(${id})`;
  }

  public static chartBarId(id: number) {
    return `(//*[@class='highcharts-point highcharts-color-0' or @class='highcharts-point highcharts-color-1'])[${id}]`;
  }
  public static noTableRowDataMsg = "//*[text()='No Rows To Show']";
  public static detailedViewRowData = "(//div[@col-id='ronumber'])[2]";
  public static matrixInstallDate = "(//*[@col-id='gridDate'])[2]";
  public static competitivePreMonthData = "(//tr//td[3])[1]";
  public static maintenancePreMonthData = "(//tr//td[3])[2]";
  public static repairPreMonthData = "(//tr//td[3])[3]";
  public static backButton = "//button//span//p[text()='Back']";
  public static advisor = "//button//span[text()='Service Advisors']";
  public static advisorSpan =
    "span[class='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1']";
  public static checkBox(id: number) {
    return `(//li//label//span//span//input)[${id}]`;
  }
  public static filterBtn = "//button//span[text()='Apply Filter']";

  public static salesSpan = "//button[@id='Sales_report']//span[1]";
  public static costSpan = "//button[@id='Cost_report']//span[1]";
  public static grossProfitSpan = "//button[@id='grossprofit_report']//span[1]";
  public static markupSpan = "//button[@id='markup_report']//span[1]";
  public static jobCountSpan = "//button[@id='jobcount_report']//span[1]";
  public static workMixSpan = "//button[@id='workmix_report']//span[1]";
}
