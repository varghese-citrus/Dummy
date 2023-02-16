import { Site, sitesToInspect } from "./continuous-quality/sites.ts";
import { AssuranceCaseMetrics } from "./continuous-quality/metrics.ts";

type MutableSite = {
  -readonly [K in keyof Site]: Site[K];
};

function getSitesToInspect(): Site[] {
  const metrics = new AssuranceCaseMetrics("nets_fixedops_dpo_uit_");

  sitesToInspect.forEach((site) => {
    const mutSite: MutableSite = site;
    mutSite.metrics = metrics;
  });
  return sitesToInspect;
}

export { getSitesToInspect };
