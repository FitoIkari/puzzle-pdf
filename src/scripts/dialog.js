const { dialog } = require("electron");

function dialogManager() {
  const config = {
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  };

  return dialog.showOpenDialog(config);
}

exports.dialogManager = dialogManager;
