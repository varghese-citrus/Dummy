export class PartsMatrixSelectors {
  public static referenceAndSetupLink = "button[id='setups']";
  public static partsMatrixLink = "a[id='Parts Matrix(s)']";
  public static partsMatrixHeading =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div[2]/h4";

  public static matrixPeriodSelect =
    "(//*[@id='mui-component-select-duration'])[1]";
  public static matrixPeriodSelectLi =
    "//*[@id='menu-duration']/div[3]/ul/li[1]";
  public static matrixSelect = "(//*[@id='mui-component-select-duration'])[2]";
  public static matrixSelectLi = "//*[@id='menu-duration']/div[3]/ul/li[1]";
  public static sourceSelect = "(//*[@id='mui-component-select-duration'])[3]";
  public static sourceSelectLi(id: number) {
    return `//*[@id="menu-duration"]/div[3]/ul/li[${id}]`;
  }
  public static sourceSelectLiCount = "//*[@id='menu-duration']/div[3]/ul/li";
  public static matrixInstallDate =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/div[2]/h6";
  public static resetBtn = "button[id='reset-layout']";
  public static dataTable = "div[id='data-tab-parts-pricing']";
  public static noData =
    "//*[@id='data-tab-parts-pricing']/div/div/div[2]/div[2]/div[6]/div/div/span";
}
