// deno-lint-ignore-file
import { config } from "../deps-test.ts";
import { startLogger } from "../utilities/utils.ts";

const role = Deno.env.get("ROLE");
const siteId = Deno.env.get("FOPC_SITE_ID");
const logger = startLogger();

const env = config({
  path: "../.env",
  safe: true,
});

function switchController() {
  let value: any;
  if (siteId == "development2022" || (siteId == "production" && role != null)) {
    switch (role) {
      case "admin": {
        if (siteId == "development2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "ford_client": {
        value = {
          user: env.ford_client_username,
          pass: env.ford_client_password,
          role: env.client_role,
        };
        break;
      }
      case "ford_user": {
        value = {
          user: env.ford_user_username,
          pass: env.ford_user_password,
          role: env.user_role,
        };
        break;
      }
      case "hyundai_client": {
        value = {
          user: env.hyundai_client_username,
          pass: env.hyundai_client_password,
          role: env.client_role,
        };
        break;
      }
      case "hyundai_user": {
        value = {
          user: env.hyundai_user_username,
          pass: env.hyundai_user_password,
          role: env.user_role,
        };
        break;
      }
      case "mazda_client": {
        value = {
          user: env.mazda_client_username,
          pass: env.mazda_client_password,
          role: env.client_role,
        };
        break;
      }
      case "mazda_user": {
        value = {
          user: env.mazda_user_username,
          pass: env.mazda_user_password,
          role: env.user_role,
        };
        break;
      }
      case "nissan_client": {
        value = {
          user: env.nissan_client_username,
          pass: env.nissan_client_password,
          role: env.client_role,
        };
        break;
      }
      case "nissan_user": {
        value = {
          user: env.nissan_user_username,
          pass: env.nissan_user_password,
          role: env.user_role,
        };
        break;
      }
      case "subaru_client": {
        value = {
          user: env.subaru_client_username,
          pass: env.subaru_client_password,
          role: env.client_role,
        };
        break;
      }
      case "subaru_user": {
        value = {
          user: env.subaru_user_username,
          pass: env.subaru_user_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else if (
    siteId == "billknight2022" ||
    siteId == "billknightpro2022" ||
    siteId == "billknightagawssimt2022" ||
    (siteId == "billknightsimt2022" && role != null)
  ) {
    switch (role) {
      case "billknight_admin": {
        if (siteId == "billknight2022" || siteId == "billknightsimt2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "billknight_ford_client": {
        value = {
          user: env.billknight_ford_client_username,
          pass: env.billknight_ford_client_password,
          role: env.client_role,
        };
        break;
      }
      case "ford_user": {
        value = {
          user: env.billknight_ford_user_username,
          pass: env.billknight_ford_user_password,
          role: env.user_role,
        };
        break;
      }
      case "stillwater_client": {
        value = {
          user: env.billknight_stillwater_client_username,
          pass: env.billknight_stillwater_client_password,
          role: env.client_role,
        };
        break;
      }
      case "stillwater_user": {
        value = {
          user: env.billknight_stillwater_user_username,
          pass: env.billknight_stillwater_user_password,
          role: env.user_role,
        };
        break;
      }
      case "volvo_client": {
        value = {
          user: env.billknight_volvo_client_username,
          pass: env.billknight_volvo_client_password,
          role: env.client_role,
        };
        break;
      }
      case "volvo_user": {
        value = {
          user: env.billknight_volvo_user_username,
          pass: env.billknight_volvo_user_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else if (
    siteId == "cliffharris2022" ||
    siteId == "cliffharrisagsimt2022" ||
    siteId == "cliffharrisagawssimt2022" ||
    (siteId == "cliffharrispro2022" && role != null)
  ) {
    switch (role) {
      case "cliffharris_admin": {
        if (siteId == "cliffharris2022" || siteId == "cliffharrisagsimt2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "fiat_client": {
        value = {
          user: env.cliffharris_fiat_client_username,
          pass: env.cliffharris_fiat_client_password,
          role: env.client_role,
        };
        break;
      }
      case "fiat_user": {
        value = {
          user: env.cliffharris_fiat_user_username,
          pass: env.cliffharris_fiat_user_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else if (
    siteId == "stiversag2022" ||
    siteId == "stiversagsimt2022" ||
    siteId == "stiversagawssimt2022" ||
    (siteId == "stiversagpro2022" && role != null)
  ) {
    switch (role) {
      case "stiversag_admin": {
        if (siteId == "stiversag2022" || siteId == "stiversagsimt2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "hyundai_client": {
        value = {
          user: env.stiversag_hyundai_client_username,
          pass: env.stiversag_hyundai_client_password,
          role: env.client_role,
        };
        break;
      }
      case "hyundai_user": {
        value = {
          user: env.stiversag_hyundai_user_username,
          pass: env.stiversag_hyundai_user_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else if (
    siteId == "sawyermotors2022" ||
    siteId == "sawyermotorsimt2022" ||
    siteId == "sawyermotorsawssimt2022" ||
    (siteId == "sawyermotorspro2022" && role != null)
  ) {
    switch (role) {
      case "sawyermotors_admin": {
        if (siteId == "sawyermotors2022" || siteId == "sawyermotorsimt2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "sawyer_user": {
        value = {
          user: env.sawyer_user_username,
          pass: env.sawyer_user_password,
          role: env.user_role,
        };
        break;
      }
      case "sawyer_client": {
        value = {
          user: env.sawyer_client_username,
          pass: env.sawyer_client_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }

    return value;
  } else if (
    siteId == "demoag2022" ||
    (siteId == "demoagawssimt2022" && role != null)
  ) {
    switch (role) {
      case "admin": {
        value = {
          user: env.prousername,
          pass: env.password,
          role: env.admin_role,
        };

        break;
      }
      case "abc_client": {
        value = {
          user: env.demoag_client_abc_username,
          pass: env.demoag_client_abc_password,
          role: env.client_role,
        };
        break;
      }
      case "abc_user": {
        value = {
          user: env.demo_user_username,
          pass: env.demo_user_password,
          role: env.user_role,
        };
        break;
      }
      case "xyz_client": {
        value = {
          user: env.demoag_client_xyz_username,
          pass: env.demoag_client_xyz_password,
          role: env.client_role,
        };
        break;
      }
      case "xyz_user": {
        value = {
          user: env.demo_user_username,
          pass: env.demo_user_password,
          role: env.user_role,
        };
        break;
      }

      default:
        null;
    }
    return value;
  } else if (
    siteId == "suntrup2022" ||
    siteId == "suntrupagawssimt2022" ||
    (siteId == "suntrupdemo2022" && role != null)
  ) {
    switch (role) {
      case "admin": {
        if (siteId == "suntrupagawssimt2022" || siteId == "suntrup2022") {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "client": {
        value = {
          user: env.suntrup_client_username,
          pass: env.suntrup_client_password,
          role: env.client_role,
        };
        break;
      }
      case "user": {
        value = {
          user: env.suntrup_user_username,
          pass: env.suntrup_user_password,
          role: env.user_role,
        };
        break;
      }

      default:
        null;
    }
    return value;
  } else if (
    siteId == "kevin2022" ||
    siteId == "kevinwhitakerawssimt2022" ||
    (siteId == "kevinpro2022" && role != null)
  ) {
    switch (role) {
      case "kevin_admin": {
        if (siteId == "kevin2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "kevin_client": {
        value = {
          user: env.kevin_client_username,
          pass: env.kevin_client_password,
          role: env.client_role,
        };
        break;
      }
      case "kevin_user": {
        value = {
          user: env.kevin_user_username,
          pass: env.kevin_user_password,
          role: env.user_role,
        };
        break;
      }

      default:
        null;
    }
    return value;
  } else if (
    siteId == "koeppelagsimt2022" ||
    (siteId == "koeppelagawssimt2022" && role != null)
  ) {
    switch (role) {
      case "admin": {
        if (siteId == "koeppelagsimt2022") {
          value = {
            user: env.username,
            pass: env.password,
            role: env.admin_role,
          };
        } else {
          value = {
            user: env.prousername,
            pass: env.password,
            role: env.admin_role,
          };
        }

        break;
      }
      case "ford_client": {
        value = {
          user: env.ford_client_username,
          pass: env.ford_client_password,
          role: env.client_role,
        };
        break;
      }
      case "ford_user": {
        value = {
          user: env.ford_user_username,
          pass: env.ford_user_password,
          role: env.user_role,
        };
        break;
      }
      case "hyundai_client": {
        value = {
          user: env.hyundai_client_username,
          pass: env.hyundai_client_password,
          role: env.client_role,
        };
        break;
      }
      case "hyundai_user": {
        value = {
          user: env.hyundai_user_username,
          pass: env.hyundai_user_password,
          role: env.user_role,
        };
        break;
      }
      case "mazda_client": {
        value = {
          user: env.mazda_client_username,
          pass: env.mazda_client_password,
          role: env.client_role,
        };
        break;
      }
      case "mazda_user": {
        value = {
          user: env.mazda_user_username,
          pass: env.mazda_user_password,
          role: env.user_role,
        };
        break;
      }
      case "nissan_client": {
        value = {
          user: env.nissan_client_username,
          pass: env.nissan_client_password,
          role: env.client_role,
        };
        break;
      }
      case "nissan_user": {
        value = {
          user: env.nissan_user_username,
          pass: env.nissan_user_password,
          role: env.user_role,
        };
        break;
      }
      case "subaru_client": {
        value = {
          user: env.subaru_client_username,
          pass: env.subaru_client_password,
          role: env.client_role,
        };
        break;
      }
      case "subaru_user": {
        value = {
          user: env.subaru_user_username,
          pass: env.subaru_user_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else if (
    siteId == "nationwideawsimt2022" ||
    (siteId == "nationwidepro2022" && role != null)
  ) {
    switch (role) {
      case "admin": {
        value = {
          user: env.prousername,
          pass: env.password,
          role: env.admin_role,
        };

        break;
      }
      case "nationwide_client": {
        value = {
          user: env.nationwide_client_username,
          pass: env.nationwide_client_password,
          role: env.client_role,
        };
        break;
      }
      case "nationwide_user": {
        value = {
          user: env.nationwide_user_username,
          pass: env.nationwide_user_passowrd,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else if (
    siteId == "firstteamag2022" ||
    (siteId == "firstteamagsimt2022" && role != null)
  ) {
    switch (role) {
      case "admin": {
        value = {
          user: env.prousername,
          pass: env.password,
          role: env.admin_role,
        };
        break;
      }
      case "first_client": {
        value = {
          user: env.first_client_username,
          pass: env.first_client_password,
          role: env.client_role,
        };
        break;
      }
      case "first_user": {
        value = {
          user: env.first_user_username,
          pass: env.first_user_password,
          role: env.user_role,
        };
        break;
      }
      default:
        null;
    }
    return value;
  } else {
    logger.error("please pass the role for further testing");
  }
}

export { switchController };
