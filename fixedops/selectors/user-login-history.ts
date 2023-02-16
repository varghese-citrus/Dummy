export class UserLoginHistorySelectors {
  public static userLoginHistoryLink = "a[id='User Login History']";
  public static userLoginHistoryHeading =
    "//*[@id='root']/div[2]/div/div/div/div[1]/div/div/div/button/span[1]/div";
  public static datePicker = "div[class='react-datepicker__input-container']";
  public static dataTable = "div[id='data-tab-user-login']";
  public static selectDateParagraph =
    "//*[@id='root']/div[2]/div/div/div/div[2]/div/div/div/p";
  public static datePickerMonthYear =
    "div[class='react-datepicker__current-month']";
  // public static date(id: number) {
  //   return `.react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--0${id}`;
  // }
  public static date(id: number) {
    return `(//div[@class='react-datepicker__week']//div)[${id}]`;
  }
}
