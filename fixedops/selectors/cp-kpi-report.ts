export class CpKpiSelectors {
  public static cpsummary =
    "#navelement > .MuiList-root > .MuiListItem-root > #Customer\\ Pay > .MuiButton-label";
  public static cpLi = "//*[@id='navelement']/ul/li[4]/div/div/div/ul/li";
  public static cpKpiReport =
    ".MuiList-root > .MuiListItem-root > #KPI\\ Report\\ 1\\ \\ \\A\\ Individual\\ Advisor > .MuiButton-label > .MuiSvgIcon-root";
  public static cpOvrHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static cpDataAsOf = "(//*[local-name()='p'])[1]";
  public static kpiReportTable = "table[class='custom-table table-border']";
  public static kpiReportDate =
    "//div[@class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense']";
  public static kpiReportSelectedDate =
    "//*[@id='kpi-body']/table/tbody/tr/td/table/tbody/tr/td/table[2]/tbody/tr/td/table/tr[1]/td/span[3]";
  public static kpiReportSelectedAdv =
    "//*[@id='kpi-body']/table/tbody/tr/td/table/tbody/tr/td/table[2]/tbody/tr/td/table/tr[1]/td/span[2]";
  public static kpiReportSelectedStore =
    "//*[@id='kpi-body']/table/tbody/tr/td/table/tbody/tr/td/table[2]/tbody/tr/td/table/tr[1]/td/span[1]";
  public static kpiReportStore =
    "//*[@id='root']/header/div/div[1]/div[3]/div/div/h6";
  public static toggleBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div/label/span[1]/span[1]/span[1]/input";
  public static partialMonSpan =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div/label/span[2]";
  public static getRandDateSel(id: number) {
    return `//*[@id="menu-"]/div[3]/ul/li[${id}]`;
  }
  public static kpiFixedOpsHeading =
    "//*[@id='kpi-body']/table/tbody/tr/td/table/tbody/tr/td/table[1]/tbody/tr/td/table";
  public static kpiexportPdf =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div[1]/a";
  public static servceAdvisor = "(//span[text()='Service Advisors'])[1]";
  public static serviceAdvLi =
    "//*[@id='service-advisor-list']/div[3]/ul/div/div[1]/div[1]/li[1]";
  public static serviceAdvLi2 =
    "//*[@id='service-advisor-list']/div[3]/ul/div/div[1]/div[1]/li[2]";
  public static serviceAdvApplyFilter =
    ".MuiList-root > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root:nth-child(2) > .MuiButton-label";
  public static collapseX =
    "/html/body/div[2]/div[3]/div/div/form/div/div/div[1]/div[2]/button[2]";
  public static popup = "/html/body/div[2]/div[3]/div/div";
  public static datetoggleBtn =
    "div[class='MuiInputBase-root MuiOutlinedInput-root selectedToggle MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense']";
  public static servAllMsg =
    "//*[@id='root']/div[2]/div/div/div/span/div/div[2]";
  public static addTofavBtn(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[1]/div[2]/button[5]`;
  }
  public static favNavLink = "//*[@id='Favorites']";
  public static resetBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn']";
  public static showHideDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/div/div";
  public static infoIcon(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[1]/div[2]/button[3] `;
  }
  public static chartNames(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[1]/div[1]/span[1]`;
  }
  public static chartNumbers(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div/div/div[2]/div[${id}]/div/div[1]/div[1]/span[2]/span`;
  }
  public static editGoalBtn = "//p[text()='Edit Goals']";
  public static backBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained bck-btn']";
}
