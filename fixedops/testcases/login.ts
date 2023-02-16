// deno-lint-ignore-file
import { testingAsserts as ts } from "../deps-test.ts";
import { openBrowser } from "../fixedops-home.ts";
import { getSitesToInspect } from "../sites.ts";
import { LoginSelectors as lg } from "../selectors/login.ts";
import { switchController } from "../continuous-quality/role-handle.ts";
import { startLogger } from "../utilities/utils.ts";

const credentials = switchController();
const storeName: any = Deno.env.get("STORE");
const role = Deno.env.get("ROLE");
const logger = startLogger();
const errors: string[] = [];

function fixedOpsLoginTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0139] ${site.name} FixedOps Login Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0139",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await loginTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Login Page Test";
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

async function loginTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await openBrowser(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = page.waitForNavigation({
      waitUntil: ["domcontentloaded", "networkidle0", "load"],
    });
    (await page.$$eval(lg.logo, (imgs) =>
      imgs
        .map((img) => img.getAttribute("src"))
        .includes("/images/logos/armatus-new-logo.png")
    ))
      ? logger.info("logo visible")
      : [logger.error("logo not visible"), errors.push("logo not visible")];

    await page
      .waitForSelector(lg.contactIcon, {
        visible: true,
        timeout: 4000,
      })
      .then(async () => {
        logger.info("contact icon visible properly");
        await page.hover(lg.contactIcon);
        await page.waitForTimeout(2000);

        const tooltipTitle = await page.$eval(
          lg.tooltip,
          (element) => element.textContent
        );
        await page.waitForTimeout(2000);
        tooltipTitle
          .toString()
          .includes("Contact Us +1 (443) 391-8502911@fixedopspc.com")
          ? logger.info("contact details verification success")
          : [
              logger.error("contact details verification failed"),
              errors.push("contact details verification failed"),
            ];
      })
      .catch(() => {
        logger.error("contact icon not visible properly");
        errors.push("contact icon not visible properly");
      });

    await page.waitForSelector(lg.signButton);
    await page.click(lg.signButton);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("sign into dashboard button clicked");

    const username = credentials.user;
    const password = credentials.pass;

    await page.type(lg.password, "hafshgafd");
    await page.waitForTimeout(2000);
    logger.info("password entered");

    await page
      .waitForSelector(lg.hidePassword, {
        visible: true,
        timeout: 4000,
      })
      .then(async () => {
        logger.info("hide password element visible properly");
        const hide = await page.$$eval(lg.hidePassword, (el) =>
          el.map((e) => e.getAttribute("type")).includes("password")
        );
        if (hide) {
          await page.waitForSelector(lg.eyeIcon);
          await page.click(lg.eyeIcon);
          await page.waitForTimeout(4000);

          (await page.$$eval(lg.showPassword, (el) =>
            el.map((e) => e.getAttribute("type")).includes("text")
          ))
            ? logger.info("password show/hide working properly")
            : [
                logger.error("password show/hide not working properly"),
                errors.push("password show/hide not working properly"),
              ];
        } else {
          logger.error("type attribute should be password");
          errors.push("type attribute should be password");
        }
      })
      .catch(() => {
        logger.error("hide password element not visible properly");
        errors.push("hide password element not visible properly");
      });

    await page.reload();
    await page.waitForTimeout(10000);
    await page.waitForSelector(lg.signIn);
    await page.type(lg.username, username);
    logger.info("username entered");
    await page.waitForTimeout(2000);
    await page.type(lg.password, password);
    logger.info("password entered");
    await page.waitForTimeout(2000);
    await page.click(lg.signIn);
    logger.info("sign button clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    await page.waitForSelector(lg.userIcon);
    await page.click(lg.userIcon);
    logger.info("user icon clicked");
    await navigationPromise;
    await page.waitForSelector(lg.roleSpan);
    const element = await page.$(lg.roleSpan);
    const value = await page.evaluate((el) => el.textContent, element);
    if (value.trim() == credentials.role.trim()) {
      logger.info("role check successful");
      await page.reload();
      await page.waitForTimeout(4000);

      await page.click(lg.storeSelect);
      await page.waitForTimeout(3000);

      await page
        .waitForSelector(lg.koeppelStore(storeName))
        .then(async () => {
          await page.click(lg.koeppelStore(storeName));
          await page.waitForTimeout(4000);
          logger.info("store selected");

          await page.click(lg.btnViewDashborad);
          logger.info("view dashboard button clicked");
          await navigationPromise;
          await page.waitForTimeout(15000);
          const text = await page.$eval("h6", (element) => element.textContent);
          text != null
            ? logger.info(`${text} displayed`)
            : [
                logger.error("storename not displayed"),
                errors.push("storename not displayed"),
              ];
          await page.waitForSelector(lg.userIcon);
          await page.click(lg.userIcon);
          logger.info("user icon clicked!!!");
          await navigationPromise;
          await page.waitForTimeout(5000);
          await page.waitForSelector(lg.signOut);
          await page.click(lg.signOut);
          logger.info("signout button clicked");
          await navigationPromise;
          await page.waitForTimeout(12000);
          await page.click(lg.signOutOk);
          logger.info("signout ok button clicked");
          await navigationPromise;
          logger.info("signout from application");
          await page.waitForTimeout(5000);
        })
        .catch(() => {
          logger.error("please provide valid store name as per role");
          errors.push("please provide valid store name as per role");
        });
    } else {
      logger.error("role check unsuccessful");
      errors.push("role check unsuccessful");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLoginTest();
