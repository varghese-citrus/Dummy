export class AdvisorTechMetricsSelector {
  public static advisorTechMetricsLink = "button[id='Advisor & Tech Metrics']";
  public static advisorMetricsLink = "a[id='Advisor Metrics']";

  public static serviceAdvisorPerformanceTab =
    "//button[@id='Service Advisor Performance']";
  public static serviceAdvisorSummaryTab =
    "//button[@id='Service Advisor Summary']";
  public static serviceAdvisorDetailedViewTab =
    "//button[@id='Service Advisor Detailed View']";

  public static MonthTrendTab =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[1]/div/div/div/button[1]";
  public static comparisonByMonthTab =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[1]/div/div/div/button[2]";
  public static categoryByMonthTab =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[1]/div/div/div/button[3]";

  public static navExpandCollapseDiv = "//*[@id='navelement']/ul/li[7]/div";
  public static advisorTechMetricsLi =
    "//*[@id='navelement']/ul/li[7]/div/div/div/ul/li";

  public static monthTrendChartDiv =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div/div";

  public static monthCmpChartDiv =
    "div[class='MuiGrid-root diagram-section MuiGrid-item MuiGrid-grid-xs-6']";

  public static monthCategoryChartDiv =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div[2]/div";

  public static getMonthTrendChart(id: number) {
    return `(//*[@class='apexcharts-svg'])[${id}]`;
  }

  public static getMonthComparisonChart(id: number) {
    return `(//*[@class='apexcharts-svg'])[${id}]`;
  }

  public static getMonthCategoryChart(id: number) {
    return `(//*[@class='apexcharts-svg'])[${id}]`;
  }

  public static monthComparisonSel_1 =
    "(//*[@id='mui-component-select-group-by-type'])[1]";
  public static monthComparisonSel_2 =
    "(//*[@id='mui-component-select-group-by-type'])[2]";

  public static monthSelectLi(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }

  public static monthCategorySel =
    "//*[@id='mui-component-select-group-by-type']";

  public static laborMonthlyTableHeading =
    ".MuiGrid-root > .MuiPaper-root:nth-child(1) > .MuiGrid-root > .MuiGrid-root > .MuiTypography-root";

  public static laborSale = "#SA_lbrsale_report";
  public static soldHours = "#SA_soldhours_report";
  public static jobCount = "#SA_jobcount_report";
  public static profit = "#SA_profit_report";
  public static elr = "#SA_elr_report";
  public static roCount = "#SA_rocount_report";

  public static partsMonthlyTableHeading =
    ".MuiGrid-root > .MuiPaper-root:nth-child(2) > .MuiGrid-root > .MuiGrid-root > .MuiTypography-root";

  public static partsSale = "#SA_prtssale_report";
  public static partsCost = "#SA_prtscost_report";
  public static partsProfit = "#SA_prtsprofit_report";
  public static markup = "#SA_markup_report";

  public static monthTrendChartName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock'])[${id}]`;
  }

  public static monthTrendChartNumber(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock'])[${id}]`;
  }

  public static monthTrendChartInfoIcon(id: number) {
    return `.MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path`;
  }

  public static monthTrendChartExpandCollapseBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[2]`;
  }

  public static monthCmpChartName(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[1]`;
  }

  public static monthCmpChartNumber(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[2]/span`;
  }

  public static monthCmpChartInfoIcon(id: number) {
    return `.MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path`;
  }

  public static monthCmpChartExpandCollapseBtn(id: number) {
    return ` /html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[2]`;
  }

  public static monthCategoryChartName(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[1]/div[1]/span[1]
    `;
  }

  public static monthCategoryChartNumber(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[1]/div[1]/span[2]/span`;
  }

  public static monthCategoryChartInfoIcon(id: number) {
    return `//*[@id="chart-${id}"]/div[1]/div[2]/button[3]`;
  }

  public static monthCategoryChartExpandCollapseBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[1]/div[2]/button[2]`;
  }

  public static popup = "div[role='dialog']";
  public static collapseBtn =
    ".MuiBox-root > .MuiGrid-root > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(2)";

  public static monthTrendViewDetailBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[4]`;
  }

  public static monthCmpViewDetailBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[4]`;
  }

  public static monthCategoryViewDetailBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[1]/div[2]/button[4]`;
  }

  public static monthTrendAddRemBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[5]`;
  }

  public static monthCmpAddRemBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[5]`;
  }

  public static monthCategoryAddRemBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[1]/div[2]/button[5]`;
  }

  public static favLink = "//*[@id='Favorites']";

  public static monthTrendChart_1 = "#chart-1276";
  public static monthTrendChart_2 = "#chart-1277";
  public static monthTrendChart_3 = "#chart-1278";
  public static monthTrendChart_4 = "#chart-1279";
  public static monthTrendChart_5 = "#chart-1280";
  public static monthTrendChart_6 = "#chart-1281";
  public static monthTrendChart_7 = "#chart-1282";
  public static monthTrendChart_8 = "#chart-1283";
  public static monthTrendChart_9 = "#chart-1284";
  public static monthTrendChart_10 = "#chart-1285";
  public static monthTrendChart_11 = "#chart-1286";
  public static monthTrendChart_12 = "div[id='chart-1315']";

  public static monthCmpCollapseBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";

  public static monthCategoryCollapseBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";

  public static monthCmpChart_1 = "#chart-1287";
  public static monthCmpChart_2 = "#chart-1288";
  public static monthCmpChart_3 = "#chart-1289";
  public static monthCmpChart_4 = "#chart-1290";
  public static monthCmpChart_5 = "#chart-1291";
  public static monthCmpChart_6 = "#chart-1292";
  public static monthCmpChart_7 = "#chart-1293";
  public static monthCmpChart_8 = "#chart-1294";
  public static monthCmpChart_9 = "#chart-1295";
  public static monthCmpChart_10 = "#chart-1296";
  public static monthCmpChart_11 = "#chart-1297";
  public static monthCmpChart_12 = "#chart-1298";

  public static monthCatChart_1 = "#chart-1299";
  public static monthCatChart_2 = "#chart-1300";
  public static monthCatChart_3 = "#chart-1301";
  public static monthCatChart_4 = "#chart-1302";
  public static monthCatChart_5 = "#chart-1303";
  public static monthCatChart_6 = "#chart-1304";
  public static monthCatChart_7 = "#chart-1305";
  public static monthCatChart_8 = "#chart-1306";
  public static monthCatChart_9 = "#chart-1307";
  public static monthCatChart_10 = "#chart-1308";

  public static dataTabReports = "div[id='data-tab-reports']";
  public static rankingPerRow =
    "//*[@id='monthlyRankedTables']/div/div[2]/div/div[2]/div";
  public static downloadIcon =
    "//*[@id='monthlyRankedTables']/div/div[2]/div/div[2]/a";

  public static dataTab = "div[id='data-tab']";
  public static columnToggleBtn =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[1]/div[1]/button";
  public static columnDataPanel =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[2]/div[2]";
  public static filterToggleBtn =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[1]/div[2]/button";
  public static filterDataPanel =
    "//*[@id='data-tab']/div/div/div[2]/div[3]/div[3]/div[2]/div[2]";
  public static dIcon = "#export-to-excel";
  public static detailedViewMonthSel =
    "div[id='mui-component-select-group-by-type']";
  public static detailedViewMonthSelectLi(id: number) {
    return `(//li[@class='MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'])[${id}]`;
  }

  public static advisorMetricsDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div/p";

  public static resetBtn = "#reset-layout";
  public static rankingPerRowCls =
    ".MuiGrid-root > .MuiPaper-root > .MuiGrid-root > .MuiGrid-root:nth-child(2) > div";

  public static techMetricsLink = "a[id='Tech Metrics']";

  public static technicianProductivityTab =
    "button[id='Technician Productivity']";
  public static technicianSummeryTab = "button[id='Technician Summary']";
  public static technicianDetailedViewTab =
    "button[id='Technician Detailed View']";

  public static monthTrendTab =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[1]/div/div/div/button[1]";
  public static monthCmpTab =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[1]/div/div/div/button[2]";

  public static technicianSelect =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div[1]/div/div/div/div";
  public static technicianSelectLi(id: number) {
    return `/html/body/div[2]/div[3]/ul/li[${id}]`;
  }
  public static technicianMonthTrendChart_1 = "div[id='chart-1352']";
  public static technicianMonthTrendChart_2 = "div[id='chart-1345']";
  public static technicianMonthTrendChart_3 = "div[id='chart-1348']";
  public static technicianMonthTrendChart_4 = "div[id='chart-1347']";

  public static technicianMonthTrendChartNames(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock'])[${id}]`;
  }

  public static technicianMonthTrendChartNumber(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock'])[${id}]`;
  }

  public static technicianMonthTrendChartExpColBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[2]`;
  }

  public static technicianMonthTrendInfoIcon(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[3]`;
  }
  public static technicianMonthTrendViewDetailBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[4]`;
  }
  public static technicianMonthTrendAddRemBtn(id: number) {
    return `(//button[@id='Add-to-Favorites' or @id='Remove-from-Favorites'])[${id}]`;
  }

  public static techMetricsMonthlyTableHeading =
    "//*[@id='monthlyRankedTables']/div/div/div/div/h6";
  public static techMetricsMonthlyTables =
    "//*[@id='monthlyRankedTables']/div/div/div/div/h6";

  public static techSolidHoursAll = "#allsoldhrs_report";
  public static techSolidHoursGp = "#flatratehrs_report";

  public static techRaningPerRow =
    "//*[@id='monthlyRankedTables']/div/div/div/div[2]/div";

  public static cmpMonthSelect_1 =
    "(//div[@id='mui-component-select-group-by-type'])[1]";
  public static cmpMonthSelect_2 =
    "(//div[@id='mui-component-select-group-by-type'])[2]";

  public static cmpMonthChart_1 = "#chart-1264";
  public static cmpMonthChart_2 = "#chart-1265";
  public static cmpMonthChart_3 = "#chart-1349";
  public static cmpMonthChart_4 = "#chart-1350";

  public static technicianSummeryColumnBtn =
    "//*[@id='data-tab-tech-summary']/div/div/div[2]/div[3]/div[1]/div/button";

  public static technicianSummeryColumnDataPanel =
    "//*[@id='data-tab-tech-summary']/div/div/div[2]/div[3]/div[2]/div[2]/div";

  public static technicianDataTable = "#data-tab-tech-summary";
  public static technicianMonthTrendCollapseBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";

  public static technicianMonthCmpChart_1 = "#chart-1264";
  public static technicianMonthCmpChart_2 = "#chart-1265";
  public static technicianMonthCmpChart_3 = "#chart-1349";
  public static technicianMonthCmpChart_4 = "#chart-1350";

  public static technicianMonthCmpChartNames(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[1]`;
  }

  public static technicianMonthCmpChartNumber(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[2]/span`;
  }

  public static technicianMonthCmpChartExpColBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[2]`;
  }

  public static technicianMonthCmpInfoIcon(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[3]`;
  }
  public static technicianMonthCmpViewDetailBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[4]`;
  }
  public static technicianMonthCmpAddRemBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[5]`;
  }

  public static technicianMonthCmpCollapseBtn = "button[title='Collapse']";

  public static techMetricsDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div/p";

  public static monthTrendCanvasDiv =
    "/html/body/div/div[2]/div/div/div/div[3]/div[2]/div/div/div[2]/div/div ";

  public static getMonthTrendCavas(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[2]/div/div`;
  }

  public static getMonthCmpCavas(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[2]/div/div`;
  }

  public static monthlyTableDataEl(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[1]/div[2]/div/button[${id}]`;
  }
  public static overviewContainer =
    ".MuiPaper-root > .MuiGrid-root:nth-child(3) > .MuiGrid-root:nth-child(1)";
  public static canvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[2]/div/div";
  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static dataCircle(id: number) {
    return `(//*[local-name()='circle'])[${id}]`;
  }
  public static serAdvPerDataAsOf = "(//*[local-name()='p'])[1]";
  public static serAdvPerResetBtn = "//*[@id='reset-layout']";
  public static serAdvPerDownloadIcon = "//*[@id='export-to-excel']";
  public static serAdvPerDataTable = "div[id='data-tab']";
  public static serAdvPerMonthlyTables(id: number) {
    return `/html/body/div/div[1]/div/div/div/div[2]/div/div[1]/div/div/div/button[${id}]`;
  }
  public static serAdvPerPartsMonthlyTable(id: number) {
    return `/html/body/div/div[1]/div/div/div/div[2]/div/div[2]/div/div/div/button[${id}]`;
  }
  public static serAdvPerRowData =
    ".ag-center-cols-container > .ag-row:nth-child(8) > .ag-cell > span > a";

  public static serAdvDetailViewTab =
    "button[id='Service Advisor Detailed View']";
  public static serAdvDetailViewTabRowData =
    ".ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell:nth-child(9)";

  public static advisorSelect = "(//span[text()='Service Advisors'])[1]";
  public static advisorSelectCheckBox(id: number) {
    return `//*[@id='service-advisor-list']/div[3]/ul/div/div[1]/div[1]/li[${id}]/label/span[1]/span[1]/input`;
  }
  public static advisorSelectFilterBtn =
    "//*[@id='service-advisor-list']/div[3]/ul/div/div[2]/button[2]";
  public static circle(id: number) {
    return `(//*[local-name()='circle'])[${id}]`;
  }
  public static alertMsg =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div[1]/div/div/div/div[2]";

  public static monthCmpCanvasDiv =
    "/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div/div/div[2]/div/div";
  public static monthCmpOverviewCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div[2]/div/div";
  public static bar(id: number) {
    return `(//*[local-name()='div']//*[local-name()='svg']//*[local-name()='g']//*[local-name()='g']//*[local-name()='g']//*[local-name()='path'])[${id}]`;
  }
  public static summaryRowData =
    ".ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell > span > a";

  public static getMonthCatCanvas(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[2]/div/div`;
  }
  public static monthCatOverviewCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div/div";
  public static techMetricsGraphs(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div[3]/div[2]/div[${id}]`;
  }
  public static techMetricsCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[2]/div/div";
  public static techMetricsCircle(id: number) {
    return `(//*[local-name()='g']//*[local-name()='circle'])[${id}]`;
  }
  public static techMetricsBar(id: number) {
    return `(//*[local-name()='g']//*[local-name()='path'])[${id}]`;
  }
  public static techPerDataAsOf =
    "/html/body/div[1]/div[2]/div/div/div/div[1]/div/div[2]/div/p";
  public static techPerResetBtn = "//*[@id='reset-layout']";
  public static techPerDownloadBtn = "//*[@id='export-to-excel']";
  public static techPerMonthlyTableSpan =
    "//*[@id='monthlyRankedTables']/div/div/div/div/h6";
  public static techPerMonthlyTableTab_1 = "//*[@id='allsoldhrs_report']";
  public static techPerMonthlyTableTab_2 = "//*[@id='flatratehrs_report']";
  public static techPerTechNumSelect =
    "//*[@id='mui-component-select-group-by-type']";
  public static techPerDataTable = "div[id='data-tab-tech-summary-drilldown']";
  public static techPerSummaryRowData =
    "//*[@id='data-tab-tech-summary-drilldown']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[5]/span/a";
  public static techPerDetailedViewDataTable = "div[id='data-tab']";
  public static techPerDetailedViewRowData =
    ".ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell:nth-child(1)";
  public static techMetricsCmpCanvas =
    "/html/body/div/div[2]/div/div/div/div/div[2]/div[2]/div/div/div[2]/div/div";
  public static techMetricsCmpViewDetailBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[4]`;
  }
  public static techMetricsCmpOverviewContainer =
    "div[class='scrollbar-container ps']";
  public static summaryTab = "button[id='Service Advisor Summary']";
  public static alertMessage = "div[class='MuiAlert-message']";
  public static noDataAlertMsg(id: string) {
    return `//div[@id='${id}']`;
  }
  public static roCountValue = "(//button//span//h6)[1]";
  public static jobCountValue = "(//button//span//h6)[2]";
  public static hoursSoldValue = "(//button//span//h6)[3]";
  public static laborSaleValue = "(//button//span//h6)[4]";
  public static partsSaleValue = "(//button//span//h6)[5]";
  public static laborCostValue = "(//button//span//h6)[6]";
  public static partsCostValue = "(//button//span//h6)[7]";
  public static laborGpValue = "(//button//span//h6)[8]";
  public static partsGpValue = "(//button//span//h6)[9]";

  public static advisor = "//button//span[text()='Service Advisors']";
  public static advisorSpan =
    "span[class='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1']";
  public static checkBox(id: number) {
    return `(//li//label//span//span//input)[${id}]`;
  }
  public static filterBtn = "//button//span[text()='Apply Filter']";
  public static opFilterBtn =
    "(//button[@class='ag-floating-filter-button-button'])[5]";
  public static selectAllCheckBox =
    "(//div[@class='ag-set-filter-item-checkbox ag-labeled ag-label-align-right ag-checkbox ag-input-field'])[1]";
  public static competitiveCheckBox =
    "(//div[@class='ag-set-filter-item-checkbox ag-labeled ag-label-align-right ag-checkbox ag-input-field'])[2]";
  public static maintenanceCheckBox =
    "(//div[@class='ag-set-filter-item-checkbox ag-labeled ag-label-align-right ag-checkbox ag-input-field'])[3]";
  public static repairCheckBox =
    "(//div[@class='ag-set-filter-item-checkbox ag-labeled ag-label-align-right ag-checkbox ag-input-field'])[4]";
  public static technicianSpan = "span[class='ag-set-filter-item-value']";
  public static technicianFilterButton =
    "(//button[@class='ag-floating-filter-button-button'])[1]";
  public static technicianCheckBox(id: number) {
    return `(//div[@class='ag-set-filter-item-checkbox ag-labeled ag-label-align-right ag-checkbox ag-input-field'])[${id}]`;
  }
  public static technicianSearch = "(//input[@placeholder='Search...'])[3]";
}
