export class CpSelectors {
  public static cpsummary = "button[id='Customer Pay']";
  public static cpLi = "//*[@id='navelement']/ul/li[4]/div/div/div/ul/li";
  public static cpOverview = "a[id='Summary Overview']";
  public static cpOvrHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";

  // public static laborDataAsOf =
  //   "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";

  public static cpDataAsOf = "(//*[local-name()='p'])[1]";

  public static canvas_1 = "canvas[id='chart_942']";
  public static canvas_2 = "canvas[id='chart_939']";
  public static canvas_3 = "canvas[id='chart_940']";
  public static canvas_4 = "canvas[id='chart_920']";
  public static canvas_5 = "canvas[id='chart_946']";
  public static canvas_6 = "canvas[id='chart_1238']";

  public static cpEc = "//*[@id='navelement']/ul/li[4]/div";
  public static viewDetailBtn1 = "button[id='view-details-942']";
  public static viewDetailBtn2 = "#view-details-939";
  public static viewDetailBtn3 = "#view-details-940";
  public static viewDetailBtn4 = "#view-details-920";
  public static viewDetailBtn5 = "#view-details-946";
  public static viewDetailBtn6 = "#view-details-1238";

  public static toggleBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div/label/span[1]/span[1]/span[1]/input";
  public static partialMonSpan =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div/label/span[2]";

  public static expandX(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static expandCls =
    "div[class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12']";
  public static collapseX = "//button[@title='Collapse']";
  public static popup = "/html/body/div[2]/div[3]/div/div";

  public static addTofavBtn(id: number) {
    return `(//button[@id='Add-to-Favorites' or @id='Remove-from-Favorites'])[${id}]`;
  }
  public static favNavLink = "//*[@id='Favorites']";
  public static resetBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn']";

  public static showHideDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div";

  public static infoIcon(id: number) {
    return `(//*/div[2]/button[3])[${id}]`;
  }

  public static chartNames(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }

  public static chartNumbers(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']//span)[${id}]`;
  }
  public static resetDragBtn = "button[id='reset-layout']";
  public static favLink = "//*[@id='Favorites']";
  public static getChart(id: number) {
    return `.MuiPaper-root > .react-grid-layout > .react-grid-item:nth-child(${id}) > .MuiPaper-root`;
  }
  //detail page
  public static cpRevenueCalculation =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div";
  public static getRevenueGraphs(id: number) {
    return `/html/body/div/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[2]/canvas`;
  }
  public static cpRevenueGraphLen =
    "/html/body/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/canvas";

  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  ///selectors

  public static overviewContainer = "div[class='scrollbar-container ps']";

  public static chartDiv =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div/div/div[2]/canvas";

  public static charts(id: number) {
    return `/html/body/div/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[2]/canvas`;
  }

  public static dataTable = "div[id='data-tab']";
  public static dataContainer =
    "div[class='MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-3']";
  public static rowData =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[9]";

  public static tglBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[3]/td[2]/span/span[2]/button";

  public static opcodeDetailViewTab = "button[id='Opcode - Detailed View']";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";

  public static canvasDiv =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div/div/div[2]/canvas";

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
  public static pageHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static getLi(id: number) {
    return `//*[@id='navelement']/ul/li[4]/div/div/div/ul/li[${id}]`;
  }
  public static getCanvas(id: number) {
    return `(//canvas)[${id}]`;
  }
  public static garndTotalElement(id: number) {
    return `(//h6[@class='MuiTypography-root MuiTypography-subtitle1'])[${id}]`;
  }
  public static getCanvasName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock'])[${id}]`;
  }
  public static getCanvasId(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']//span)[${id}]`;
  }
  public static advisor = "//button//span[text()='Service Advisors']";
  public static advisorSpan =
    "span[class='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1']";
  public static checkBox(id: number) {
    return `(//li//label//span//span//input)[${id}]`;
  }
  public static filterBtn = "//button//span[text()='Apply Filter']";
}
