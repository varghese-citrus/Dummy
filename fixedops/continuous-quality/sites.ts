import {
  inspect as insp,
  inspectText as inspT,
  queryableHTML as qh,
  safeHttpClient as shc,
  urlcat,
} from "./deps.ts";

import { AssuranceCaseMetrics } from "./metrics.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const siteID = Deno.env.get("FOPC_SITE_ID");

export interface Site {
  readonly name: string;
  readonly baseURL: string;
  readonly metrics: AssuranceCaseMetrics;
  readonly pageUrl: (path: string, params?: urlcat.ParamMap) => string;
  readonly inspectPage: (
    req: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ) => Promise<RequestInfo | shc.RequestInfoInspectionResult>;
  readonly getPageHTML: (
    req: RequestInfo,
    ...inspectors: shc.RequestInfoInspector[]
  ) => Promise<RequestInfo | shc.RequestInfoInspectionResult>;
}

export class FixedopsMain {
  constructor(readonly name: string, readonly baseURL: string) {}

  pageUrl(path: string, params?: urlcat.ParamMap): string {
    return urlcat.default(this.baseURL, path, { ...params });
  }
  siteTraverseOptions(
    _metrics: AssuranceCaseMetrics,
    _request: RequestInfo,
    override?: Partial<shc.TraverseOptions>
  ): shc.TraverseOptions {
    return {
      riInspector:
        override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector:
        override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent:
        override?.htmlContent ||
        insp.inspectionPipe<qh.HtmlSourceSupplier, string, Error>(
          qh.inspectQueryableHtmlContent,
          qh.inspectCuratableContent,
          qh.inspectCurationTitle
        ),
    };
  }
  siteTraverseOptionClaims(
    _metrics: AssuranceCaseMetrics,
    override?: Partial<shc.TraverseOptions>
  ): shc.TraverseOptions {
    return {
      riInspector:
        override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector:
        override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent:
        override?.htmlContent ||
        insp.inspectionPipe<qh.HtmlSourceSupplier, string, Error>(
          qh.inspectQueryableHtmlContent,
          qh.inspectCuratableContent,
          qh.inspectCurationTitle
        ),
    };
  }
  queryableHtmlContent(
    override?: Partial<shc.TraverseOptions>
  ): shc.TraverseOptions {
    return {
      riInspector:
        override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector:
        override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent:
        override?.htmlContent ||
        insp.inspectionPipe<qh.HtmlSourceSupplier, string, Error>(
          qh.inspectQueryableHtmlContent
        ),
    };
  }
  async inspectPage(
    request: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    let isFixedops = true;
    if (siteID?.includes("fixedops")) {
      isFixedops = false;
    }
    const result = await shc.traverse(
      {
        request: request,
        options: isFixedops
          ? this.siteTraverseOptions(metrics, request)
          : this.siteTraverseOptionClaims(metrics),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      shc.inspectMetaRefreshRedirect,
      shc.maxPageLoadDurationInspector(4000),
      ...inspectors
    );
    return result;
  }
  async getPageHTML(
    request: RequestInfo,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    const result = await shc.traverse(
      {
        request: request,
        options: this.queryableHtmlContent(),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      ...inspectors
    );
    return result;
  }
}

export abstract class FixedopsSite extends FixedopsMain implements Site {
  constructor(
    readonly name: string,
    readonly baseURL: string,
    readonly metrics: AssuranceCaseMetrics
  ) {
    super(name, baseURL);
  }
}

export abstract class Fixedops extends FixedopsMain implements Site {
  constructor(
    readonly name: string,
    readonly baseURL: string,
    readonly metrics: AssuranceCaseMetrics
  ) {
    super(name, baseURL);
  }
  inspectRobotSiteMap(
    _metrics: AssuranceCaseMetrics,
    override?: Partial<shc.TraverseOptions>
  ): shc.TraverseOptions {
    return {
      riInspector:
        override?.riInspector ||
        insp.inspectionPipe(inspT.removeUrlRequestTrackingCodes),
      turlInspector:
        override?.turlInspector ||
        insp.inspectionPipe(inspT.removeUrlTextTrackingCodes),
      htmlContent:
        override?.htmlContent ||
        insp.inspectionPipe<qh.HtmlSourceSupplier, string, Error>(
          qh.inspectQueryableHtmlContent
        ),
    };
  }
  async inspectRobotFiles(
    request: RequestInfo,
    metrics: AssuranceCaseMetrics,
    ...inspectors: shc.RequestInfoInspector[]
  ): Promise<RequestInfo | shc.RequestInfoInspectionResult> {
    const result = await shc.traverse(
      {
        request: request,
        options: this.inspectRobotSiteMap(metrics),
      },
      shc.inspectHttpStatus,
      shc.inspectTextContent,
      shc.inspectHtmlContent,
      ...inspectors
    );
    return result;
  }
}

const metrics = new AssuranceCaseMetrics("nets_fixedops_dpo_");

export class Fixedops2022Development extends FixedopsSite {
  constructor() {
    super(
      "2022 Publication",
      "https://koeppel-demo.fixedops.cc/auth/login",
      metrics
    );
  }
}
export class FixedopsProductionSite extends FixedopsSite {
  constructor() {
    super("Koeppelag Production", "https://koeppelag.fixedopspc.com/", metrics);
  }
}

export class FixedOpsBillKnightSite extends FixedopsSite {
  constructor() {
    super("2022 Billknight", "https://billknightag-demo.fixedops.cc", metrics);
  }
}

export class FixedOpsBillKnightProSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Billknight Production",
      "https://billknightag.fixedopspc.com/auth/login",
      metrics
    );
  }
}

export class FixedOpsCliffHarrisSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Cliffhariss",
      "https://cliffharrisag-demo.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedOpsCliffHarrisProSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Cliffharis Production",
      "https://cliffharrisag.fixedopspc.com/auth/login",
      metrics
    );
  }
}
export class FixedOpsStiversagSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Stiversag",
      "https://stiversag-demo.fixedops.cc/auth/login",
      metrics
    );
  }
}
export class FixedOpsStiversagProSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Stiversag Production",
      "https://stiversag.fixedopspc.com/auth/login",
      metrics
    );
  }
}
export class FixedOpsSawyerMotorsSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Sawayer Motors",
      "https://sawyermotors-demo.fixedops.cc/auth/login",
      metrics
    );
  }
}
export class FixedOpsSawyerMotorsProSite extends FixedopsSite {
  constructor() {
    super(
      "2022 Sawayer Motors Production",
      "https://sawyermotors.fixedopspc.com/auth/login",
      metrics
    );
  }
}
export class Fixedops2022Demoag extends FixedopsSite {
  constructor() {
    super(
      "2022 Publication",
      "https://demoag.fixedopspc.com/auth/login",
      metrics
    );
  }
}

export class Fixedops2022SuntrupDemo extends FixedopsSite {
  constructor() {
    super("2022 Suntrupdemo", "https://suntrupag-demo.fixedops.cc/", metrics);
  }
}

export class Fixedops2022Suntrup extends FixedopsSite {
  constructor() {
    super(
      "2022 Suntrup",
      "https://suntrupag.fixedopspc.com/auth/login",
      metrics
    );
  }
}

export class Fixedops2022KevinProSite extends FixedopsSite {
  constructor() {
    super(
      "2022 KevinWhitaker Production",
      "https://kevinwhitakerag.fixedopspc.com/auth/login",
      metrics
    );
  }
}

