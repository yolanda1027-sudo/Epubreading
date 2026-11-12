# 墨頁閱讀器

可以自己換主題的 EPUB 閱讀器。純網頁，不需要伺服器，裝到手機主畫面後就像一般 App 一樣全螢幕開啟，離線也能用。

## 功能

- 開啟 EPUB（選檔、拖曳，或從手機的「分享」選單送進來）
- 目錄、閱讀進度、上下捲動／左右分頁
- 主題：內建幾組配色，也可以自己調
  - 顏色：背景、紙張、主文字、斜體、引號、底線、標題、連結、介面色、文字陰影
  - 文字：字型（系統字、網路字型、上傳字型檔）、字級、行高、段距、字距、首行縮排
  - 版面：頁寬、頁邊留白
  - 自訂 CSS
- 主題可以存檔、匯出、匯入；也能匯入酒館（SillyTavern）的主題 JSON
- 引號裡的文字會自動套用「引號」顏色
- EPUB 3 註腳以小視窗顯示（Chat2Ebook 匯出的「思維鏈」「其他版本」也適用）
- 書裡的腳本、表單與外部圖片不會載入

書和閱讀進度只存在自己裝置的瀏覽器裡，不會上傳。

## 上線（GitHub Pages）

1. repo 的 **Settings → Pages**
2. **Source** 選 `Deploy from a branch`
3. **Branch** 選 `main`、資料夾選 `/ (root)`，按 **Save**
4. 等一兩分鐘，網址會是 `https://<帳號>.github.io/Epubreading/`

## 安裝成 App

- **Android（Chrome）**：打開上面的網址 → 右上角「⋮」→「安裝應用程式」或「加到主畫面」
- **iPhone / iPad（Safari）**：分享按鈕 →「加入主畫面」
- **電腦（Chrome / Edge）**：網址列右邊的安裝圖示

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 整個閱讀器（介面、樣式、程式都在這一個檔） |
| `manifest.webmanifest` | App 名稱、圖示、分享選單設定 |
| `sw.js` | 離線快取，以及接收「分享」進來的書 |
| `icons/` | App 圖示 |
| `vendor/jszip.min.js` | 解開 EPUB 用的 JSZip 3.10.1（授權見 `vendor/JSZip-LICENSE.md`） |

改了網站檔案之後，請把 `sw.js` 最上面的 `VERSION` 加一，已安裝的 App 才會換掉舊快取。
