export class LaborSelectors {
  // public static labor =
  //   "#navelement > .MuiList-root > .MuiListItem-root > #Labor > .MuiButton-label";
  public static labor = "button[id='Labor']";
  public static laborLi = "//*[@id='navelement']/ul/li[5]/div/div/div/ul/li";
  public static getLi(id: number) {
    return `//*[@id='navelement']/ul/li[5]/div/div/div/ul/li[${id}]`;
  }
  public static laborOverview =
    ".MuiList-root > .MuiListItem-root > #Labor\\ Overview > .MuiButton-label > .MuiSvgIcon-root";
  public static loborOvrHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";

  public static laborDataAsOf = "(//*[local-name()='p'])[1]";

  public static canvas_1 = "canvas[id='chart_960']";
  public static canvas_2 = "canvas[id='chart_944']";
  public static canvas_3 = "canvas[id='chart_1073']";
  public static canvas_4 = "canvas[id='chart_1133']";
  public static canvas_5 = "canvas[id='chart_1127']";
  public static canvas_6 = "canvas[id='chart_1044']";
  public static canvas_7 = "canvas[id='chart_1098']";
  public static canvas_8 = "canvas[id='chart_1356']";
  public static canvas_9 = "canvas[id='chart_1138']";
  public static canvas_10 = "canvas[id='chart_918']";
  public static canvas_11 = "canvas[id='chart_955']";

  public static laborEc = "//*[@id='navelement']/ul/li[5]/div";
  public static viewDetailBtn1 = "button[id='view-details-960']";
  public static viewDetailBtn2 = "#view-details-944";
  public static viewDetailBtn3 = "#view-details-1073";
  public static viewDetailBtn4 = "#view-details-1133";
  public static viewDetailBtn5 = "#view-details-1127";
  public static viewDetailBtn6 = "#view-details-1044";
  public static viewDetailBtn7 = "#view-details-1098";
  public static viewDetailBtn8 = "#view-details-1138";
  public static viewDetailBtn9 = "#view-details-918";
  public static viewDetailBtn10 = "#view-details-955";

  public static toggleBtn = "button[id='partialMonthToggle']";
  public static toggleSpan = "(//button[@id='partialMonthToggle']//span)[1]";
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
    return `(//button[@title='Add to Favorites' or @title='Remove from Favorites'])[${id}]`;
  }
  public static favNavLink = "//*[@id='Favorites']";
  public static resetBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn']";

  public static showHideDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div";

  public static infoIcon(id: number) {
    return `(//*//div[2]/button[3])[${id}]`;
  }

  public static chartNames(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }

  public static chartNumbers(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']//span)[${id}]`;
  }

  public static getChart(id: number) {
    return `.MuiPaper-root > .react-grid-layout > .react-grid-item:nth-child(${id}) > .MuiPaper-root`;
  }

  public static overviewContainer =
    ".MuiGrid-root > .MuiGrid-root > .MuiPaper-root > .scrollbar-container > .MuiCardContent-root";

  public static chartDiv =
    "/html/body/div[1]/div[2]/div/div/div/div/div[2]/div/div/div[2]/canvas";

  public static charts(id: number) {
    return `/html/body/div/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[2]/canvas`;
  }

  public static canvas(id: number) {
    return `.MuiPaper-root > .MuiGrid-root > .MuiGrid-root:nth-child(${id}) > .MuiPaper-root > .MuiCardContent-root`;
  }
  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";

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

  public static canvasDiv = "//canvas";

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

  public static overviewChartName(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[1]/div/span[1]`;
  }

  public static chartsDiv(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[3]/div[${id}]`;
  }

  public static chartTabBtn_1 = "button[id='chartid-960']";
  public static chartTabBtn_2 = "button[id='chartid-944']";
  public static chartTabBtn_3 = "button[id='chartid-1073']";
  public static chartTabBtn_4 = "button[id='chartid-1133']";
  public static chartTabBtn_5 = "button[id='chartid-1127']";
  public static chartTabBtn_6 = "button[id='chartid-1044']";
  public static chartTabBtn_7 = "button[id='chartid-1098']";
  public static chartTabBtn_8 = "button[id='chartid-1356']";
  public static chartTabBtn_9 = "button[id='chartid-1138']";
  public static chartTabBtn_10 = "button[id='chartid-918']";
  public static chartTabBtn_11 = "button[id='chartid-955']";

  public static backButton(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[3]/div[${id}]/div/div[1]/div[2]/button[6]`;
  }
  public static expandBtn(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static dialogBox = "div[role='dialog']";
  public static detailedViewRowData = "(//div[@col-id='ronumber'])[2]";
  public static getCanvas(id: number) {
    return `(//canvas)[${id}]`;
  }
  public static getCanvasName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock'])[${id}]`;
  }
  public static garndTotalElement(id: number) {
    return `(//h6[@class='MuiTypography-root MuiTypography-subtitle1'])[${id}]`;
  }
  public static advisor = "//button//span[text()='Service Advisors']";
  public static advisorSpan =
    "span[class='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1']";
  public static checkBox(id: number) {
    return `(//li//label//span//span//input)[${id}]`;
  }
  public static filterBtn = "//button//span[text()='Apply Filter']";
  public static canvasName(id: number) {
    return `(//span[@class="MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock"])[${id}]`;
  }
  public static canvasId(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock'])[${id}]`;
  }
}
