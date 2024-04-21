# Chess Book Study

A simple companion app for when you are reading pdfs.

---

When you are reading a chess book on your computer, sometimes don't you feel a floatiing chessboard would solve most of your visualisaztion problems? Well this does exactly that.

## Features

- Only valid moves can be played
- Always on top option
- Board editing
- FEN and PGN display for easy export
- 9 different piece sets
- Fully customisable board theme
- Sounds!!

## Usage

### Use prebuilt binaries

On windows, just grab the msi installer.
I have not able to generate the AppImage with tauri so you have to build from source. Follow the tauri docs to get how to do it. The assets are embedding in the sourcecode, So don't worry about it.

### Compiling from source

This is a standard tauri app written in typescript with no frameworks, hence this should be fairly easy to compile and run if you are familiar with the tauri ecosystem. If not follow [Tauri quickstart](https://tauri.app/v1/guides/getting-started/prerequisites)

After the prerequisites are installed, clone the repo and run the following commands:

```sh
npm install --save-dev @tauri-apps/cli
npm run tauri dev
```

## Screenshots

![Screenshot 2023-08-18 145401](https://github.com/Dr-42/chess-book-study/assets/64161204/3d0557f9-c89c-4c9e-9e32-497f32cbb1e3)

![Screenshot 2023-08-18 145623](https://github.com/Dr-42/chess-book-study/assets/64161204/66c69cfa-20e8-463d-9c85-48f7b9a24b91)

![Screenshot 2023-08-18 145724](https://github.com/Dr-42/chess-book-study/assets/64161204/ed09fcf3-bf71-4e38-9a62-a7f914c9207b)

![Screenshot 2023-08-18 145804](https://github.com/Dr-42/chess-book-study/assets/64161204/38760154-aaaa-400b-a3e8-9f65e126e33b)
