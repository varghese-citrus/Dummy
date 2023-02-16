import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { RepairlabortargetmissesSelectors as rlts } from "../selectors/repair_labor_target_misses.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsrepairlabortargetmissesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0207] ${site.name} Repair labor target misses Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0207",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await repairlabortargetmissesTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Repair labor target misses Test";
          execMetrics.labels.object.finalizeOn = new Date();
          metrics.record(execMetrics);
          await metrics.persistUitMetrics(metrics);
          throw error;
        }
        metrics.record(execMetrics);
        execMetrics.labels.object.finalizeOn = new Date();
        await metrics.persistUitMetrics(metrics);
      },
      sanitizeOps: false,
      sanitizeResources: false,
    });
  });
}

async function repairlabortargetmissesTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForSelector(rlts.Labor);
    await page.click(rlts.Labor);
    logger.info("Labour Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForXPath(rlts.repair_labor_target_misses);
    const xpath = await page.$x(rlts.repair_labor_target_misses);
    await xpath[0].click();
    logger.info("Repair labor target misses Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const store = Deno.env.get("STORE");
    if (store == "Kevin Whitaker Chevrolet") {
      const actual_title = await page.title();
      if (
        actual_title ==
        "Customer Pay Repair - Labor Target Misses - Medium Duty"
      ) {
        logger.info("Repair labor target misses page is visible");

        const H_text = await page.$x(rlts.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        logger.info("Heading text: " + Heading_text_displayed);
        Heading_text_displayed ==
        "Customer Pay Repair - Labor Target Misses - Medium Duty"
          ? logger.info(
              "Customer Pay Repair - Labor Target Misses - Medium Duty heading is visible"
            )
          : [
              logger.error(
                "Customer Pay Repair - Labor Target Misses - Medium Duty heading is not visible"
              ),
              errors.push(
                "Customer Pay Repair - Labor Target Misses - Medium Duty heading is not visible"
              ),
            ];

        await page.waitForSelector(rlts.Reset_Layout);
        await page.click(rlts.Reset_Layout);
        logger.info("Reset_Layout clicked !!!");
        await page.waitForTimeout(4000);
        await page
          .waitForSelector(rlts.as_of_data_display, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("data as of display properly");
          })
          .catch(() => {
            logger.error("data as of not display properly");
            errors.push("data as of not display properly");
          });
        await page.waitForTimeout(4000);
        for (let i = 1; i <= 7; i++) {
          const buttons = rlts.dataBtn(i);
          const data_buttons = await page.$x(buttons);
          const as_of_button_displayed: string = await (
            await data_buttons[0].getProperty("textContent")
          ).jsonValue();
          logger.info("" + as_of_button_displayed);
          await page.waitForTimeout(3000);
        }
        (await page.$$eval(rlts.defaultToggle, (txts) =>
          txts.map((txt) => txt.getAttribute("value")).includes("MTD")
        ))
          ? logger.info("default drop down value MTD  is visible")
          : [
              logger.error("default drop down value  MTD  is unavailable"),
              errors.push("default drop down value MTD  is unavailable"),
            ];
        await page.click(rlts.defaultToggle);
        await page.waitForTimeout(3000);
        await page.waitForSelector(rlts.toggleBtn);
        await page.click(rlts.toggleBtn);
        await page.waitForTimeout(5000);
        const tgli = await await page.$x(rlts.toggleLi);
        for (let i = 1; i <= tgli.length; i++) {
          const id = rlts.getId(i);
          const el = await page.$x(id);
          await el[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);
          await page.waitForSelector(rlts.toggleBtn);
          await page.click(rlts.toggleBtn);
          await page.waitForTimeout(5000);
        }
        await page
          .waitForXPath(rlts.defaultCPmisses)
          .then(async () => {
            const misses = await page.$x(rlts.defaultCPmisses);
            const detaultMisses = await (
              await misses[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            detaultMisses == "Medium Duty"
              ? logger.info("default drop down value Medium Duty is visible")
              : [
                  logger.error(
                    "default drop down value  Medium Duty is unavailable"
                  ),
                  errors.push(
                    "default drop down value Medium Duty is unavailable"
                  ),
                ];
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });
        await page
          .waitForSelector(rlts.select_Int)
          .then(async () => {
            await page.click(rlts.select_Int);
            await page.waitForTimeout(3000);
            await page.click(rlts.IntMisses);
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });
        await page.waitForTimeout(5000);
        await page
          .$eval(rlts.int_table, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("Int misses table  loaded properly");
          })
          .catch(() => {
            logger.error("Int misses table  is  not loaded properly");
            errors.push("Int misses is  not loaded properly");
          });
      } else if (
        actual_title == "Customer Pay Repair - Labor Target Misses - Light Duty"
      ) {
        logger.info("Repair labor target misses page is visible!!!");

        const H_text = await page.$x(rlts.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        logger.info("Heading text: " + Heading_text_displayed);
        Heading_text_displayed ==
        "Customer Pay Repair - Labor Target Misses - Light Duty"
          ? logger.info(
              "Customer Pay Repair - Labor Target Misses-heading text  is visible!!!"
            )
          : [
              logger.error(
                "Customer Pay Repair - Labor Target Misses-heading text  is visible!!!"
              ),
              errors.push(
                "Customer Pay Repair - Labor Target Misses-heading text  is  not visible!!!"
              ),
            ];
        await page.waitForSelector(rlts.Reset_Layout);
        await page.click(rlts.Reset_Layout);
        logger.info("Reset_Layout clicked !!!");
        await page.waitForTimeout(4000);
        await page
          .waitForSelector(rlts.as_of_data_display, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("data as of display properly");
          })
          .catch(() => {
            logger.error("data as of not display properly");
            errors.push("data as of not display properly");
          });
        await page.waitForTimeout(4000);
        for (let i = 1; i <= 7; i++) {
          const buttons = rlts.dataBtn(i);
          const data_buttons = await page.$x(buttons);
          const as_of_button_displayed: string = await (
            await data_buttons[0].getProperty("textContent")
          ).jsonValue();
          logger.info("" + as_of_button_displayed);
          await page.waitForTimeout(3000);
        }
        (await page.$$eval(rlts.defaultToggle, (txts) =>
          txts.map((txt) => txt.getAttribute("value")).includes("MTD")
        ))
          ? logger.info("default drop down value MTD  is visible")
          : [
              logger.error("default drop down value  MTD  is unavailable"),
              errors.push("default drop down value MTD  is unavailable"),
            ];
        await page.click(rlts.defaultToggle);
        await page.waitForTimeout(3000);
        await page.waitForSelector(rlts.toggleBtn);
        await page.click(rlts.toggleBtn);
        await page.waitForTimeout(5000);
        const tgli = await page.$x(rlts.toggleLi);
        for (let i = 1; i <= tgli.length; i++) {
          const id = rlts.getId(i);
          const el = await page.$x(id);
          await el[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);
          await page.waitForSelector(rlts.toggleBtn);
          await page.click(rlts.toggleBtn);
          await page.waitForTimeout(5000);
        }
        await page
          .waitForXPath(rlts.defaultCPmisses)
          .then(async () => {
            const misses = await page.$x(rlts.defaultCPmisses);
            const detaultMisses = await (
              await misses[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            detaultMisses == "Light Duty"
              ? logger.info("default drop down value CP misses  is visible")
              : [
                  logger.error(
                    "default drop down value Light Duty  is unavailable"
                  ),
                  errors.push(
                    "default drop down value Light Duty  is unavailable"
                  ),
                ];
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });
        await page
          .waitForSelector(rlts.select_Int)
          .then(async () => {
            await page.click(rlts.select_Int);
            await page.waitForTimeout(3000);
            await page.click(rlts.IntMisses);
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });
        await page.waitForTimeout(5000);
        await page
          .$eval(rlts.int_table, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("Heavy Duty table  loaded properly");
          })
          .catch(() => {
            logger.error("Heavy Duty table  is  not loaded properly");
            errors.push("Heavy Duty table  is  not loaded properly");
          });
      } else {
        logger.error("Repair labor target misses page is not available!!!");
        errors.push("Repair labor target misses page is not available");
      }
    } else {
      const actual_title = await page.title();
      logger.info(actual_title);
      if (actual_title == "Customer Pay Repair - Labor Target Misses") {
        logger.info("Repair labor target misses page is visible!!!");
        const H_text = await page.$x(rlts.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        logger.info("Heading text: " + Heading_text_displayed);
        Heading_text_displayed == "Customer Pay Repair - Labor Target Misses"
          ? logger.info(
              "Customer Pay Repair - Labor Target Misses-heading text  is visible!!!"
            )
          : [
              logger.error(
                "Customer Pay Repair - Labor Target Misses-heading text  is visible!!!"
              ),
              errors.push(
                "Customer Pay Repair - Labor Target Misses-heading text  is  not visible!!!"
              ),
            ];
        await page.waitForSelector(rlts.Reset_Layout);
        await page.click(rlts.Reset_Layout);
        logger.info("Reset_Layout clicked !!!");
        await page.waitForTimeout(4000);
        await page
          .waitForSelector(rlts.as_of_data_display, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("data as of display properly");
          })
          .catch(() => {
            logger.error("data as of not display properly");
            errors.push("data as of not display properly");
          });
        await page.waitForTimeout(4000);
        for (let i = 1; i <= 7; i++) {
          const buttons = rlts.dataBtn(i);
          const data_buttons = await page.$x(buttons);
          const as_of_button_displayed: string = await (
            await data_buttons[0].getProperty("textContent")
          ).jsonValue();
          logger.info("" + as_of_button_displayed);

          await page.waitForTimeout(3000);
        }
        (await page.$$eval(rlts.defaultToggle, (txts) =>
          txts.map((txt) => txt.getAttribute("value")).includes("MTD")
        ))
          ? logger.info("default drop down value MTD  is visible")
          : [
              logger.error("default drop down value  MTD  is unavailable"),
              errors.push("default drop down value MTD  is unavailable"),
            ];

        await page.click(rlts.defaultToggle);
        await page.waitForTimeout(3000);
        // Verify all the values inside the Duration list (selection and loads table ):

        await page.waitForSelector(rlts.toggleBtn);
        await page.click(rlts.toggleBtn);
        await page.waitForTimeout(5000);
        const tgli = await await page.$x(rlts.toggleLi);

        for (let i = 1; i <= tgli.length; i++) {
          const id = `//*[@id='menu-']/div[3]/ul/li[${i}]`;
          const el = await page.$x(id);
          await el[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);

          await page.waitForSelector(rlts.toggleBtn);
          await page.click(rlts.toggleBtn);
          await page.waitForTimeout(5000);
        }

        //Default "value CP Misses in "misses" drop down list :

        await page
          .waitForXPath(rlts.defaultCPmisses)
          .then(async () => {
            const misses = await page.$x(rlts.defaultCPmisses);

            const detaultMisses = await (
              await misses[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            detaultMisses == "Customer"
              ? logger.info("default drop down value CP misses  is visible")
              : [
                  logger.error(
                    "default drop down value  CP misses   is unavailable"
                  ),
                  errors.push(
                    "default drop down value CP misses  is unavailable"
                  ),
                ];
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });

        // select value int misses and check the data table loads :

        await page
          .waitForSelector(rlts.select_Int)
          .then(async () => {
            await page.click(rlts.select_Int);
            await page.waitForTimeout(3000);
            await page.click(rlts.IntMisses);
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });

        await page.waitForTimeout(5000);
        const intMissestable = await page.$eval(rlts.int_table, (elem) => {
          return elem.style.display !== "none";
        });
        intMissestable
          ? logger.info("Int misses table  loaded properly")
          : [
              logger.error("Int misses table  is  not loaded properly"),
              errors.push("Int misses is  not loaded properly"),
            ];
      } else if (
        actual_title == "Customer Pay Repair - Labor Target Misses - Light Duty"
      ) {
        logger.info("Repair labor target misses page is visible!!!");

        // Check page heading text :

        const H_text = await page.$x(rlts.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        logger.info("Heading text: " + Heading_text_displayed);
        Heading_text_displayed ==
        "Customer Pay Repair - Labor Target Misses - Light Duty"
          ? logger.info(
              "Customer Pay Repair - Labor Target Misses-heading text  is visible!!!"
            )
          : [
              logger.error(
                "Customer Pay Repair - Labor Target Misses-heading text  is visible!!!"
              ),
              errors.push(
                "Customer Pay Repair - Labor Target Misses-heading text  is  not visible!!!"
              ),
            ];

        //check Reset_Layout  (Button visiblity and clicks):

        await page.waitForSelector(rlts.Reset_Layout);
        await page.click(rlts.Reset_Layout);
        logger.info("Reset_Layout clicked !!!");
        await page.waitForTimeout(4000);

        //check "data as of" display:

        const dataAsOf = await page.$eval(rlts.as_of_data_display, (elem) => {
          return elem.style.display !== "none";
        });

        await page.waitForTimeout(4000);
        dataAsOf
          ? logger.info("data as of display properly")
          : [
              logger.error("data as of not display properly"),
              errors.push("data as of not display properly"),
            ];

        //check the data display for various buttons

        for (let i = 1; i <= 7; i++) {
          const buttons = `//*[@id="root"]/div[2]/div/div/div[4]/div/div/div/button[${i}]/span[1]/h6`;
          const data_buttons = await page.$x(buttons);
          const as_of_button_displayed: string = await (
            await data_buttons[0].getProperty("textContent")
          ).jsonValue();
          logger.info("" + as_of_button_displayed);

          await page.waitForTimeout(3000);
        }

        //default selected (MTD) in "duration" drop  down list :

        (await page.$$eval(rlts.defaultToggle, (txts) =>
          txts.map((txt) => txt.getAttribute("value")).includes("MTD")
        ))
          ? logger.info("default drop down value MTD  is visible")
          : [
              logger.error("default drop down value  MTD  is unavailable"),
              errors.push("default drop down value MTD  is unavailable"),
            ];

        await page.click(rlts.defaultToggle);
        await page.waitForTimeout(3000);
        // Verify all the values inside the Duration list (selection and loads table ):

        await page.waitForSelector(rlts.toggleBtn);
        await page.click(rlts.toggleBtn);
        await page.waitForTimeout(5000);
        const tgli = await await page.$x(rlts.toggleLi);

        for (let i = 1; i <= tgli.length; i++) {
          const id = `//*[@id='menu-']/div[3]/ul/li[${i}]`;
          const el = await page.$x(id);
          await el[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);

          await page.waitForSelector(rlts.toggleBtn);
          await page.click(rlts.toggleBtn);
          await page.waitForTimeout(5000);
        }

        //Default "value CP Misses in "misses" drop down list :

        await page
          .waitForXPath(rlts.defaultCPmisses)
          .then(async () => {
            const misses = await page.$x(rlts.defaultCPmisses);

            const detaultMisses = await (
              await misses[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            detaultMisses == "Light Duty"
              ? logger.info("default drop down value CP misses  is visible")
              : [
                  logger.error(
                    "default drop down value Light Duty  is unavailable"
                  ),
                  errors.push(
                    "default drop down value Light Duty  is unavailable"
                  ),
                ];
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });

        // select value Heavy Duty misses and check the data table loads :

        await page
          .waitForSelector(rlts.select_Int)
          .then(async () => {
            await page.click(rlts.select_Int);
            await page.waitForTimeout(3000);
            await page.click(rlts.IntMisses);
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });

        await page.waitForTimeout(5000);
        const intMissestable = await page.$eval(rlts.int_table, (elem) => {
          return elem.style.display !== "none";
        });
        intMissestable
          ? logger.info("Heavy Duty table  loaded properly")
          : [
              logger.error("Heavy Duty table  is  not loaded properly"),
              errors.push("Heavy Duty table  is  not loaded properly"),
            ];
      } else if (
        actual_title == "Customer Pay Repair - Labor Target Misses - Standard"
      ) {
        logger.info("Repair labor target misses page is visible!!!");

        const H_text = await page.$x(rlts.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        logger.info("Heading text: " + Heading_text_displayed);
        Heading_text_displayed ==
        "Customer Pay Repair - Labor Target Misses - Standard"
          ? logger.info(
              "Customer Pay Repair - Labor Target Misses-heading text  is visible"
            )
          : [
              logger.error(
                "Customer Pay Repair - Labor Target Misses-heading text  is not visible"
              ),
              errors.push(
                "Customer Pay Repair - Labor Target Misses-heading text  is  not visible"
              ),
            ];

        await page.waitForSelector(rlts.Reset_Layout);
        await page.click(rlts.Reset_Layout);
        logger.info("Reset_Layout clicked !!!");
        await page.waitForTimeout(4000);

        const dataAsOf = await page.$eval(rlts.as_of_data_display, (elem) => {
          return elem.style.display !== "none";
        });

        await page.waitForTimeout(4000);
        dataAsOf
          ? logger.info("data as of display properly")
          : [
              logger.error("data as of not display properly"),
              errors.push("data as of not display properly"),
            ];

        //check the data display for various buttons

        for (let i = 1; i <= 7; i++) {
          const buttons = `//*[@id="root"]/div[2]/div/div/div[4]/div/div/div/button[${i}]/span[1]/h6`;
          const data_buttons = await page.$x(buttons);
          const as_of_button_displayed: string = await (
            await data_buttons[0].getProperty("textContent")
          ).jsonValue();
          logger.info("" + as_of_button_displayed);

          await page.waitForTimeout(3000);
        }

        //default selected (MTD) in "duration" drop  down list :

        (await page.$$eval(rlts.defaultToggle, (txts) =>
          txts.map((txt) => txt.getAttribute("value")).includes("MTD")
        ))
          ? logger.info("default drop down value MTD  is visible")
          : [
              logger.error("default drop down value  MTD  is unavailable"),
              errors.push("default drop down value MTD  is unavailable"),
            ];

        await page.click(rlts.defaultToggle);
        await page.waitForTimeout(3000);
        // Verify all the values inside the Duration list (selection and loads table ):

        await page.waitForSelector(rlts.toggleBtn);
        await page.click(rlts.toggleBtn);
        await page.waitForTimeout(5000);
        const tgli = await page.$x(rlts.toggleLi);

        for (let i = 1; i <= tgli.length; i++) {
          const id = `//*[@id='menu-']/div[3]/ul/li[${i}]`;
          const el = await page.$x(id);
          await el[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);

          await page.waitForSelector(rlts.toggleBtn);
          await page.click(rlts.toggleBtn);
          await page.waitForTimeout(5000);
        }

        //Default "value CP Misses in "misses" drop down list :

        await page
          .waitForXPath(rlts.defaultCPmisses)
          .then(async () => {
            const misses = await page.$x(rlts.defaultCPmisses);

            const detaultMisses = await (
              await misses[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            detaultMisses == "Light Duty"
              ? logger.info("default drop down value CP misses  is visible")
              : [
                  logger.error(
                    "default drop down value Light Duty  is unavailable"
                  ),
                  errors.push(
                    "default drop down value Light Duty  is unavailable"
                  ),
                ];
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });

        // select value Heavy Duty misses and check the data table loads :

        await page
          .waitForSelector(rlts.select_Int)
          .then(async () => {
            await page.click(rlts.select_Int);
            await page.waitForTimeout(3000);
            await page.click(rlts.IntMisses);
          })
          .catch(() => {
            logger.warn("misses selection is not available");
          });

        await page.waitForTimeout(5000);
        const intMissestable = await page.$eval(rlts.int_table, (elem) => {
          return elem.style.display !== "none";
        });
        intMissestable
          ? logger.info("Heavy Duty table  loaded properly")
          : [
              logger.error("Heavy Duty table  is  not loaded properly"),
              errors.push("Heavy Duty table  is  not loaded properly"),
            ];
      } else {
        logger.error("Repair labor target misses page is not available!!!");
        errors.push("Repair labor target misses page is not available");
      }
    }

    ts.assert(
      errors.length == 0,
      `Error in Repair labor target misses Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsrepairlabortargetmissesTest();
