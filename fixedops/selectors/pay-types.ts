export class PayTypesSelectors {
  public static referenceAndsetupsLink = "button[id='setups']";
  public static payTypesLink = "a[id='Pay Types']";
  public static payTypesTab = "//button[@role='tab']";
  public static NonCatPayTypesTab =
    ".MuiPaper-root > .MuiTabs-root > .MuiTabs-scroller > .MuiTabs-flexContainer > .MuiButtonBase-root:nth-child(3)";
  public static dataTable = "div[id='data-tab']";
  public static downloadIcon = "//a[@id='export-to-excel']";
  public static reloadData =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-fullWidth']";
  public static editBtn = "button[id='btnedit0']";
  public static editUpdateBtn = "button[id='btnupdate0']";
  public static editCancelBtn = "button[id='btncancel0']";
  public static noDataToDisplay =
    "//*[@id='data-tab']/div/div/div[2]/div[1]/div[3]/div[2]/div/div";
  public static userIcon = "//*[@id='root']/header/div/div[3]/button";
  public static roleSpan = "//*[@id='nested-list-subheader']/span[2]";
  public static editButton = "(//button[@title='Edit'])[1]";
  public static resetBtn = "//button[@id='reset-layout']";
  public static saveChanges =
    "(//button[@class='MuiButtonBase-root MuiButton-root MuiButton-outlined'])[1]";
  public static reprocessDataHistory =
    "(//button[@class='MuiButtonBase-root MuiButton-root MuiButton-outlined'])[2]";
}
