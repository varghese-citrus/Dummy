export class StoreSettingSelectors {
  public static armatusAdminLink = "button[id='Armatus Admin']";
  public static storeSettingLink = "a[id='Store Settings']";
  public static storeHeading = "//*[@id='root']/div[2]/div/div/div/div/h4";
  //public static timezoneSelect = "div[id='react-select-2-placeholder']";
  public static timezoneSelect =
    "div[class='select-wrapperselect css-b62m3t-container']";
  public static storeTable = "div[id='data-tab-goal-storeset']";

  public static saveAllBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn btnSettings']";
  public static daySelectCheckBox = "//*[@id='ag-input-id-1452']";
  public static checkBox(id: number) {
    return `/html/body/div[1]/div[2]/div/div/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[${id}]/div[1]/div/div/div/div`;
  }
  public static checkBoxDiv =
    "//*[@id='data-tab-goal']/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div/div[1]/div/div/div/div";
  public static allSelDeselCheckBox = "//*[@id='data-tab-goal-storeset']";

  public static timezoneDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div/div/div[2]/div[1]/div/div";

  public static alert = "div[class='MuiAlert-message']";

  public static week(id: number) {
    return `//*[@id="data-tab-goal"]/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[${id}]/div[2]
    `;
  }

  public static dayStatus(id: number) {
    return `.ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(${id}) > .ag-cell:nth-child(3)`;
  }
}
