export class HeaderFooterSelectors {
  public static storeList(id: number) {
    return `//*[@id="menu-"]/div[3]/ul/li[${id}]`;
  }
  public static dropDown = "//*[@id='root']/div/div/div/div/div[1]/form/div";
  public static versionNavbar = "//*[@id='changelog-div']/h5";
  public static versionFooter = "//*[@id='root']/div[3]/div[2]/p";

  public static supportBtn = "button[title='Support & Feedback']";

  public static sfTitle =
    "h5[class='MuiTypography-root MuiTypography-h5 MuiTypography-gutterBottom MuiTypography-alignCenter']";

  public static sfCloseBtn =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained close-btn']";

  public static footerLogo = "img[src='/images/logos/armatus-logo-footer.png']";

  public static appTitle = "//*[@id='root']/header/div/div[2]/h5";

  public static storeHyundai = "//*[@id='menu-']/div[3]/ul/li[2]";

  public static storeSelect =
    "div[class='MuiInputBase-root MuiInput-root MuiInput-underline']";
  public static storeChangeButton = "svg[title='Change Store']";
  public static dD = "//*[@id='root']/div/div/div/div/div[1]/form/div";
  public static changeStore =
    "//*[@id='root']/header/div/div[1]/div[3]/div/div/h6";
  public static storeSelectLi = "//*[@id='menu-']/div[3]/ul/li";
  public static getStore(id: number) {
    return `//*[@id="menu-"]/div[3]/ul/li[${id}]`;
  }
  public static notificationIcon = "button[title='Notifications']";
  public static notificationCount =
    "//*[@id='root']/header/div/div[1]/div[2]/button[1]/span[1]/span/span";
  public static notificationPopup =
    "div[class='MuiPaper-root MuiPopover-paper MuiPaper-elevation8 MuiPaper-rounded']";
  public static errMsgSpan1 =
    "(//span[@class='MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock'])[1]";
  public static errMsgSpan2 =
    "(//span[@class='MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock'])[2]";
  public static fixBtn1 = "(//span[text()='Fix Now'])[1]";
  public static fixBtn2 = "(//span[text()='Fix Now'])[2]";
}
