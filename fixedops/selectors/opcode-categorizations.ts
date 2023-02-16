export class OpcodeCategorizationSelectors {
  public static referenceAndSetupLink = "button[id='setups']";
  public static opcodeCategorizationLink = "a[id='Opcode Categorizations']";
  public static heading = "//span[@class='MuiTab-wrapper']";
  public static downloadBtn = "a[id='export-to-excel']";
  public static resetBtn = "button[id='reset-layout']";
  public static editInstruction_1 = "//*[@id='root']/div[2]/div/div/div/p[1]";
  public static editInstruction_2 = "//*[@id='root']/div[2]/div/div/div/p[2]";
  public static dataTable = "div[class='ag-theme-balham']";
  public static rowData =
    "(//div[@id='data-tab_opcodes']//*[@role='row']//a)[1]";
  public static opcodeSelect =
    "//div[@id='mui-component-select-group-by-type']";
  public static opcodeSelectLi =
    "body > #menu-group-by-type > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(1)";
  public static opcodeAllSelectLi =
    "body > #menu-group-by-type > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(2)";
  public static editBtn = "(//button[@title='Edit'])[1]";
}
