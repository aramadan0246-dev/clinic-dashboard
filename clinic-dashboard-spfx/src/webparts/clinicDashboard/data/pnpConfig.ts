import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/site-users/web";
import { WebPartContext } from "@microsoft/sp-webpart-base";

let _sp: SPFI | undefined;

export function initPnp(context: WebPartContext): SPFI {
  _sp = spfi().using(SPFx(context));
  return _sp;
}

export function getSP(): SPFI {
  if (!_sp) {
    throw new Error("PnPjs has not been initialized. Call initPnp(context) first.");
  }
  return _sp;
}
