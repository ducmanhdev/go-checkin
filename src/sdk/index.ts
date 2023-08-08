import Gap, {GapApiVersion} from "gap-nodejs-sdk";
import {GapMiniAppSdk} from "gap-miniapp-sdk";
import {tryParseJson} from "@/utils/json";

const baseSdk = new Gap.BaseApi(GapApiVersion.V1);

let posSdk: any = null;
let settingsSdk: any = null;
let goCheckInSdk: any = null;
let appointmentSdk: any = null;
let userSdk: any = null;

type GetAccessTokenResponse = Partial<{
  token: string;
  gClientId: string;
  domain: string;
}>

class GapMiniAppController {
  instance = new GapMiniAppSdk();

  constructor() {
    this.init();
  }

  detectPlatform() {
    const platform = this.instance.detectPlatform();
    this.instance.setPlatformExecutor(platform);
  }

  getAccessToken() {
    return new Promise<GetAccessTokenResponse>(async resolve => {
      try {
        const res = await this.instance.getAccessToken();
        const {token, gClientId, domain} = tryParseJson(res);
        if (!token || !gClientId || !domain) {
          throw new Error(`GapMiniApp: Can't get access token`)
        }
        localStorage.setItem('accessToken', token);
        localStorage.setItem('id', gClientId);
        localStorage.setItem('domain', domain);
        resolve({
          token,
          gClientId,
          domain,
        });
      } catch (error: any) {
        resolve({
          token: undefined,
          gClientId: undefined,
          domain: undefined,
        });
      }
    })
  }

  closeApp() {
    if (!this.instance) return;
    if (!this.instance.getBridge()) return;
    this.instance.closeApp()
  }

  init() {
    try {
      this.detectPlatform();
    } catch (error) {
      console.error(error)
    }
  }
}

const gapMiniAppController = new GapMiniAppController();

const sdkInit = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        token = localStorage.getItem('accessToken'),
        gClientId = localStorage.getItem('id'),
        domain = localStorage.getItem('domain'),
      } = await gapMiniAppController.getAccessToken();
      if (!domain || !gClientId || !token) {
        throw new Error('Missing params');
      }
      posSdk = new Gap.PosClientApi(domain, gClientId, token, GapApiVersion.V1);
      settingsSdk = new Gap.SettingsApi(domain, gClientId, token, GapApiVersion.V1);
      goCheckInSdk = new Gap.GoCheckInApi(domain, gClientId, token, GapApiVersion.V1);
      appointmentSdk = new Gap.AppointmentApi(domain, gClientId, token, GapApiVersion.V1);
      userSdk = new Gap.UserApi(domain, gClientId, token, GapApiVersion.V1);
      resolve(true);
    } catch (error: any) {
      reject(new Error(`SDK init failed: ${error.message}`));
    }
  });
};

export {
  baseSdk,
  posSdk,
  settingsSdk,
  goCheckInSdk,
  appointmentSdk,
  userSdk,
  sdkInit,
  gapMiniAppController,
};
