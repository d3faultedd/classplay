import { registerSW } from "/active/prxy/register-sw.mjs";
import * as BareMux from "/active/prxy/baremux/index.mjs";
import { getFavicon, rAlert } from "./utils.mjs";

const connection = new BareMux.BareMuxConnection("/active/prxy/baremux/worker.js");

export function search(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {}

  try {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {}

  try {
    const urlparams = new URLSearchParams(inject);

    console.log(inject)

    if (urlparams) {
      const injectionURL = urlparams.get(inject)
      const url = new URL(`http://${injectionURL}`)
      return url.toString()
    }

  } catch (err) {}

  return template.replace("%s", encodeURIComponent(input));
}

export function app(route) {
  const url = new URL(route)
  if (url.hostname.includes(".")) {
    return url.toString();
  }
}

export async function getUV(input) {
  try {
    await registerSW();
    rAlert("SW Registered");
  } catch (err) {
    rAlert(`SW failed to register.<br>${err.toString()}`);
    throw err;
  }

  let url = search(input, "https://google.com/search?q=%s");

  let wispUrl = "wss://gointospace.app/wisp/";
  if ((await connection.getTransport()) !== "/active/prxy/epoxy/index.mjs") {
    await connection.setTransport("/active/prxy/epoxy/index.mjs", [
      { wisp: wispUrl },
    ]);
  }
  if ((await connection.getTransport()) !== "/activeprxy/libcurl/libcurl.mjs") {
    await connection.setTransport("/active/prxy/libcurl/libcurl.mjs", [
      { wisp: wispUrl },
    ]);
  }

  let viewUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

  return viewUrl;
}
