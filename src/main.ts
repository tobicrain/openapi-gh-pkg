import * as core from "@actions/core";
import Constants from "./util/constants";
import DeployService from "./services/DeployService";

type SupportedPlatforms = "kotlin-spring" | "typescript-angular" | "kotlin";

const platform = core.getInput(Constants.PLATFORMS) as SupportedPlatforms;

(async () => {
  try {
    switch (platform) {
      case "kotlin-spring":
        await DeployService.handleKotlinSpring();
        break;
      case "typescript-angular":
        await DeployService.handleAngular();
        break;
      case "kotlin":
        await DeployService.handleKotlinClient();
        break;
      default:
        break;
    }
  } catch (error) {
    core.setFailed(JSON.stringify(error));
  }
})();
