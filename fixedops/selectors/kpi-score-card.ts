export class kpiscorecardSettingsSelectors {
  public static referenceAndSetupLink = "button[id='setups']";
  public static kpiSettingsLink =
    ".MuiList-root > .MuiListItem-root > #kpi-report-goal-settings > .MuiButton-label > div";
  public static kpiSettingsHeading =
    "//h4[text()='KPI Report#1 - Goal Settings']";
  public static storeGoalsHeading = "//h5[text()='Store Goals']";
  public static advGoalsHeading = "//h5[text()='Advisor Goals']";
  public static editableInpField =
    "input[class='ag-input-field-input ag-text-field-input']";
  public static editBtn = "button[title='Edit']";
  public static storeTable =
    ".MuiGrid-root > div > #data-tab-goal > div > .ag-root-wrapper";
  public static storeTableXpath = "(//div[@id='data-tab-goal'])[2]";
  public static saveGoalStoreBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn btngoalSettings']";
  public static reportEmailBtn = "(//div[@class='emailsave'])[1]";
  public static reportEmailChk =
    "//*[@id='root']/div[2]/div/div/div/div/div/div[1]/div[3]/div[2]/div[1]/span/span[1]";
  public static reportEmailBox =
    ".MuiGrid-root > .MuiGrid-root > div > .emailsave > div:nth-child(2)";

  public static advTable = "div[id='data-tab-goal-adv']";
  public static advSelect = "//*[@id='demo-simple-select-standard']";
  public static advSelectCount = "//*[@id='menu-Select Advisor']/div[3]/ul/li";
  public static advSelectLi(id: number) {
    return `//*[@id="menu-Select Advisor"]/div[3]/ul/li[${id}]`;
  }
  public static emailReport =
    "//*[@id='root']/div[2]/div/div/div/div/div/div[2]/div[3]/div/div/div[2]/div[1]";
  public static advisorSelect = "div[id='demo-simple-select-standard']";
  public static advisorSelectLi(id: number) {
    return `(//li[@class='MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'])[${id}]`;
  }
  public static saveGoalsBtn1 = "(//button//span[text()='Save Goals'])[1]";
  public static saveGoalsBtn2 =
    "//button[@class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn btngoalSettings']";
  public static emailReport1 = "(//div[@class='emailtitlesec'])[1]";
  public static emailReport2 = "(//div[@class='emailtitlesec'])[2]";
  public static addRecipientBtn1 =
    "(//button//span[text()='Add Recipient'])[1]";
  public static addRecipientBtn2 =
    "(//button//span[text()='Add Recipient'])[2]";
  public static emailBoxElement1 =
    "div.MuiPaper-root.MuiPaper-elevation1 > div > div:nth-child(1) > div:nth-child(3) > div > div > div.emailsave > div:nth-child(2)";
  public static emailBoxElement2 =
    ".MuiGrid-root > .MuiGrid-root > div > .emailsave > div:nth-child(2)";
  public static popup = "div[role='dialog']";
  public static okBtn = "//button//span[text()='Ok']";
  public static cancelBtn =
    "(//*[@class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn MuiButton-containedPrimary'])[1]";
  public static emailInput =
    "//input[@class='MuiInputBase-input MuiInput-input']";
  public static scheduleSelect =
    "(//div[@class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input'])[2]";
  public static chooseDate =
    "(//div[@class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input'])[4]";
  public static scheduleLi(id: number) {
    return `(//li[@class='MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'])[${id}]`;
  }
  public static scheduleOn(id: number) {
    return `.MuiDialogContent-root > .MuiPaper-root > #maildetails > .MuiTableRow-root > .MuiTableCell-alignCenter:nth-child(3) > div:nth-child(${id})`;
  }
  public static weeklyLi(id: number) {
    return `(//li[@class='MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'])[${id}]`;
  }
  public static biWeekly = "input[id='selectbiweekly']";
  public static monthly(id: number) {
    return `(//li[@class='MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'])[${id}]`;
  }
  public static saveChangesBtn = "//button//span[text()='Save Changes']";
  public static emailList =
    "//div[@class='ag-center-cols-container']//div[@role='row']//div[@col-id='recipientId']";
  public static emailListIndex(id: number) {
    return `(//div[@class="ag-center-cols-container"]//div[@role="row"]//div[@col-id="recipientId"])[${id}]`;
  }
  public static checkboxOne =
    "(//*[@type='checkbox' and @data-indeterminate='false'])[1]";
  public static checkboxTwo =
    "(//*[@type='checkbox' and @data-indeterminate='false'])[2]";
}
