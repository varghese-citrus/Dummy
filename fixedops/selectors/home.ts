export class HomeSelectors {
  public static home = "//*[@id='Home']/span[1]";
  public static scoreCard = "div[id='kpiScoreCards']";
  public static chartContainer_1 = "div[id='chartContainer_1341']";
  public static chartContainer_2 = "#chartContainer_1342";
  public static chartContainer_3 = "#chartContainer_1343";
  public static chartContainer_4 = "div[id='chartContainer_1335']";
  public static chartContainer_5 = "#chartContainer_1339";
  public static chartContainer_6 = "div[id='chartContainer_1336']";
  public static chartContainer_7 = "#chartContainer_1337";
  public static chartContainer_8 = "div[id='chartContainer_1338']";
  public static chartContainer_9 = "#chartContainer_1351 > div > div > div";
  public static chartContainer_10 = "div[id='chartContainer_1344']";
  public static chartContainer_11 = "div[id='chartContainer_1340']";
  public static chartContainer_12 = "div[id='chartContainer_1346']";
  public static chartContainer_13 = "div[id='chartContainer_1353']";

  public static logo = "img[src='/images/logos/armatus-new-logo.png']";
  public static notificationIcon =
    ".MuiButtonBase-root > .MuiButton-label > .MuiBadge-root > .MuiSvgIcon-root > path";
  public static storeChangeButton = "svg[title='Change Store']";
  public static favorites =
    "#navelement > .MuiList-root > .MuiListItem-root > #Favorites > .MuiButton-label";

  public static visualization_btn_1 =
    "//*[@id='kpiScoreCards']/div[1]/div/div[1]/div[2]/h6/span[2]/span[2]/button/span[1]";
  public static visualization_btn_2 =
    "//*[@id='kpiScoreCards']/div[1]/div/div[2]/div[2]/h6/span[2]/span[2]/button/span[1]";
  public static visualization_btn_3 =
    "//*[@id='kpiScoreCards']/div[1]/div/div[3]/div[2]/h6/span/span[2]/button/span[1]";
  public static visualization_btn_4 =
    "//*[@id='kpiScoreCards']/div[1]/div/div[4]/div[2]/h6/span/span[2]/button/span[1]";
  public static visualization_btn_5 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[1]/h6/span[3]/span[2]/button";

  public static visualization_btn_6 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[2]/div[1]/h6/span[3]/span[2]/button/span[1]";
  public static visualization_btn_7 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[2]/div[3]/h6/span[3]/span[2]/button/span[1]";
  public static visualization_btn_8 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[3]/h6/span[3]/span[2]/button";
  public static visualization_btn_9 =
    "//*[@id='kpiScoreCards']/div[3]/div/div[1]/div[2]/h6/span/span[2]/button/span[1]";
  public static visualization_btn_10 =
    "//*[@id='kpiScoreCards']/div[3]/div/div[2]/div[2]/h6/span/span[2]/button/span[1]";
  public static visualization_btn_11 =
    "//*[@id='kpiScoreCards']/div[3]/div/div[3]/div[2]/h6/span/span[2]/button/span[1]";
  public static visualization_btn_12 =
    "//*[@id='kpiScoreCards']/div[3]/div/div[4]/div[2]/h6/span/span[2]/button/span[1]";

  public static expandCollapse = "button[id='Expand/Collapse']";
  public static getLi(num: number) {
    return `//*[@id="navelement"]/ul/li[${num}]`;
  }

  public static detailBtn_1 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[1]/span/button";

  public static detailBtn_2 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[3]/span/button";

  public static viewMissesBtn1 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[2]/div[1]/h5/span[8]/button";

  // public static detailBtn_3 =
  //   "//*[@id='kpiScoreCards']/div[2]/div/div[2]/div[3]/h5/span[7]/span[1]/button/span[1]";

  public static viewMissesBtn2 =
    "//*[@id='kpiScoreCards']/div[2]/div/div[2]/div[3]/h5/span[7]/span[1]/button";

  public static radioBtn1 = "(//*[@id='0'])[1]";

  public static radioBtn2 = "(//*[@id='1'])[1]";

  public static radioBtn3 = "(//*[@id='0'])[2]";

  public static radioBtn4 = "(//*[@id='1'])[2]";

  public static specialMetricHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";

  public static laborTargetHeading =
    "//*[@id='root']/div[2]/div/div/div[2]/div/div[2]/h4";

  public static partsTargetHeading =
    "//*[@id='root']/div[2]/div/div/div[2]/div/div[2]/h4";

  public static backBtnId(id?: string) {
    return `//*[@id="${id}"]/button`;
  }
  public static h5 = "//*[@id='root']/header/div/div[2]/h5";

  public static missestitles =
    "//*[@id='root']/div[2]/div/div/div[2]/div/div[2]/h4";

  public static pageHeading =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/h4";

  public static monthToggle =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div[2]/div/div/div";

  public static dataAsOf =
    "p[class='MuiTypography-root date-asof MuiTypography-body1 MuiTypography-colorSecondary MuiTypography-alignRight']";

  public static defaultToggle = "input[value='MTD']";
  public static toggleLi = "//*[@id='menu-']/div[3]/ul/li";
  public static toggleBtn =
    "div[class='MuiInputBase-root MuiOutlinedInput-root selectedToggle MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense']";

  public static KpiScrTitle =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/h4";

  public static processingEle =
    "div[class='MuiGrid-root jss434 MuiGrid-justify-content-xs-center']";
  public static noDataDisplay = "//*[@id='root']/div[2]/div/div/div/div[2]";
  // public static expandedViewBtn =
  //   "#root > div > div > div > div > div > div > div.main-title-kpi > div:nth-child(2) > button";
  public static noDataDisplayDiv = "//*[text()='No Data to Display']";
  public static expandedChartContanier_1 =
    "div[id='chartContainerExtended_1341']";
  public static expandedChartContanier_2 =
    "div[id='chartContainerExtended_1342']";
  public static expandedChartContanier_3 =
    "div[id='chartContainerExtended_1343']";
  public static expandedChartContanier_4 =
    "div[id='chartContainerExtended_1339']";
  public static expandedChartContanier_5 =
    "div[id='chartContainerExtended_1337']";
  public static expandedChartContanier_6 =
    "div[id='chartContainerExtended_1346']";
  public static expandedChartContanier_7 =
    "div[id='chartContainerExtended_1353']";
  public static expandedChartContanier_8 =
    "div[id='chartContainerExtended_1338']";
  public static expandedChartContanier_9 =
    "div[id='chartContainerExtended_1351']";
  public static expandedChartContanier_10 =
    "div[id='chartContainerExtended_1336']";
  public static expandedChartContanier_11 =
    "div[id='chartContainerExtended_1335']";
  public static expandedChartContanier_12 =
    "div[id='chartContainerExtended_1344']";
  public static expandedChartContanier_13 =
    "div[id='chartContainerExtended_1340']";
  public static noData = "//div[text()='No Data to Display']";
  public static lastThreeMonthLi = "//*[@id='menu-']/div[3]/ul/li[6]";
  public static dataAsOfXpath = "//p[contains(text(),'Data as of')]";
  //"//*[@id='root']/div[2]/div/div/div/div[1]/div/div[1]/div[2]/p";
  public static tglBtnLi(id: number) {
    return `//*[@id='menu-']/div[3]/ul/li[${id}]`;
  }
  public static standardViewBtn = "//*[text()='Standard View']";
  public static expandedViewBtn = "//*[text()='Expanded View']";

  public static kpiSummaryBlock =
    "div[class='MuiCardContent-root kpi-summary-block']";
  public static laborsalesperop = "(//div//h5//span[2])[1]";
  public static laborgpeprro =
    "//*[@id='kpiScoreCards']/div[1]/div/div[1]/div[2]/h5/text()[3]";
  public static laborgppercentage = "(//div//h5//span[6])[1]";
  public static laborsales =
    "//*[@id='kpiScoreCards']/div[1]/div/div[1]/div[2]/p/text()[2]";
  public static laborgp =
    "//*[@id='kpiScoreCards']/div[1]/div/div[1]/div[2]/p/text()[6]";
  public static partssalesperop =
    "//*[@id='kpiScoreCards']/div[1]/div/div[2]/div[2]/h5/text()[1]";
  public static partsgpeprro =
    "//*[@id='kpiScoreCards']/div[1]/div/div[2]/div[2]/h5/text()[4]";
  public static partsgppercentage = "(//div//div[2]//h5//span[5])[2]";
  public static partssales =
    "//*[@id='kpiScoreCards']/div[1]/div/div[2]/div[2]/p/text()[2]";
  public static partsgp =
    "//*[@id='kpiScoreCards']/div[1]/div/div[2]/div[2]/p/text()[6]";
  public static combsalesperro =
    "//*[@id='kpiScoreCards']/div[1]/div/div[3]/div[2]/h5/span/text()[1]";
  public static combgpperro =
    "//*[@id='kpiScoreCards']/div[1]/div/div[3]/div[2]/h5/span/text()[4]";
  public static combsales =
    "//*[@id='kpiScoreCards']/div[1]/div/div[3]/div[2]/p/text()[2]";
  public static combgp =
    "//*[@id='kpiScoreCards']/div[1]/div/div[3]/div[2]/p/text()[6]";
  public static allsoldhours = "(//div//div[4]//div[2]//h5//span)[1]";
  public static toggleSelect =
    "div[class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense']";
  public static lastMonthToggle = "//li[@data-value='LMONTH']";
  public static advisor = "//button//span[text()='Service Advisors']";
  public static advisorSpan =
    "span[class='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1']";
  public static checkBox(id: number) {
    return `(//li//label//span//span//input)[${id}]`;
  }
  public static filterBtn = "//button//span[text()='Apply Filter']";
}
