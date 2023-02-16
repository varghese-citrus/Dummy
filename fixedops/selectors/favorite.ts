export class FavoriteSelectors {
  public static favoriteLink = "a[id='Favorites']";
  public static favoriteHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h4";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static resetBtn = "button[id='reset-layout']";
  public static msgDiv =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div/div/div/div/button/span[1]/div";
  public static laborLink = "button[id='Labor']";
  public static laborOverviewLink = "a[id='Labor Overview']";
  public static addTofavBtn(id: number) {
    return `(//button[@id='Remove-from-Favorites' or @id='Add-to-Favorites'])[${id}]`;
  }
  public static addRemoveBtn_1 =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button[5]";
  public static addRemoveBtn_2 =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[2]/div/div[1]/div[2]/button[5]";
  public static canvas_1 = "canvas[id='chart_960']";
  public static canvas_2 = "canvas[id='chart_944']";
}
