"use client";
import { useEffect } from "react";
// import Script from "next/script";
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: { init: (options: { xfbml: boolean; version: string }) => void };
  }
}
export function init() {
  const chatbox = document.getElementById("fb-customer-chat");
  chatbox?.setAttribute("page_id", "914399745304515");
  chatbox?.setAttribute("attribution", "biz_inbox");
  window.fbAsyncInit = function () {
    window.FB?.init({
      xfbml: true,
      version: "v18.0",
    });
  };
  (function (d, s, id) {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    const js = d.createElement("script");
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    fjs?.parentNode?.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
}
export function cleanup() {
  (function (d, id) {
    const target = d.getElementById(id);
    if (target) {
      target.parentNode?.removeChild(target);
    }
  })(document, "facebook-jssdk");
  delete window.FB;
}
export const MessengerChat = () => {
  useEffect(() => {
    init();
    return () => {
      cleanup();
    };
  }, []);
  return (
    <>
      <div id="fb-root" />
      <div id="fb-customer-chat" className="fb-customerchat" />
    </>
  );
};

export default MessengerChat;
