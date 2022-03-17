import { app, BrowserWindow, Menu, MenuItem, ipcMain } from 'electron'
import { clipboard } from 'electron'
import dayjs from 'dayjs'
import Store from 'electron-store'

const storeIndex = new Store({ name: 'storeIndex' })
const storeEntries = new Store({ name: 'storeEntries' })
const dayKey = 'Days'

console.log(storeIndex.path)
console.log(storeEntries.path)

// IPC listener
ipcMain.on('electron-storeIndex-get', async (event) => {
  let value: any = storeIndex.get(dayKey) ?? []
  let today = dayjs().format('YYYYMMDD')
  let todayExists = value.some((el: any) => {
    return el == today
  })
  if (!todayExists) {
    value.push(today)
    console.log(`Added ${today} to cached Days`)
  }
  event.returnValue = value
})
ipcMain.on('electron-storeIndex-set', async (event, val) => {
  storeIndex.set(dayKey, val)
})

ipcMain.on('electron-storeEntries-get', async (event, val) => {
  event.returnValue = storeEntries.get(val)
})
ipcMain.on('electron-storeEntries-get-all', async (event, val) => {
  console.log('getAll')
  event.returnValue = storeEntries.store
})
ipcMain.on('electron-storeEntries-set', async (event, key, val) => {
  storeEntries.set(key, val)
})

// import path = require('path')

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Env
// process.env.NODE_ENV = 'development'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // const menu2 = new Menu()
  // menu2.append(
  //   new MenuItem({
  //     label: 'Electron',
  //     // role: 'window',
  //     submenu: [
  //       {
  //         label: 'Copy',
  //         accelerator: 'Cmd+C',
  //         click: () => {
  //           console.log('Cmd+C')
  //           mainWindow.webContents.copy()
  //           // mainWindow.webContents.send('copy')
  //         },
  //       },
  //       {
  //         label: 'Paste',
  //         accelerator: 'Cmd+V',
  //         click: () => {
  //           console.log('Cmd+V')
  //           // mainWindow.webContents.send('paste', clipboard.readHTML())
  //           mainWindow.webContents.pasteAndMatchStyle()
  //           // mainWindow.webContents.insertText(clipboard.readText())
  //         },
  //       },
  //       {
  //         label: 'Cut',
  //         accelerator: 'Cmd+X',
  //         click: () => {
  //           console.log('Cmd+X')
  //           mainWindow.webContents.cut()
  //         },
  //       },
  //       {
  //         label: 'Undo',
  //         accelerator: 'Cmd+Z',
  //         click: () => {
  //           console.log('Cmd+Z')
  //           mainWindow.webContents.undo()
  //         },
  //       },
  //       {
  //         label: 'Redo',
  //         accelerator: 'Shift+Cmd+Z',
  //         click: () => {
  //           console.log('Shift+Cmd+Z')
  //           mainWindow.webContents.redo()
  //         },
  //       },
  //       {
  //         label: 'Select all',
  //         accelerator: 'Cmd+A',
  //         click: () => {
  //           console.log('Cmd+A')
  //           mainWindow.webContents.selectAll()
  //         },
  //       },
  //     ],
  //   })
  // )
  // Menu.setApplicationMenu(menu2)

  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = new Menu()

    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: () => mainWindow.webContents.replaceMisspelling(suggestion),
        })
      )
    }

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: 'Add to dictionary',
          click: () =>
            mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
        })
      )
    }

    menu.popup()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.commandLine.appendSwitch('ignore-certificate-errors')

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
