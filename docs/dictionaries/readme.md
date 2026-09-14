# 字典來源與修改紀錄

本插件內的字典是經過修改的衍生版本，並非上游原檔。正式使用的檔案只有 `dist/chromium/dictionaries/s2t-char.min.json` 與 `dist/chromium/dictionaries/s2t-phrase.min.json`。當時使用的上游版本及完整的處理腳本沒有保存；直接重新下載上游字典或重跑殘存腳本，無法保證得到目前的內容，還可能覆蓋使用者的修改。

## 字符字典

字符字典以 [TongWen Dict](https://github.com/tongwentang/tongwen-dict) 為基礎，採用 MIT 授權。使用者刪除或調整了部分異體字轉換，例如刪除 `閑` → `閒`。整理期間曾使用名為 `removed-trad-source.json` 的異體字清單，但清單後來經過修改，不能當作所有字符字典更動的完整紀錄。[TongWen Dict 的授權副本](../../licenses/TongWen-Dict-MIT.txt)已保留。

## 詞組字典

詞組字典主要源自 OpenCC 的 [STPhrases.txt](https://github.com/BYVoid/OpenCC/blob/master/data/dictionary/STPhrases.txt)，採用 Apache 2.0 授權。使用者將文字檔轉為 JSON，並將一個 key 對應多個候選值的情況改為只保留一個較常用的字串值，例如 `"默念": "默唸"`。之後選擇性調整 value 中的異體字，例如 `"不合群": "不合羣"` 改為 `"不合群": "不合群"`，並刪除冗餘詞條。

當時使用的異體字清單經過多次修改，字符字典的刪除規則與詞組 value 的替換規則也不完全相同。例如清單含有 `裏` → `裡`，但使用者後來把部分詞組 value 的 `裡` 手動改回 `裏`。不可將目前的清單機械套用至正式字典。

目前保留的兩個本機 Python 檔只記錄部分詞組整理工作：`1.py` 將 value 裡的 `檯` 改為 `枱`、`臺` 改為 `台`，但跳過包含 `臺灣`、`臺北` 等指定地名的 value；`2.py` 刪除 key 與 value 相同，或用當時的字符字典逐字轉換 key 已可得到相同 value 的條目。更早的格式轉換、候選值選擇、異體字處理與其他手動修改沒有完整腳本。這兩個檔案不是可靠的重建流程，也不會在建置插件時執行。[OpenCC 的 Apache 2.0 授權副本](../../licenses/OpenCC-APACHE-2.0.txt)已保留。

本文件明確標示：詞組 JSON 已相對 OpenCC 原檔修改格式、候選值、異體字與條目；字符 JSON 也已相對 TongWen Dict 修改。這些來源聲明不表示上游專案認可或維護本版本。
