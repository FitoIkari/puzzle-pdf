const { dialog } = require("electron");

function dialogManager() {
  const config = {
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  };

  return dialog.showOpenDialog(config);
}

function saveDialog(defaultPath) {
  const config = {
    defaultPath,
  };

  return dialog.showSaveDialog(config);
}

module.exports = { dialogManager, saveDialog };
