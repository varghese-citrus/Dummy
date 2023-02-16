export class laborwtyratesSelectors {
  public static Armatus_admin = "button[id='Armatus Admin']";
  public static Labor_wtyrates = "a[id='Labor - Wty Rates']";
  public static heading_text =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div/div/button/span[1]/div";
  public static Labor_wtyrates_table =
    "div[class='ag-root ag-unselectable ag-layout-normal']";
  public static month(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static select_month_from_list =
    "div[id='mui-component-select-group-by-type']";
  public static datePicker = "div[class='react-daterange-picker__wrapper']";
  public static monthRangeStart =
    "(//*[@class='react-daterange-picker__inputGroup__input react-daterange-picker__inputGroup__month'])[1]";
  public static monthRangeEnd =
    "(//*[@class='react-daterange-picker__inputGroup__input react-daterange-picker__inputGroup__month'])[2]";
  public static dataTab = "div[id='data-tab']";
  public static monthStartRange =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div/div[2]/div/div/div[1]";
  public static monthEndRange =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div/div[2]/div/div/div[1]";

  public static dayRange(id: number) {
    return `//*[@id="root"]/div/div/div/div/div[2]/div/div/div[2]/div/span/div/div/div[2]/div/div/div/div[2]/button[${id}]`;
  }
  public static applyBtn =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div/button";
}