export class Fixedops2022Kevin extends FixedopsSite {
  constructor() {
    super(
      "2022 KevinWhitaker",
      "https://kevinwhitaker-demo.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedopsKoeppelagSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Koeppelag simt",
      "https://koeppelag-simt.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedopsBillKnightSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Bill Knight simt",
      "https://billknightag-simt.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedopsStiversagSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Stiversag simt",
      "https://stiversag-simt.fixedops.cc/auth/login",
      metrics
    );
  }
}
export class FixedopsCliffharrisagSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Cliffharrisag simt",
      "https://cliffharrisag-simt.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedopsSawyermotorsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Sawyermotors simt",
      "https://sawyermotors-simt.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedopsStiversagAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Stiversag aws simt",
      "https://stiversag-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopscliffharrisagAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Cliffharrisag aws simt",
      "https://cliffharrisag-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopsBillknightagAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Billknightag aws simt",
      "https://billknightag-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopsKoeppelagAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Koeppelag aws simt",
      "https://koeppelag-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopsKevinwhitakerAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Kevinwhitaker aws simt",
      "https://kevinwhitaker-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopsDemoagAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Demoag aws simt",
      "https://demoag-simt.fixedopspc.com",
      metrics
    );
  }
}
export class FixedopsSuntrupagAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Suntrupag aws simt",
      "https://suntrupag-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopsSawyermotorsAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "2022 Sawyer motors aws simt",
      "https://sawyermotors-simt.fixedopspc.com",
      metrics
    );
  }
}

export class Fixedops2022NationwideProduction extends FixedopsSite {
  constructor() {
    super(
      "2022 Nationwide Production",
      "https://nationwidems.fixedopspc.com/",
      metrics
    );
  }
}

export class FixedopsNationwideAwsSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "Nationwide aws simt",
      "https://nationwidemsag-simt.fixedopspc.com",
      metrics
    );
  }
}

export class FixedopsFirstTeamagSimt2022 extends FixedopsSite {
  constructor() {
    super(
      "First teamag simt",
      "https://firstteamag-simt.fixedops.cc/auth/login",
      metrics
    );
  }
}

export class FixedopsFirstTeamag2022 extends FixedopsSite {
  constructor() {
    super(
      "First teamag production",
      "https://firstteamag.fixedopspc.com/auth/login",
      metrics
    );
  }
}

export const fixedops20222Development = new Fixedops2022Development();
export const fixedopsProduction = new FixedopsProductionSite();
export const fixedopsBillKnight = new FixedOpsBillKnightSite();
export const fixedopsBillKnightPro = new FixedOpsBillKnightProSite();
export const fixedopsCliffHarris = new FixedOpsCliffHarrisSite();
export const fixedopsCliffHarrisPro = new FixedOpsCliffHarrisProSite();
export const FixedOpsStiversag = new FixedOpsStiversagSite();
export const FixedopsStiversagPro = new FixedOpsStiversagProSite();
export const FixedOpsSawyerMotors = new FixedOpsSawyerMotorsSite();
export const FixedOpsSawyerMotorsPro = new FixedOpsSawyerMotorsProSite();
export const FixedOpsDemoag2022 = new Fixedops2022Demoag();
export const FixedopsSuntrupDemo = new Fixedops2022SuntrupDemo();
export const FixedOpsSuntrup2022 = new Fixedops2022Suntrup();
export const FixedOpsKevin2022 = new Fixedops2022Kevin();
export const FixedOpsKevinPro2022 = new Fixedops2022KevinProSite();
export const FixedOpsKoeppelagSimt = new FixedopsKoeppelagSimt2022();
export const FixedOpsBillKnightSimt = new FixedopsBillKnightSimt2022();
export const FixedopsStiversagSimt = new FixedopsStiversagSimt2022();
export const FixedopsCliffharrisagSimt = new FixedopsCliffharrisagSimt2022();
export const FixedopsSawyermotorsSimt = new FixedopsSawyermotorsSimt2022();
export const FixedopsStiversagAwsSimt = new FixedopsStiversagAwsSimt2022();
export const FixedopscliffharrisagAwsSimt =
  new FixedopscliffharrisagAwsSimt2022();
export const FixedopsBillknightagAwsSimt =
  new FixedopsBillknightagAwsSimt2022();
export const FixedopsKoeppelagAwsSimt = new FixedopsKoeppelagAwsSimt2022();
export const FixedopsKevinwhitakerAwsSimt =
  new FixedopsKevinwhitakerAwsSimt2022();
export const FixedopsDemoagAwsSimt = new FixedopsDemoagAwsSimt2022();
export const FixedopsSuntrupagAwsSimt = new FixedopsSuntrupagAwsSimt2022();
export const FixedopsSawyermotorsAwsSimt =
  new FixedopsSawyermotorsAwsSimt2022();
