export class PartsOppertunityHrsRoGpSelectors {
  public static whatIf = "#what-if-parts";
  public static whatIfHeading = "//*[@id='root']/div[2]/div/div/div/div/h4";
  public static whatIfDataAsOf =
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
  public static lastQtrBaselineHrsPerRoInput =
    "input[id='Last Qtr - ELR Comp-input']";
  public static lastQtrBaselineLaborGpInput =
    "input[id='Last Qtr - Labor GP%-input']";
  public static whatIfGoalHrsPerRoInput =
    "input[id='Target Hours Per RO-input-readonly']";
  public static whatIfGoalLaborGpInput =
    "input[id='Target Labor Gross Profit %-input-readonly']";

  public static lastQtrBaselineHrsPerRoInputLabel =
    "label[id='Last Qtr - ELR Comp-label']";
  public static lastQtrBaselineLaborGpInputLabel =
    "label[id='Last Qtr - Labor GP%-label']";
  public static whatIfGoalHrsPerRoInputLabel = "label[id='3-label']";
  public static whatIfGoalLaborGpInputLabel = "label[id='4-label']";

  public static annualOpportunityHrsPerRo = "div[id='Hours Per RO grid']";
  public static annualOpportunityGrossProfit = "div[id='Gross Profit % grid']";
  public static annualOpportunityJointEffect = "div[id='Joint Effectgrid']";
  public static annualOpportunityCombined = "div[id='Combinedgrid']";

  public static chart = "canvas[id='chart-id-926']";
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
  public static viewDetailBtn = "#view-details-926";

  public static whatIfGoalHrsPerRoInputEditable =
    "input[id='Target Hours Per RO-input-readonly']";
  public static whatIfGoalLaborGpInputEditable =
    "input[id='Target Labor Gross Profit %-input']";
  public static whatIfGoalHrsPerRoInputNonEditable =
    "input[id='Target Hours Per RO-input-readonly']";
  public static whatIfGoalLaborGpInputNonEditable =
    "input[id='Target Labor Gross Profit %-input']";
  public static editBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/div/div[1]/div[2]/button";
  public static backBtn =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/button";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[2]/p";

  public static laborOpportunityContainer =
    "div[class='scrollbar-container ps']";
  public static expBtn =
    "//*[@id='part-opportunity-grid']/div/div/div[1]/div[2]/button[2]";
}
