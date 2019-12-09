## Introduction
This project uses a windows hook developed by myself, which you can find in [PinyinHook](https://github.com/angryshhh/PinyinHook), to do some test to help the visual impaired to use Chinese input method like [Sogou Pinyin](https://pinyin.sogou.com).<br />
This project uses [Create React App](https://github.com/facebook/create-react-app) and [Electron](https://github.com/electron/electron).<br />
This project uses [ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi) to use dll which provides the windows hook. I tried Nodejs addon but I'm stupid so it didn't work.<br >
This project uses [electron-builder](https://github.com/electron-userland/electron-builder) to package it.
This project uses [node-sqlite3](https://github.com/mapbox/node-sqlite3) to access the database, and because it's asynchronous, uses async/await to do the sql query.

## Requirments
+ It seems that nodejs, node-gyp, windows-build-tools could be the latest version and 64-bit. Python 2.7 will be automatically installed by windows-build-tools.<br />
`npm install -g node-gyp windows-build-tools`<br />
+ The hook only works in Windows, and it's a 32-bit program, so Electron, ffi-napi and electron-builder must be 32-bit, and when you use electron-builder to package it, use --arch=ia32 (already included in the npm scripts). <br />
`npm install --arch=ia32`<br />
+ The windows console has some problem with Chinese character, run this in the console before debug:<br />
`CHCP 65001`
+ To let sqlite3 work with electron, need to run the script below after installing sqlite3:<br />
`yarn electron-builder install-app-deps --arch=ia32`<br />
or there could be "Error: cannot find module '...\node_modules\sqlite3\lib\binding\electron-v6.0-win32-ia32\node_sqlite3.node'<br />
+ For develepment, start the react app first, and run the electron app:<br />
`yarn start`<br />
`yarn electron-dev`<br />
+ For production, build the react app first, and build the electron app, all included in one script: <br />
`yarn electron-pack`<br />
If you find some problem like `Access is denied`, it could be some files are being used, especially the dll file. You can wait or just restart your machine.<br />
If you find some problem like `cannot execute cause=exit status 1` here, ignore it and run this script a couple of times, it will get through.<br />
+ The version of some of these dependencies need to be specific, as they use different v8 engine in their latest version, and the ffi hasn't been updated for a long time. React dependencies need to be removed to devDependcies to work with electron (I don't know why), adn the ffi-napi must not be dev or the packaged electron program can't find it.<br />

dependency|version|devDependency
:-:|:-:|:-:
electron|6.0.10|true
electron-builder|21.2.0|true
ffi-napi|2.4.5|false

# I write these after a few days of struggling to make things work togethor and work fine, so there could be something important missing.
# This project will be modified sooner for experimental use.
# Looking for a job