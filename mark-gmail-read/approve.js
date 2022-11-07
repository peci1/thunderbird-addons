// SPDX-License-Identifier: GPL-3.0-only
// SPDX-FileCopyrightText: Martin Pecka

let folder = null;

const Persist = {
  Dont: "dont",
  Forever: "forever",
  Session: "session",
}

function load() {
  let params = new URLSearchParams(document.location.search);
  let numUnread = parseInt(params.get("numUnread"));
  let account = params.get("accountName");
  folder = {
    "accountId": params.get("accountId"),
    "path": params.get("folder"),
    "type": params.get("type"),
  }

  document.getElementById("numUnread").innerText = "" + numUnread;
  document.getElementById("folderName").innerText = account + folder.path;

  document.getElementById("yes").onclick = async () => {await submit(true);};
  document.getElementById("no").onclick = async () => {await submit(false);};
}

async function executeAction(approve, persist) {
  await messenger.runtime.sendMessage({"action": "mgrApprove", "approve": approve, "persist": Persist[persist], "folder": folder});
}

async function submit(approve) {
  if (!folder)
    return;

  let persist = Persist.Dont;
  for (let key in Persist) {
    let el = document.getElementById(Persist[key]);
    if (el && el.checked)
    {
      persist = key;
      break;
    }
  }

  await executeAction(approve, persist);

  window.close();
}

document.addEventListener("DOMContentLoaded", load);