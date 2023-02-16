export class partswtyratesSelectors {
  public static Armatus_admin = "button[id='Armatus Admin']";
  public static Parts_wtyrates = "a[id='Parts - Wty Rates']";
  public static heading_text =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div/div/button/span[1]/div";
  public static parts_wtyrates_table =
    "div[class='ag-root ag-unselectable ag-layout-normal']";
  public static month(id: number) {
    return `//*[@id="menu-group-by-type"]/div[3]/ul/li[${id}]`;
  }
  public static select_month_from_list =
    "div[id='mui-component-select-group-by-type']";

  public static datePicker = "div[class='react-daterange-picker__wrapper']";
  public static monthRangeStart =
    "div > div > div > div.MuiGrid-root.MuiGrid-container > div > div > div:nth-child(2) > div > div > div:nth-child(1) > input.react-daterange-picker__inputGroup__input.react-daterange-picker__inputGroup__month";
  public static monthRangeEnd =
    "div > div > div > div.MuiGrid-root.MuiGrid-container > div > div > div:nth-child(2) > div > div > div:nth-child(3) > input.react-daterange-picker__inputGroup__input.react-daterange-picker__inputGroup__month";
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
