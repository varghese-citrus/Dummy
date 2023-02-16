import { testingAsserts as ts } from "../deps-test.ts";
import { openBrowser } from "../fixedops-home.ts";
import { getSitesToInspect } from "../sites.ts";
import { LoginSelectors as lg } from "../selectors/login.ts";
import { switchController } from "../continuous-quality/role-handle.ts";
import { startLogger } from "../utilities/utils.ts";

const credentials = switchController();
const logger = startLogger();
const errors: string[] = [];

function fixedOpsLoginDataDrivenTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0138] ${site.name} FixedOps Login Data Driven Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0138",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await loginDataDrivenTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Login Data Driven Test";
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

async function loginDataDrivenTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await openBrowser(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = page.waitForNavigation({
      waitUntil: ["domcontentloaded", "networkidle0", "load"],
    });
    const user: string = credentials.username;
    const pass: string = credentials.password;
    const data = [
      { username: "", password: "" },
      { username: "userjjhaavch", password: "sgdjsahgd23" },
      { username: `"${user}"`, password: "1234567" },
      { username: "sfdsdkjhasdka", password: `"${pass}"` },
    ];
    const lgTitle = await page.title();
    if (lgTitle == "Login") {
      await page
        .waitForSelector(lg.logo, { visible: true, timeout: 4000 })
        .then(async () => {
          logger.info("logo visible properly");
          await page
            .$$eval(lg.logo, (imgs) =>
              imgs
                .map((img) => img.getAttribute("src"))
                .includes("/images/logos/armatus-new-logo.png")
            )
            .then(() => {
              logger.info("logo verification success");
            })
            .catch(() => {
              logger.error("logo verification failed");
              errors.push("logo verification failed");
            });
        })
        .catch(() => {
          logger.error("logo not visible properly");
          errors.push("logo not visible properly");
        });

      await page
        .waitForSelector(lg.contactIcon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("contact icon visible properly");
          await page.waitForTimeout(2000);

          await page.hover(lg.contactIcon);
          await page.waitForTimeout(2000);

          const tooltipTitle = await page.$eval(
            lg.tooltip,
            (element) => element.textContent
          );
          tooltipTitle
            .toString()
            .includes("Contact Us +1 (443) 391-8502911@fixedopspc.com")
            ? logger.info("contact details present")
            : [
                logger.info("contact details not present"),
                errors.push("contact details not present"),
              ];
        })
        .catch(() => {
          logger.error("contact icon not visible properly");
          errors.push("contact icon not visible properly");
        });

      await page.waitForSelector(lg.signButton);
      await page.click(lg.signButton);
      await navigationPromise;
      await page.waitForTimeout(4000);
      logger.info("sign in dashboard button clicked!!!");

      const sgTitle: string = await page.title();
      const titleArr = [
        "Sign in to Koeppel Auto Group",
        "Sign in to koeppelag",
        "Sign in to Bill Knight Auto Group",
        "Sign in to Demo Automotive Group",
        "Sign in to Stivers Auto Group",
        "Sign in to Cliff Harris Auto Group",
        "Sign in to Sawyer Motors",
        "Sign in to Kevin Whitaker Auto Group",
        "Sign in to Suntrup Automotive Group",
        "Sign in to Nationwide Motor Sales Corp",
        "Sign in to Nationwide Auto Group",
        "Sign in to First Team Auto Group",
      ];
      const res = titleArr.filter((str) => {
        return str.includes(sgTitle);
      });

      if (sgTitle.includes(res[0])) {
        logger.info("title verification success");
        await page.waitForTimeout(5000);

        await page
          .waitForSelector(lg.signInLogo, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            const signLogo = await page.$$eval(lg.signInLogo, (imgs) =>
              imgs
                .map((img) => img.getAttribute("src"))
                .includes(
                  "/auth/resources/jfpg1/login/customArmatusOT/img/armatus-new-logo.png"
                )
            );
            signLogo
              ? logger.info("logo visible")
              : [
                  logger.error("logo not visible"),
                  errors.push("logo not visible"),
                ];
          });

        await page
          .waitForSelector(lg.signContactIcon, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            logger.info("contact icon visible properly");
            await page.waitForTimeout(2000);

            await page.hover(lg.signContactIcon);
            await page.waitForTimeout(2000);

            const tooltipTitle = await page.$eval(
              lg.signTp,
              (element) => element.textContent
            );

            tooltipTitle
              .toString()
              .replace(/(\r\n|\n|\r)/gm, " ")
              .trim()
              .includes(
                "Contact us        phone+1 (443) 391-8502     email   911@fixedopspc.com"
              )
              ? logger.info("contact icon details present")
              : [
                  logger.error("contact icon details not present"),
                  errors.push("contact icon details not present"),
                ];
          })
          .catch(() => {
            logger.error("contact icon not visible"),
              errors.push("contact icon not visible");
          });

        const msg = [
          "empty username and password entered",
          "invalid username and password entered",
          "valid username and invalid password entered",
          "invalid username and valid password entered",
        ];

        for (let i = 0; i <= data.length - 1; i++) {
          const username = data[i].username;
          const password = data[i].password;
          await page.type(lg.username, username);
          await page.waitForTimeout(2000);
          await page.type(lg.password, password);
          logger.info(`${msg[i]}`);
          await page.click(lg.signIn);
          logger.info("login button clicked");
          await navigationPromise;
          await page.waitForTimeout(10000);

          await page
            .waitForXPath(lg.signErrMsg)
            .then(async () => {
              const el = await page.$x(lg.signErrMsg);
              const errMsg = await page.evaluate((el) => el.textContent, el[0]);
              errMsg.toString().includes("Invalid username or password.")
                ? logger.info("login validation success")
                : [
                    logger.error("login validation failed"),
                    errors.push("login validation failed"),
                  ];
            })
            .catch(() => {
              logger.warn("error message element not found");
            });
        }
      } else {
        logger.error("title verification failed in sign in page");
        errors.push("title verification failed in sign in page");
      }
    } else {
      logger.error("Login page title verification failed!!!");
      errors.push("Login page title verification failed!!!");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Header and Footer: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLoginDataDrivenTest();
