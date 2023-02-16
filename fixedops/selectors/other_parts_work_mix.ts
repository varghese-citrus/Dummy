export class OtherpartsworkmixSelectors {
  public static Parts = "button[id='Parts']";

  public static other_parts_work_mix = "a[id='parts-workmix-other']";

  public static heading_text =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div/div/button[1]/span[1]/div";

  public static Export_To_Excel = "//a[@id='export-to-excel']";

  public static Reset_Layout =
    "//p[@class='MuiTypography-root MuiTypography-body1 MuiTypography-alignLeft']";

  public static as_of_date_display = "(//p)[1]";

  public static type_listbox = "div[id='mui-component-select-filter3']";
  public static type_list_items(id: number) {
    return `//*[@id='menu-filter3']/div[3]/ul/li[${id}]`;
  }
  public static ranking_per_row = "//span[text()='Ranking Per Row']";
  public static ranking_bar =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[3]";
  public static range_high =
    "//*[@id='root']/div[2]/div/div/div/div[3]/span[2]";
  public static range_low = "//*[@id='root']/div[2]/div/div/div/div[3]/span[3]";
  public static data_table =
    "div[class='ag-root ag-unselectable ag-layout-normal']";
  public static workmix_listbox = "div[id='mui-component-select-filter1']";
  public static workmix_positive = "li[tabindex='-1']";
}
