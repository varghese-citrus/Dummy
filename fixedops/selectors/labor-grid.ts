export class LaborGridSelectors {
  public static referenceAndSetupLink = "button[id='setups']";
  public static laborGridLink = "a[id='Labor Grid(s)']";
  public static laborGridHeading =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div[2]/h4";
  public static gridSelect = "(//*[@id='mui-component-select-duration'])[1]";
  //public static gridSelectLi = "//*[@id='menu-duration']/div[3]/ul/li[2]";
  public static gridSelectLi = "//*[@id='menu-duration']/div[3]/ul/li";
  public static gridTypeSelect =
    "(//*[@id='mui-component-select-duration'])[2]";
  public static gridTypeSelectLi = "//*[@id='menu-duration']/div[3]/ul/li[1]";
  public static gridInstallDate =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/h6[1]/div";
  public static calculatedDateFrom =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/h6[2]/div";
  public static resetBtn = "button[id='reset-layout']";
  public static dataTable = "div[id='data-tab-labor-pricing']";
}
