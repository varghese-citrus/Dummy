export class PartsOpportunitySelectors {
  public static partsMenu = "#Parts";
  public static partsOpportunity = "#what-if-parts";
  public static opportunityHeading =
    "//*[@id='root']/div[2]/div/div/div/div/h4";
  public static whatIfDataAsOf =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[3]/p";
  public static editBtn =
    ".MuiPaper-root > .MuiGrid-root > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label";
  //"button[class='MuiButtonBase-root MuiButton-root MuiButton-contained reset-btn']";
  public static saveBtn =
    ".MuiPaper-root > .MuiGrid-root > .MuiGrid-root > .MuiButtonBase-root > .MuiButton-label";
  //"button[class='MuiButtonBase-root MuiButton-root MuiButton-contained jss408 reset-btn']";
  public static lastQtrBaselineHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[1]/div[1]/h6";

  public static lastQtrHrsPerROInputLabel =
    "label[id='Last Qtr - ELR Comp-label']";

  public static lastQtrPartsGpInputLabel =
    "label[id='Last Qtr - Labor GP%-label']";

  public static lastQtrHrsPerROInput = "input[id='Last Qtr - ELR Comp-input']";
  public static lastQtrPartsGpInput = "input[id='Last Qtr - Labor GP%-input']";

  public static annualHeading = "//*[@id='root']/div[2]/div/div/div/div/h5";
  public static annualOpportunityHrsPerRo = "div[id='Hours Per RO grid']";
  public static annualOpportunityGrossProfit = "div[id='Gross Profit % grid']";
  public static annualOpportunityJointEffect = "div[id='Joint Effectgrid']";
  public static annualOpportunityCombined = "div[id='Combinedgrid']";

  public static whatIfGoalHeading =
    "//*[@id='root']/div[2]/div/div/div/div/div[2]/div[1]/h6";

  public static whatIfTargetHrsPerRoInputLabel = "label[id='1-label']";
  public static whatIfTargetPartsGpInputLabel = "label[id='2-label']";

  public static whatIfTargetHrsPerROInput =
    "input[id='Target Hours Per RO-input-readonly']";
  public static whatIfTargetPartsGpInput =
    "input[id='Target Parts Gross Profit %-input-readonly']";

  public static whatIfTargetHrsPerRO = "input[id='Target Hours Per RO-input']";
  public static whatIfTargetPartsGp =
    "input[id='Target Parts Gross Profit %-input']";

  public static whatIfTargetHrsPerRONonEditable =
    "input[id='Target Hours Per RO-input']";
  public static whatIfTargetPartsGpNonEditable =
    "input[id='Target Parts Gross Profit %-input']";

  public static chart = "#chart-id-926";
  //"//*[@id='chart-id-926']";
  public static chartName =
    "span[class='MuiTypography-root MuiCardHeader-title MuiTypography-h5 MuiTypography-displayBlock']";
  public static chartId =
    "span[class='MuiTypography-root MuiCardHeader-subheader MuiTypography-body1 MuiTypography-colorTextSecondary MuiTypography-displayBlock']";
  public static infoIcon =
    ".MuiCardHeader-action > .MuiButtonBase-root:nth-child(3) > .MuiIconButton-label > .MuiSvgIcon-root > path";
  public static expColBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root:nth-child(2) > .MuiIconButton-label > .MuiSvgIcon-root";
  public static popUp = "div[role='dialog']";
  public static collapseBtn =
    ".MuiCardHeader-root > .MuiCardHeader-action > .MuiButtonBase-root > .MuiIconButton-label > img";
  public static viewDetailBtn = "#view-details-926";
  public static whatIfGoalTargetHrsPerROInputEditable =
    "input[id='Target Hours Per RO-input']";
  public static whatIfTargetPartsGpInputEditable =
    "input[id='Target Parts Gross Profit %-input']";

  public static whatIfGoalTargetHrsPerROInputNonEditable =
    "input[id='Target Hours Per RO-input-readonly']";
  public static whatIfTargetPartsGpInputNonEditable =
    "input[id='Target Parts Gross Profit %-input-readonly']";

  public static lastQtrBaselineHprInputLabel =
    "//*[@id='Last Qtr - ELR Comp-label']";
  public static lastQtrBaselinePartsGpInputLabel =
    "//*[@id='Last Qtr - Labor GP%-label']";

  public static whatIfGoalTarHroInputLabel =
    "(//label[@class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled'])[1]";
  public static whatIfGoalPartsGpInputLabel =
    "(//label[@class='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled'])[2]";
}
