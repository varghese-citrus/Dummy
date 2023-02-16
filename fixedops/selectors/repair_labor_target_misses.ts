export class RepairlabortargetmissesSelectors {
  public static Labor = "button[id='Labor']";

  public static repair_labor_target_misses =
    "/html/body/div/div[1]/div/div/nav/ul/li[5]/div/div/div/ul/li[7]/a";

  public static heading_text =
    "//*[@id='root']/div[2]/div/div/div[2]/div/div[2]/h4";

  public static Reset_Layout =
    "p[class='MuiTypography-root MuiTypography-body1 MuiTypography-alignLeft']";

  public static as_of_data_display =
    "h6[class='MuiTypography-root MuiTypography-h6 MuiTypography-alignRight']";

  public static defaultToggle = "input[value='MTD']";
  public static toggleLi = "//*[@id='menu-']/div[3]/ul/li";
  public static toggleBtn = "div[id='mui-component-select-duration']";
  public static defaultCPmisses =
    "/html/body/div[1]/div[2]/div/div/div[3]/div[2]/div[1]/div/div/div";
  public static select_Int =
    "svg[class='MuiSvgIcon-root MuiSelect-icon MuiSelect-iconOutlined']";
  public static IntMisses = "input[value='Customer']";

  public static int_table =
    "div[class='ag-root ag-unselectable ag-layout-normal']";
  public static dataAsOf =
    "//*[@id='root']/div[2]/div/div/div[3]/div[2]/div/h6";
  public static downloadIcon = "//*[@id='export-to-excel']";
  public static heading = "//*[@id='root']/div[2]/div/div/div[2]/div/div[2]/h4";
  public static resetBtn = "//*[@id='reset-layout']";
  public static durationSelect = "//*[@id='mui-component-select-duration']";
  public static rowData1 =
    ".ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell:nth-child(7)";
  public static rowData2 =
    ".ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell:nth-child(7)";
  public static dataTable = "div[id='data-tab-labor-misses']";
  public static tglBtn_1 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[3]/td[2]/span/span[2]/button";
  public static tglBtn_2 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[7]/td[2]/span/span[2]/button";
  public static tglBtn_3 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[11]/td[2]/span/span[2]/button";
  public static tglBtn_4 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[15]/td[2]/span/span[2]/button";
  public static tglBtn_5 =
    "//*[@id='root']/div[2]/div/div/div/div/div[3]/div/table/tbody/tr[19]/td[2]/span/span[2]/button";
  public static repairOrderTable =
    "table[class='MuiTable-root MuiTable-stickyHeader']";

  public static laborGridHeading =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div[2]/h4";
  public static laborGridBackBtn =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div[1]/button";
  public static laborGridResetBtn = "//*[@id='reset-layout']";
  public static laborGridSelect_1 =
    "(//*[@id='mui-component-select-duration'])[1]";
  public static laborGridSelect_2 =
    "(//*[@id='mui-component-select-duration'])[2]";
  public static laborGridDoorInstallDate =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/h6[1]/div/div";
  public static laborGridDoorRate =
    "//*[@id='root']/div[2]/div/div/div/div[3]/div[2]/h6[2]/div";
  public static laborGridTable = "div[id='data-tab-labor-pricing']";

  public static opcodeRowData =
    ".ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row:nth-child(1) > .ag-cell:nth-child(4)";
  public static opcodeRowDataXpath =
    "//*[@id='data-tab']/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[4]";
  public static noDataMsg = "//*[text()='No Rows To Show']";
  public static complainces =
    "//div[@col-id='compliance' and @role='gridcell']";
  public static toggleButton = "//input[@type='checkbox' and @value='start']";
  public static detailedViewRowData = "(//div[@col-id='ronumber'])[2]";
  public static nonCompliantButton = "button[id='nonCompliantjobs']";
  public static allJobsButton = "button[id='allJobs']";
  public static dataBtn(id: number) {
    return `//*[@id="root"]/div[2]/div/div/div[4]/div/div/div/button[${id}]/span[1]/h6`;
  }
  public static getId(id: number) {
    return `//*[@id='menu-']/div[3]/ul/li[${id}]`;
  }
}
