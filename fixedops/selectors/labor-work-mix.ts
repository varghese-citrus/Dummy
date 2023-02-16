export class LaborWorkMiss {
  public static labor = "button[id='Labor']";
  public static laborWorkMixLink = "//*[@id='Labor Work Mix']/span[1]";
  public static workMixTab =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[1]";

  public static cpchart_1 = "#apexchartschart960";
  public static cpchart_2 = "#apexchartschart1073";
  public static cpchart_3 = "#apexchartschart920";
  public static cpchart_4 = "#apexchartschart925";

  public static barChart_1 = "div[id='apexchartschart1243']";
  public static barChart_2 = "div[id='apexchartschart1248']";
  public static barChart_3 = "div[id='apexchartschart1244']";
  public static barChart_4 = "div[id='apexchartschart1247']";
  public static barChart_5 = "div[id='apexchartschart1245']";
  public static barChart_6 = "div[id='apexchartschart1246']";

  public static lbrWrkMissDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div/p";
  public static resetBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained jss278 reset-btn']";

  public static monthWrkMixTab =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[2]";

  public static monthWrkMixChart_1 =
    "div[class='highcharts-container chartid-1260']";
  public static monthWrkMixChart_2 =
    "div[class='highcharts-container chartid-1261']";
  public static monthWrkMixChart_3 =
    "div[class='highcharts-container chartid-1263']";
  public static monthWrkMixChart_4 =
    "div[class='highcharts-container chartid-1262']";
  public static monthWrkMixChart_5 =
    "div[class='highcharts-container chartid-1259']";

  public static partialMonSpan =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div/label/span[2]/span";
  public static toggleBtn = "button[id='partialMonthToggle']";
  public static toggleSpan = "(//button[@id='partialMonthToggle']//span)[1]";
  public static showHideDiv =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div";

  public static wrkMixChartExpandBtn(id: number) {
    return `//*[@id='work-mix']/div[2]/div[${id}]/div/div[1]/div[2]/button[2]`;
  }
  public static wrkMixChartExpandCls =
    ".MuiPaper-root > .MuiDialogContent-root > .MuiBox-root > .MuiGrid-root > .MuiPaper-root";
  public static collapseBtn =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div[1]/div[2]/button[2]";
  public static popup = "/html/body/div[2]/div[3]/div/div";

  public static wrkMixChartName(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[1]/div[1]/span[1]`;
  }

  public static wrkMixChartNumber(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[1]/div[1]/span[2]/span`;
  }

  public static wrkMixChartInfoIcon(id: number) {
    return `.MuiGrid-root:nth-child(${id}) >.MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root`;
  }

  public static wrkMixChartViewDetailBtn_1 = "#view-details-1243";
  public static wrkMixChartViewDetailBtn_2 = "#view-details-1248";
  public static wrkMixChartViewDetailBtn_3 = "#view-details-1244";
  public static wrkMixChartViewDetailBtn_4 = "#view-details-1247";
  public static wrkMixChartViewDetailBtn_5 = "#view-details-1245";
  public static wrkMixChartViewDetailBtn_6 = "#view-details-1246";

  public static wrkMixChartAddRemToFavBtn(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[1]/div[2]/button[5]`;
  }
  public static favNavLink = "//*[@id='Favorites']";

  public static monthlyTablesTitle =
    "//*[@id='monthlyRankedTables']/div/div/div/div/h6";
  public static sales = "#Sales_report";
  public static solidHours = "#soldhours_report";
  public static grossProfit = "#grossprofit_report";
  public static elr = "#elr_report";
  public static jobCount = "#jobcount_report";
  public static workMix = "#workmix_report";
  public static workMixSalesTable_1 =
    "div[class='MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded']";
  public static workMixSalesTable_2 = "div[id='data-tab-reports']";

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

  public static rankingPerRow =
    "//*[@id='monthlyRankedTables']/div/div/div/div[2]/div";
  public static downloadIcon =
    "//*[@id='monthlyRankedTables']/div/div/div/div[2]/a";

  public static monthWorkMixChartExpandBtn(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[2]`;
  }
  public static monthWorkMixChartExpCls =
    "body > .MuiDialog-root > .MuiDialog-container > .MuiPaper-root > .MuiDialogContent-root";
  public static monthWorkMixChartCollapseBtn =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div/div[1]/div[2]/button[2]";

  public static monthWorkMixChartViewDetailBtn_1 = "#view-details-1260";
  public static monthWorkMixChartViewDetailBtn_2 = "#view-details-1261";
  public static monthWorkMixChartViewDetailBtn_3 = "#view-details-1263";
  public static monthWorkMixChartViewDetailBtn_4 = "#view-details-1262";
  public static monthWorkMixChartViewDetailBtn_5 = "#view-details-1259";

  public static monthWorkMixChartAddRemFavorite(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[5]`;
  }

  public static competitiveBtn =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[1]/span";
  public static maintenanceBtn =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[1]/span";
  public static repairBtn =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[1]/span";

  public static competitiveContractedSpan =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[1]/span/span[2]";
  public static maintenanceContractedSpan =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[2]/div[1]/span/span[2]";
  public static repairContractedSpan =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[3]/div[1]/span/span[2]";

  public static competitiveExpandedSpan =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[4]/div[1]/span/span[1]";
  public static maintenanceExpandedSpan =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[15]/div[1]/span/span[1]";
  public static repairExpandedSpan =
    "//*[@id='data-tab-reports']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[13]/div[1]/span/span[1]";

  public static contractedCls(id: number) {
    return `(//*[@class='ag-group-contracted'])[${id}]`;
  }
  public static expandedCls = "(//*[@class='ag-group-expanded'])";
  public static month1Select =
    "(//*[@id='mui-component-select-group-by-type'])[1]";
  public static month2Select =
    "(//*[@id='mui-component-select-group-by-type'])[2]";
  public static monthLi =
    "li[class='MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button']";
  public static getMonth(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static getChartName(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[1]/span/label[1]`;
  }

  public static getChartDate(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[1]/span/label[2]`;
  }

  public static getChartNumber(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[1]/span/label[3]`;
  }

  public static monthChartInfoIcon(id: number) {
    return `.MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path`;
  }

  public static opcodeSummeryTab = "button[id='Opcode - Summary']";
  public static opcodeTab =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[4]";
  public static opcodeTable = "div[id='data-tab']";
  public static opcodeColumnToggleBtn =
    ".ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > .ag-side-button:nth-child(1) > .ag-side-button-button";
  public static opcodeColumnSelBox =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[2]/div[2]/div";

  public static opcodeFilterToggleBtn =
    ".ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > .ag-side-button:nth-child(2) > .ag-side-button-button";
  public static opcodeFilterSelBox =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[3]";

  public static opcodeDetailedViewTab = "button[id='Opcode - Detailed View']";
  public static opcodeDetailedViewMonthSelect =
    "//*[@id='mui-component-select-group-by-type']";
  public static getOpcodeDetailedViewMonth(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static resetBtnId = "#reset-layout";

  public static tab_1 =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[1]";
  public static tab_2 =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[2]";
  public static tab_3 =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[3]";
  public static tab_4 =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/button[4]";

  public static dIcon = "a[id='export-to-excel']";

  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static overviewContainer = "div[class='scrollbar-container ps']";
  public static canvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[2]/div/div";

  public static cv =
    ".MuiPaper-root > .MuiGrid-root > .MuiGrid-root > .MuiPaper-root > .MuiCardContent-root";

  public static dataTab = "#data-tab-reports";
  public static dt =
    ".containerMain > .containersub > #data-tab-reports > div > .ag-root-wrapper";
  public static dataTable = "div[id='data-tab']";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";
  public static rOrderTable =
    "#root >div > div > div > div > div > div:nth-child(4) > div > table";
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
    return `#work-mix > .MuiGrid-root > .MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiCardContent-root`;
  }

  public static workmixCanvasDiv(id: number) {
    return `//*[@id="work-mix"]/div[2]/div[${id}]/div/div[2]/div`;
  }

  public static workmixCanvasName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock'])[${id}]`;
  }

  public static monthlyTable = "table[class='MuiTable-root sales-table']";

  public static laborWorkmixOtherHeading =
    "/html/body/div/div[2]/div/div/div[2]/div/div/div/button[1]/span[1]/div";
  public static laborWorkmixOtherDataAsOf =
    "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div/span/p";
  public static laborWorkmixOtherResetBtn =
    "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div/button[2]";

  public static laborWorkmixOtherDownloadIcon =
    "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div/a[2]";

  public static rowDataId =
    ".ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell > .ag-cell-wrapper > .ag-group-value";

  public static monthCmpViewDetailBtnDiv =
    "/html/body/div[1]/div[2]/div/div/div/div[3]/div/div/div/div[1]/div[2]/button[4]";
  public static getMonthCmpViewDetailBtn(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[1]/div[2]/button[4]
    `;
  }

  public static overviewCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div[2]/div/div";

  public static barRect =
    "svg > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-0.highcharts-tracker > rect";

  public static barId(id: number) {
    return `svg > g.highcharts-series-group > g.highcharts-series.highcharts-series-0.highcharts-column-series.highcharts-color-0.highcharts-tracker > rect:nth-child(${id})`;
  }

  public static opcodeSummeryRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[12]";

  public static opcodeDetailViewRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[4]";

  public static laborWorkmixOtherRowData =
    "/html/body/div[1]/div[2]/div/div/div[4]/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[1]";

  public static monthCmpGraphs(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[${id}]/div/div/div[2]/div/div`;
  }

  public static bar(id: number) {
    return `(//*[@class='highcharts-point highcharts-color-0'])[${id}]`;
  }

  public static durationExpand = "(//span[@class='ag-group-contracted'][1])[1]";

  public static summaryRowData =
    ".ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell > span > a";

  public static barCharts(id: number) {
    return `(//*[@class='apexcharts-bar-area'])[${id}]`;
  }
  public static repairOrderAlertMsg =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]";

  public static laborWorkmixOtherHeadingSpan =
    "#root > div.jss1 > div > div > div:nth-child(2) > div > div > div > button.MuiButtonBase-root.MuiTab-root.MuiTab-textColorSecondary.MuiTab-fullWidth > span.MuiTab-wrapper > div";
  public static laborWorkmixOtherDataAsOfDiv =
    "#root > div > div > div > div:nth-child(2) > div > div > div > span > p";
  public static laborWorkmixOtherResetButton =
    "#root > div.jss1 > div > div > div:nth-child(2) > div > div > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.jss90.reset-btn.MuiButton-fullWidth";
  public static laborWorkmixOtherDIcon = "a[id='export-to-excel']";
  public static opcodeDetailedViewRowTable =
    "/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[4]";
  public static opcodeDetailedViewRowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[4]";
  public static opcodeDetailROData = "div[col-id='ronumber']";
  public static noTableRowDataMsg = "//*[text()='No Rows To Show']";
  public static sumRowData = "//div[@role='gridcell']//span//a";
  public static detailedViewRowData = "(//div[@col-id='ronumber'])[2]";
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
  public static solidHoursSpan = "//button[@id='soldhours_report']//span[1]";
  public static grossProfitSpan = "//button[@id='grossprofit_report']//span[1]";
  public static elrSpan = "//button[@id='elr_report']//span[1]";
  public static jobCountSpan = "//button[@id='jobcount_report']//span[1]";
  public static workMixSpan = "//button[@id='workmix_report']//span[1]";
}
