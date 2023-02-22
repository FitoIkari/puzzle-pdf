const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Exit",
        click() {
          app.exit(0);
        },
      },
    ],
  },
];

if (process.env.NODE_ENV !== "production")
  menuTemplate.push({
    label: "DevTools",
    submenu: [
      {
        label: "Show/Hide DevTools",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });

module.exports = { menuTemplate };
