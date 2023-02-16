export class NavigationSelectors {
  public static expandCollapse = "button[id='Expand/Collapse']";
  public static getLi(num: number) {
    return `//*[@id="navelement"]/ul/li[${num}]`;
  }
  public static favorites =
    "#navelement > .MuiList-root > .MuiListItem-root > #Favorites > .MuiButton-label";
  public static Armatus_Admin =
    "#navelement > .MuiList-root > .MuiListItem-root > #Armatus\\ Admin > .MuiButton-label";

  public static navLi_1 = "//*[@id='navelement']/ul/li[4]";
  public static navLi_2 = "//*[@id='navelement']/ul/li[5]";
  public static navLi_3 = "//*[@id='navelement']/ul/li[6]";
  public static navLi_4 = "//*[@id='navelement']/ul/li[11]";
  public static navLi_5 = "//*[@id='navelement']/ul/li[12]";
}
