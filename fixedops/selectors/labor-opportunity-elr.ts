export class LaborOppertunityElrSelectors {
  public static whatIfElrLink = "a[id='what-if-elr']";
  public static whatIfElrHeading = "//*[@id='root']/div[2]/div/div/div/div/h4";
  public static whatIfElrDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[3]/p";
  public static editButton =
    "button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn']";
  public static saveButton =
    ".MuiPaper-root > .MuiGrid-root > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label";

  public static annualHeading = "//*[@id='root']/div[2]/div/div/div/div/h5";
  public static lastQtrBaselineHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h6";
  public static whatIfGoalHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/h6";

  public static lastQtrBaselineElrCompInput =
    "input[id='Last Qtr - ELR Comp-input']";
  public static lastQtrBaselineElrMaintInput =
    "input[id='Last Qtr - ELR Maint-input']";
  public static lastQtrBaselineElrRepairInput =
    "input[id='Last Qtr - ELR Repair-input']";

  public static whatIfGoalElrCompInput =
    "input[id='Target ELR-Comp-input-readonly']";
  public static whatIfGoalElrMaintInput =
    "input[id='Target ELR-Maint-input-readonly']";
  public static whatIfGoalElrRepairInput =
    "input[id='Target ELR-Repair-input-readonly']";

  public static lastQtrBaselineElrCompInputLabel =
    "//*[@id='Last Qtr - ELR Comp-label']";
  public static lastQtrBaselineElrMaintInputLabel =
    "//*[@id='Last Qtr - ELR Maint-label']";
  public static lastQtrBaselineElrRepairInputLabel =
    "//*[@id='Last Qtr - ELR Repair-label']";

  public static whatIfGoalElrCompInputLabel =
    "(//label[@class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled'])[1]";
  public static whatIfGoalElrMaintInputLabel =
    "(//label[@class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled'])[2]";
  public static whatIfGoalElrRepairInputLabel =
    "(//label[@class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled'])[2]";

  public static annualOpportunityCompetetive = "div[id='Competitivegrid']";
  public static annualOpportunityMaintenance = "div[id='Maintenancegrid']";
  public static annualOpportunityRepair = "div[id='Repairgrid']";
  public static annualOpportunityTotal = "div[id='Totalgrid']";

  public static chart = "canvas[id='chart-id-921']";
  public static chartName =
    "span[class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock']";
  public static chartNumber =
    "span[class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']";
  public static infoIcon =
    ".MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path";
  public static expColBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root";
  public static popup = "div[role='dialog']";
  public static collapseBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";
  public static viewDetailBtn = "#view-details-921";

  public static whatIfGoalElrCompInputEditable =
    "input[id='Target ELR-Comp-input']";
  public static whatIfGoalElrMaintInputEditable =
    "input[id='Target ELR-Maint-input']";
  public static whatIfGoalElrRepairInputEditable =
    "input[id='Target ELR-Repair-input']";

  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";
  public static laborOpportunityContainer =
    "div[class='scrollbar-container ps']";
  public static logo = "//*[@id='root']/div[3]/div[2]/div/img";
  public static expandBtn =
    "//*[@id='elr-opportunity-grid']/div/div/div[1]/div[2]/button[2]";
  public static footerLogo = "img[src='/images/logos/armatus-logo-footer.png']";
}
