export class DetailSummerySelectors {
  public static armatusAdminLink = "button[id='Armatus Admin']";
  public static detailSummaryLink = "a[id='Detail Summary']";
  public static detailSummaryHeading =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div/div/button/span[1]/div";

  public static curMonth = "th[id='currentMonth']";
  public static serviceDepartment =
    "//*[@id='showTable']/table/thead/tr[1]/th[2]";
  public static datePicker =
    "//*[@id='showTable']/table/thead/tr[1]/th[3]/div/div/div/input";

  public static year = "/html/body/div[4]/div[3]/div/div[1]/button[1]";
  public static getYear(id: number) {
    return `//div[text()='${id}'] `;
  }
  public static month =
    "//*[@class='MuiTypography-root MuiPickersToolbarText-toolbarTxt MuiPickersToolbarText-toolbarBtnSelected MuiTypography-h4']";
  public static getMonth(id: number) {
    return `(//*[@class='MuiTypography-root MuiPickersMonth-root MuiTypography-subtitle1' or @class='MuiTypography-root MuiPickersMonth-root MuiPickersMonth-monthSelected MuiTypography-h5 MuiTypography-colorPrimary'])[${id}]`;
  }
  public static table = "div[id='showTable']";

  public static revenueByPayType =
    "//*[@id='showTable']/table/tbody[1]/tr[3]/td[2]";

  public static drilDownBtn(id: number) {
    return `(//a[@id='laborparts'])[${id}]`;
  }
  public static ratesAndMarkups = "//*[@id='currTotalSales']/button";
  public static ratesAndMarkupsTable_1 =
    "//*[@id='showTable']/table/tbody[1]/tr[8]/td/div/div/div/div/table[1]";
  public static ratesAndMarkupsTable_2 =
    "//*[@id='showTable']/table/tbody[1]/tr[8]/td/div/div/div/div/table[2]";

  public static cusLaborRevenue =
    "//*[@id='showTable']/table/tbody[2]/tr[2]/td[6]";

  public static cusPartsRevenue =
    "//*[@id='showTable']/table/tbody[2]/tr[24]/td[6]";

  public static cusLaborRevenueCat =
    "//*[@id='showTable']/table/tbody[3]/tr[2]/td[6]";

  public static cusPartsRevenueCat =
    "//*[@id='showTable']/table/tbody[3]/tr[9]/td[6]";

  public static jobLevelBreakDown_1 =
    "//*[@id='showTable']/table/tbody[4]/tr[2]/td[6]";

  public static jobLevelBreakDown_2 =
    "//*[@id='showTable']/table/tbody[4]/tr[17]/td[6]";

  public static allBtn =
    "//*[@id='showTable']/table/tbody[2]/tr[2]/td[6]/div/div[1]";
  public static withPartsBtn =
    "//*[@id='showTable']/table/tbody[2]/tr[2]/td[6]/div/div[2]";
  public static withoutPartsBtn =
    "//*[@id='showTable']/table/tbody[2]/tr[2]/td[6]/div/div[3]";

  public static revenueDetailLabel = "//*[@id='detailSummary']/h4/div/label";
  public static dataTable = "div[id='data-tab']";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";

  public static opcodeDetailedViewTab = "button[id='Opcode - Detailed View']";
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
}
