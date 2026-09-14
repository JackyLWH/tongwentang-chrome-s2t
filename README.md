# 新同文堂・Chrome 簡轉正個人版

這是以[新同文堂](https://github.com/tongwentang/tongwentang-extension)為基礎修改的 **Chrome 專用、只做簡體轉正體** 的個人版本。啟用後會盡早處理網頁文字，並持續轉換網站稍後加入的內容；按一下工具列圖示即可切換 ON／OFF。關閉時，插件會即時還原它先前修改、且尚未被網站再次改動的文字及支援的屬性，通常不用重新整理網頁。

## 近乎即時的轉換

**打開網頁後，文字會在載入初期迅速轉成正體，通常察覺不到轉換過程。** 插件也會跟進網站動態加入的文字；例如 YouTube 以網頁文字顯示的簡體字幕，播放時亦會隨字幕更新迅速轉成正體。實際效果會因網站呈現方式與裝置效能而異。

這個版本以個人使用體驗為目標，字典包含大量個人用字選擇。它不是通用的正體字標準，也不保證每個網站都完全看不到轉換過程。Chrome 不允許注入內容腳本的頁面（例如部分瀏覽器內部頁面）不會轉換。

## 安裝

若提供了 GitHub Release，請下載其中的 **`tongwentang-chrome-s2t-v3.0.0.zip`**，解壓後在 Chrome 開啟 `chrome://extensions`，啟用「開發人員模式」，按「載入未封裝項目」，選取解壓後含有 `manifest.json` 的資料夾。GitHub 自動產生的「Source code」壓縮檔只有原始碼，不能直接當成已建置的插件載入。

本插件要求 Chrome 116 或更新版本。安裝後可按工具列圖示切換 ON／OFF。偏好設定頁面仍可調整簡轉正字典與自訂詞彙。

## 從原始碼建置

需要 Node.js 22 或更新版本與 npm：

```sh
npm ci
npm run test:tsc
npm run build:chromium
```

建置後在 `chrome://extensions` 載入 `dist/chromium`。兩個正式字典檔位於 `dist/chromium/dictionaries/s2t-char.min.json` 與 `dist/chromium/dictionaries/s2t-phrase.min.json`。建置會保留它們；修改字典時直接編輯 JSON、重新載入插件並重新整理網頁即可，不必重新建置。請先備份自己的字典。GitHub 上提交的 JSON 是此版本的成品；早期處理字典的完整腳本並未保存。

## 來源與授權

- 原插件：[新同文堂](https://github.com/tongwentang/tongwentang-extension)，原作者 Tan Xiang Yang（t7yang），原專案 MIT 授權見 [LICENSE](LICENSE)。
- 字符字典以 [TongWen Dict](https://github.com/tongwentang/tongwen-dict) 為基礎，經使用者手動調整；其 MIT 授權副本見 [licenses/TongWen-Dict-MIT.txt](licenses/TongWen-Dict-MIT.txt)。
- 詞組字典主要以 OpenCC 的 [STPhrases.txt](https://github.com/BYVoid/OpenCC/blob/master/data/dictionary/STPhrases.txt) 為基礎，經格式轉換、選詞、異體字調整、去冗餘和手動修改；其 Apache 2.0 授權副本見 [licenses/OpenCC-APACHE-2.0.txt](licenses/OpenCC-APACHE-2.0.txt)。處理過程詳見[字典來源與修改紀錄](docs/dictionaries/readme.md)。

本個人版本的程式修改由 ChatGPT／Codex 按使用者要求完成；使用者自行整理與修改字典，並未聲稱自己編寫程式碼。原專案及字典來源的作者不負責本版本的修改。

## 維護狀態

這是按目前使用狀態分享的固定版本，**不承諾更新、修正網站相容性問題或提供技術支援**。歡迎自行複製及修改，但請保留適用的來源與授權聲明。
