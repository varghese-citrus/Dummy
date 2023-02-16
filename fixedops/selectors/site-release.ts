export class SiteReleaseLogSelectors {
  public static See_whatsnew =
    "#drawerRoot > #navelement > #changelog-div > a > .MuiTypography-root";
  public static date_text = "//*[@id='changelog-div']/h6/span";
  public static op_code_mapping = "a[id='Opcode Mapping with Statistics']";
  public static heading_text = "//h4[text()='Site Release Log']";
  public static enh_dataTab =
    "//*[@id='root']/div[2]/div/div/div/div/div/div/div/div[2]/div";
  public static feat_dataTab =
    "//*[@id='root']/div[2]/div/div/div/div/div/div/div/div[2]/div";
}
