export class LoginSelectors {
  public static signButton = "button[id='login']";
  public static username = "#username";
  public static password = "#password";
  public static signIn = "#kc-login";
  public static storeSelect = "div[id='store-select']";
  public static koppelFord = "li[data-value='Koeppel Ford']";
  public static btnViewDashborad = "button[type='submit']";
  public static chartContainer = "#chartContainer_1341";

  public static roleSpan =
    "#mouse-over-popover > .MuiPaper-root > .MuiList-root > #nested-list-subheader > span:nth-child(2)";

  public static userIcon =
    ".MuiGrid-root > .MuiButtonBase-root > .MuiButton-label > .MuiGrid-root > span";
  public static changeStore = "svg[title='Change Store']";

  public static koeppelStore(store: string) {
    const st = `li[data-value='${store}']`;
    return st;
  }

  public static signOut = "div[class='MuiListItemIcon-root']";
  public static signOutOk =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary']";
  public static signOutCancel = "//span[text()='Cancel']";
  public static logo = "img[alt='Logo']";
  public static contactIcon =
    ".MuiGrid-root > .MuiGrid-root > .MuiButtonBase-root > .MuiIconButton-label > img";
  public static tooltip = "div[role='tooltip']";

  public static tooltipTitle = "//*[@id='mui-49943']/div/h5";
  public static loginErroMsg = ".kc-feedback-text";
  public static hidePassword = "input[type='password']";
  public static showPassword = "input[type='text']";
  public static eyeIcon = "#vi";
  public static usrName =
    //".MuiGrid-root > .MuiButtonBase-root > .MuiButton-label > .MuiGrid-root > span";
    "span[class='MuiButton-label']";
  public static signErrMsg = "//*[@id='kc-content-wrapper']/div[1]/span[2]";

  public static signInLogo =
    "img[src='/auth/resources/jfpg1/login/customArmatusOT/img/armatus-new-logo.png']";
  public static dashcontacticon =
    "div[class='MuiTooltip-tooltip jss30 MuiTooltip-tooltipPlacementBottom']";

  public static signLogo =
    "img[src='/auth/resources/4gklt/login/customArmatusOT/img/armatus-new-logo.png']";
  public static signContactIcon =
    ".login-pf_body > .navigation-bar > #navigation-container > .tooltip-div > img";
  public static signTp = "div[class='tooltip-div-text']";
  public static usrIcon = "//*[@id='root']/header/div/div/div[2]/button[2]";
  public static subHeaderUsrName = "//*[@id='nested-list-subheader']/span[1]";
}