export const FixedopsNationwidePro2022 = new Fixedops2022NationwideProduction();
export const FixedopsNationwideAwsSimt = new FixedopsNationwideAwsSimt2022();
export const FixedopsFirstTeamagSimt = new FixedopsFirstTeamagSimt2022();
export const FixedopsFirstTeamag = new FixedopsFirstTeamag2022();
export const sitesToInspect: Site[] = [];

if (siteID) {
  switch (siteID) {
    case "development2022":
      sitesToInspect.push(fixedops20222Development);
      break;
    case "production":
      sitesToInspect.push(fixedopsProduction);
      break;
    case "billknight2022":
      sitesToInspect.push(fixedopsBillKnight);
      break;
    case "billknightpro2022":
      sitesToInspect.push(fixedopsBillKnightPro);
      break;
    case "cliffharris2022":
      sitesToInspect.push(fixedopsCliffHarris);
      break;
    case "cliffharrispro2022":
      sitesToInspect.push(fixedopsCliffHarrisPro);
      break;

    case "stiversag2022":
      sitesToInspect.push(FixedOpsStiversag);
      break;
    case "stiversagpro2022":
      sitesToInspect.push(FixedopsStiversagPro);
      break;

    case "sawyermotors2022":
      sitesToInspect.push(FixedOpsSawyerMotors);
      break;
    case "sawyermotorspro2022":
      sitesToInspect.push(FixedOpsSawyerMotorsPro);
      break;

    case "demoag2022":
      sitesToInspect.push(FixedOpsDemoag2022);
      break;

    case "suntrupdemo2022":
      sitesToInspect.push(FixedopsSuntrupDemo);
      break;

    case "suntrup2022":
      sitesToInspect.push(FixedOpsSuntrup2022);
      break;

    case "kevin2022":
      sitesToInspect.push(FixedOpsKevin2022);
      break;

    case "kevinpro2022":
      sitesToInspect.push(FixedOpsKevinPro2022);
      break;

    case "koeppelagsimt2022":
      sitesToInspect.push(FixedOpsKoeppelagSimt);
      break;

    case "billknightsimt2022":
      sitesToInspect.push(FixedOpsBillKnightSimt);
      break;
    case "stiversagsimt2022":
      sitesToInspect.push(FixedopsStiversagSimt);
      break;
    case "cliffharrisagsimt2022":
      sitesToInspect.push(FixedopsCliffharrisagSimt);
      break;
    case "sawyermotorsimt2022":
      sitesToInspect.push(FixedopsSawyermotorsSimt);
      break;
    case "stiversagawssimt2022":
      sitesToInspect.push(FixedopsStiversagAwsSimt);
      break;
    case "cliffharrisagawssimt2022":
      sitesToInspect.push(FixedopscliffharrisagAwsSimt);
      break;
    case "billknightagawssimt2022":
      sitesToInspect.push(FixedopsBillknightagAwsSimt);
      break;
    case "koeppelagawssimt2022":
      sitesToInspect.push(FixedopsKoeppelagAwsSimt);
      break;
    case "kevinwhitakerawssimt2022":
      sitesToInspect.push(FixedopsKevinwhitakerAwsSimt);
      break;
    case "demoagawssimt2022":
      sitesToInspect.push(FixedopsDemoagAwsSimt);
      break;
    case "suntrupagawssimt2022":
      sitesToInspect.push(FixedopsSuntrupagAwsSimt);
      break;
    case "sawyermotorsawssimt2022":
      sitesToInspect.push(FixedopsSawyermotorsAwsSimt);
      break;
    case "nationwidepro2022":
      sitesToInspect.push(FixedopsNationwidePro2022);
      break;
    case "nationwideawsimt2022":
      sitesToInspect.push(FixedopsNationwideAwsSimt);
      break;
    case "firstteamagsimt2022":
      sitesToInspect.push(FixedopsFirstTeamagSimt);
      break;
    case "firstteamag2022":
      sitesToInspect.push(FixedopsFirstTeamag);
      break;
  }
} else {
  logger.error("please pass valid site id!");
}
