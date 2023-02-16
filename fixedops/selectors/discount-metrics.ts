export class DiscountMetricsSelector {
  public static discountSplMetricsLink = "button[id='Disc. & Special Metrics']";
  public static disMetricsLink = "a[id='Discount Metrics']";

  //public static MonthTrendTab =
  //"//*[@id='root']/div[2]/div/div/div/div/div[2]/div/div/div[2]/div/button[1]";

  public static MonthTrendTab = "(//button[@role='tab'])[3]";
  // public static MonthTrendTab =
  //   "(//button[@class='MuiButtonBase-root MuiTab-root MuiTab-textColorSecondary jss559 Mui-selected'])[1]";
  public static byServiceAdvisorTab = "//*[text()='By Service Advisor']";
  public static discountSummaryTab =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div/div/div[2]/div/button[3]";
  public static disSummaryHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/h4";

  public static servDataAsOf = "(//*[local-name()='p'])[1]";

  public static laborTab =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div[1]/div/div/div/button[1]";
  public static partsTab =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div[1]/div/div/div/button[2]";

  public static getDiscountTabs(id: number) {
    return `//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div[1]/div/div/div/button[${id}]`;
  }

  public static canvas_1 = "canvas[id='chart_1111']";
  public static canvas_2 = "canvas[id='chart_1113']";
  public static canvas_3 = "canvas[id='chart_1123']";
  public static canvas_4 = "canvas[id='chart_1115']";
  public static canvas_5 = "canvas[id='chart_1232']";
  public static canvas_6 = "canvas[id='chart_1164']";
  public static canvas_7 = "canvas[id='chart_1165']";

  public static chartAddRemBtn(id: number) {
    return `(//button[@id='Add-to-Favorites' or @id='Remove-from-Favorites'])[${id}]`;
  }

  public static canvas_serv_1 = "#chart-1114";
  public static canvas_serv_2 = "#chart-1125";
  public static canvas_serv_3 = "#chart-1124";
  public static canvas_serv_4 = "#chart-1126";

  public static chartByservAdvAddRemBtn(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[5]`;
  }

  public static navExpandCollapseDiv = "//*[@id='navelement']/ul/li[7]/div";
  public static advisorTechMetricsLi =
    "//*[@id='navelement']/ul/li[7]/div/div/div/ul/li";

  public static monthTrendChartDiv =
    "//div[@class='react-grid-item diagram-section cssTransforms']                     ";

  public static byServiceAdvisorChartDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div";

  public static monthCmpChartDiv =
    "div[class='MuiGrid-root diagram-section MuiGrid-item MuiGrid-grid-xs-6']";

  public static monthCategoryChartDiv =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div[2]/div";

  public static getMonthTrendChart(id: number) {
    return `(//canvas)[${id}]`;
  }
  public static getByServiceAdvisorChart(id: number) {
    return `//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]`;
  }
  public static discByservAdvViewDetailBtn(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[4]`;
  }
  public static getServAdvChart(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div`;
  }

  public static getMonthComparisonChart(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div`;
  }

  public static getMonthCategoryChart(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div`;
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
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }

  public static monthTrendChartNumber(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']//span)[${id}]`;
  }
  public static getChartName1(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span/label[1]`;
  }
  public static getChartDate1(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span/label[2]`;
  }
  public static getChartNum1(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span/label[3]`;
  }
  public static getChartName2(id: number) {
    return ` //*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[1]`;
  }

  public static getChartNum2(id: number) {
    return ` //*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[2]`;
  }

  public static month1Select =
    "(//*[@id='mui-component-select-group-by-type'])[1]";
  public static month2Select =
    "(//*[@id='mui-component-select-group-by-type'])[2]";
  public static advSelect =
    "(//*[@id='mui-component-select-group-by-type'])[2]";
  public static advSelectLi(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static getMonth(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }

  public static discountSummaryData = `//*[@id="data-tab"]`;

  public static monthTrendChartInfoIcon(id: number) {
    return `.react-grid-item:nth-child(${id}) > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path`;
  }
  public static bar(id: number) {
    return `(//*[local-name()='g']//*[local-name()='rect'])[${id}]`;
  }
  public static bar_2(id: number) {
    return `(//*[local-name()='g']//*[local-name()='g']//*[local-name()='path'])[${id}]`;
  }
  public static byServiceAdvChartInfoIcon(id: number) {
    return `.MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiPaper-root > .MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path`;
  }

  public static monthTrendChartExpandCollapseBtn(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }

  public static byServiceAdvChartExpandCollapseBtn(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[2]`;
  }

  public static monthCmpChartName(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[1]/span[1]
      `;
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
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";

  public static monthTrendViewDetailBtn(id: number) {
    return `//*[@id="view-details-${id}"]`;
  }
  public static discmonthTrendViewDetailBtn(id: number) {
    return `(//button[@title='View Details'])[${id}]`;
  }
  public static byServiceAdvViewDetailBtn(id: number) {
    return `//*[@id="view-details-${id}"]`;
  }
  public static byServiceViewDetailBtn(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[1]/div[2]/button[4]`;
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
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div[${id}]/div/div/div/div[1]/div[2]/button[5]
      `;
  }

  public static favLink = "//*[@id='Favorites']";

  public static monthTrendChart_1 = "#chart-1111";
  public static monthTrendChart_2 = "#chart-1123";
  public static monthTrendChart_3 = "#chart-1232";
  public static monthTrendChart_4 = "#chart-1113";
  public static monthTrendChart_5 = "#chart-1165";
  public static monthTrendChart_6 = "#chart-1115";
  public static monthTrendChart_7 = "#chart-1164";

  public static viewDetailBtn1 = "//*[@id='view-details-1234']";
  public static viewDetailBtn2 = "//*[@id='view-details-1113']";
  public static viewDetailBtn3 = "//*[@id='view-details-1123']";
  public static viewDetailBtn4 = "//*[@id='view-details-1115']";
  public static viewDetailBtn5 = "//*[@id='view-details-1232']";
  public static viewDetailBtn6 = "//*[@id='view-details-1236']";
  public static viewDetailBtn7 = "//*[@id='view-details-1165']";

  public static overallLaborSale =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[1]";
  public static overallLaborCost =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[2]";
  public static overalldiscount =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[3]";
  public static overallRoCount =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[5]";
  public static discRoCount =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[6]";
  public static discountedLaborSale =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[7]";
  public static dsicountedJobCount =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[9]";
  public static gpBefordisc =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[10]";
  public static gpAfterdisc =
    "(//div[@class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true']//h6)[11]";

  public static monthSelect =
    "(//div[@id='mui-component-select-group-by-type'])[1]";

  public static prevMonth =
    "(//ul[@class='MuiList-root MuiMenu-list MuiList-padding']//li)[12]";

  public static serviceadvisor =
    "(//div[@id='mui-component-select-group-by-type'])[12]";
  public static advisorSpan =
    "(//div[@class='MuiPaper-root MuiMenu-paper MuiPopover-paper MuiPaper-elevation8 MuiPaper-rounded'])[1]";

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
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[1]/div[1]/button";
  public static columnDataPanel =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[2]";
  public static filterToggleBtn =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[1]/div[2]/button";
  public static filterDataPanel =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]";
  public static dIcon = "#export-to-excel";
  public static detailedViewMonthSel =
    "div[id='mui-component-select-group-by-type']";
  public static detailedViewMonthSelectLi(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }

  public static advisorMetricsDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[2]/div/p";

  public static resetBtn = "#reset-layout";
  public static rankingPerRowCls =
    ".MuiGrid-root > .MuiPaper-root > .MuiGrid-root > .MuiGrid-root:nth-child(2) > div";

  public static techMetricsLink = "a[id='Tech Metrics']";

  public static technicalProductivityTab =
    "button[id='Technician Productivity']";
  public static technicalSummeryTab = "button[id='Technician Summary']";
  public static technicalDetailedViewTab =
    "button[id='Technician Detailed View']";

  public static technicianSelect =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div[1]/div/div/div/div";
  public static technicianSelectLi(id: number) {
    return `/html/body/div[2]/div[3]/ul/li[${id}]`;
  }

  public static technicianMonthTrendChart_1 = "#chart-1352";
  public static technicianMonthTrendChart_2 = "#chart-1345";
  public static technicianMonthTrendChart_3 = "#chart-1348";
  public static technicianMonthTrendChart_4 = "#chart-1347";

  public static technicianMonthTrendChartNames(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[1]/span[1]`;
  }

  public static technicianMonthTrendChartNumber(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[1]/span[2]/span`;
  }

  public static technicianMonthTrendChartExpColBtn(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[2]`;
  }

  public static technicianMonthTrendInfoIcon(id: number) {
    return `/html/body/div/div[2]/div/div/div/div[3]/div[2]/div[${id}]/div/div[1]/div[2]/button[3]`;
  }
  public static byServiceAdvisorChartName(id: number) {
    return `//*[@id='root']/div[2]/div/div/div/div/div[3]/div[${id}]/div/div[1]/div[1]/span[1]`;
  }

  public static byServiceAdvisorChartNumber(id: number) {
    return `//*[@id='root']/div[2]/div/div/div/div/div[3]/div[${id}]/div/div[1]/div[1]/span[2]`;
  }

  public static overviewContainer =
    ".MuiPaper-root > .MuiGrid-root:nth-child(3) > .MuiGrid-root:nth-child(1)";
  public static overviewContainer_2 =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div";
  public static canvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[2]";
  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static heading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static downloadBtn = "//*[@id='export-to-excel']";

  public static resetLayout = "//*[@id='reset-layout']";
  public static dataCircle(id: number) {
    return `(//*[local-name()='circle'])[${id}]`;
  }

  public static discanvas(id: number) {
    return `(//canvas)[${id}]`;
  }
  public static canvasName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }
  public static dataTable = "div[id='data-tab']";
  public static pageHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static tabNames(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div[2]/div/div/div/button[${id}]/span[1]/div`;
  }
  public static getServiceAdvCanvas(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div[2]/div[${id}]/div/div/div[2]/div/div`;
  }
  public static overviewText =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div[1]/div[1]/span[1]";
  public static servAdvCanvas =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[2]/div/div/div[2]";
  public static servoverviewText =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div/div/div[1]";
  public static overviewServiceContainer =
    ".MuiPaper-root > div > .diagram-section:nth-child(1) > .MuiPaper-root";

  public static chartTabBtn_1 = "button[id='chartid-1111']";
  public static chartTabBtn_2 = "button[id='chartid-1113']";
  public static chartTabBtn_3 = "button[id='chartid-1123']";
  public static chartTabBtn_4 = "button[id='chartid-1115']";
  public static chartTabBtn_5 = "button[id='chartid-1232']";
  public static chartTabBtn_6 = "button[id='chartid-1164']";
  public static chartTabBtn_7 = "button[id='chartid-1165']";

  public static backButton(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[4]/div[${id}]/div/div[1]/div[2]/button[6]`;
  }

  public static expandBtn(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static dialogBox = "div[role='dialog']";
  public static collapseButton =
    "/html/body/div[3]/div[3]/div/div/form/div/div[1]/div[2]/button[2]";
  public static chartsDiv(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[4]/div[${id}]`;
  }
  public static noDataAlertMsg(id: string) {
    return `//div[@id='${id}']`;
  }
  public static noDataSpan(id: number) {
    return `(//*[text()='No data to display'])[${id}]`;
  }
}
