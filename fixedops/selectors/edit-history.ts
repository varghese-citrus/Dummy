export class EditHistorySelectors {
  public static armatusLink = "button[id='Armatus Admin']";
  public static editBtn = "a[id='Edit History']";
  public static editHistoryHeading =
    "button[class='MuiButtonBase-root MuiTab-root MuiTab-textColorSecondary MuiTab-fullWidth']";
  public static datePicker = "div[class='react-datepicker__input-container']";
  public static date(id: number) {
    return `(//div[@class='react-datepicker__week']//div)[${id}]`;
  }
  public static HistoryFor =
    "div[class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense']";
  public static applyBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary']";
  public static dataTable = "div[id='data-tab-user-login']";
  public static selectOptions(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static resetBtn = "button[id='reset-layout']";
  public static downloadBtn = "a[id='export-to-excel']";
}
