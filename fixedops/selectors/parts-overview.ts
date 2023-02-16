export class partsoverviewSelectors {
  public static partsMenuBtn = "//*[@id='Parts']/span[1]";
  public static partsMenuLink = "button[id='Parts']";
  public static partsOverviewBtn = "//*[@id='Parts Overview']/span[1]";
  public static pOverviewHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static canvas_1 = "#chart_1049";
  public static canvas_2 = "#chart_952";
  public static canvas_3 = "#chart_966";
  public static canvas_4 = "#chart_953";
  public static canvas_5 = "#chart_916";
  public static canvas_6 = "#chart_1143";
  public static canvas_7 = "#chart_1318";
  public static canvas_8 = "#chart_1326";
  public static canvas_9 = "#chart_1334";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static resetLayout =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/button/span[1]/p";
  public static partsExpandX(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static expandX(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static popup = "/html/body/div[2]/div[3]/div/div";
  public static expandCls =
    "div[class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12']";
  public static collapseX = "//button[@title='Collapse']";
  public static partsExpandClass =
    ".MuiDialogContent-root > .MuiBox-root > .MuiGrid-root > .MuiPaper-root > .MuiCardContent-root";
  public static collapseP =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div[1]/div[2]/button[2]";
  public static detailButton_1 = "//*[@id='view-details-1049']";
  public static detailButton_2 = "//*[@id='view-details-952']";
  public static detailButton_3 = "//*[@id='view-details-966']";
  public static detailButton_4 = "//*[@id='view-details-953']";
  public static detailButton_5 = "//*[@id='view-details-916']";
  public static detailButton_6 = "//*[@id='view-details-1143']";
  public static detailButton_7 = "//*[@id='view-details-1318']";
  public static detailButton_8 = "//*[@id='view-details-1326']";
  public static detailButton_9 = "//*[@id='view-details-1334']";
  public static infoButtonIcon(id: number) {
    return `(//*//div[2]/button[3])[${id}]`;
  }
  public static chartName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock'])[${id}]`;
  }
  public static chartId(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']/span)[${id}]`;
  }
  public static favButton(id: number) {
    return `(//button[@id='Add-to-Favorites' or @id='Remove-from-Favorites'])[${id}]`;
  }
  public static favBar = "//*[@id='Favorites']/span[1]";
  public static toggleBtn = "button[id='partialMonthToggle']";
  public static toggleSpan = "(//button[@id='partialMonthToggle']//span)[1]";
  public static partialMonSpan =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div/label/span[2]";
  public static showHideDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div";
  public static partsNavbar = "//*[@id='navelement']/ul/li[6]/div";
  public static partsLi = "//*[@id='navelement']/ul/li[6]/div/div/div/ul/li";
  public static getChart(id: number) {
    return `.MuiPaper-root > .react-grid-layout > .react-grid-item:nth-child(${id}) > .MuiPaper-root`;
  }
  public static getPartsLi(id: number) {
    return `//*[@id='navelement']/ul/li[6]/div/div/div/ul/li[${id}]`;
  }
  public static viewDetailBtn1 = "#view-details-1049";
  public static viewDetailBtn2 = "#view-details-952";
  public static viewDetailBtn3 = "#view-details-966";
  public static viewDetailBtn4 = "#view-details-953";
  public static viewDetailBtn5 = "#view-details-916";
  public static viewDetailBtn6 = "#view-details-1143";
  public static viewDetailBtn7 = "#view-details-1318";
  public static viewDetailBtn8 = "#view-details-1326";
  public static viewDetailBtn9 = "#view-details-1334";

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
  public static overviewChartName(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[1]/div/span[1]`;
  }
  public static chartTabBtn_1 = "button[id='chartid-1049']";
  public static chartTabBtn_2 = "button[id='chartid-952']";
  public static chartTabBtn_3 = "button[id='chartid-966']";
  public static chartTabBtn_4 = "button[id='chartid-953']";
  public static chartTabBtn_5 = "button[id='chartid-916']";
  public static chartTabBtn_6 = "button[id='chartid-1143']";
  public static chartTabBtn_7 = "button[id='chartid-1318']";
  public static chartTabBtn_8 = "button[id='chartid-1326']";
  public static chartTabBtn_9 = "button[id='chartid-1334']";

  public static backButton(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[3]/div[${id}]/div/div[1]/div[2]/button[6]`;
  }

  public static expandBtn(id: number) {
    return `(//button[@title='Expand'])[${id}]`;
  }
  public static dialogBox = "div[role='dialog']";
  public static collapseBtn =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div[1]/div[2]/button[2]";
  public static chartsDiv(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div[3]/div[${id}]`;
  }
  public static detailedViewRowData = "(//div[@col-id='ronumber'])[2]";
  public static canvasName(id: number) {
    return `(//span[@class="MuiTypography-root MuiCardHeader-title MuiTypography-h6 MuiTypography-displayBlock"])[${id}]`;
  }
  public static getCanvasName(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock'])[${id}]`;
  }
  public static canvasId(id: number) {
    return `(//span[@class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock'])[${id}]`;
  }
  public static getCanvas(id: number) {
    return `(//canvas)[${id}]`;
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
}
