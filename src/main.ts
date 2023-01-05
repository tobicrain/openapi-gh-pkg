import * as core from "@actions/core";
import Constants from "./util/constants";
import DeployService from "./services/DeployService";

type SupportedPlatforms = "spring" | "typescript-angular" | "kotlin";

const platform = core.getInput(Constants.PLATFORM) as SupportedPlatforms;

(async () => {
  try {
    switch (platform) {
      case "spring":
        await DeployService.handleSpring();
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
