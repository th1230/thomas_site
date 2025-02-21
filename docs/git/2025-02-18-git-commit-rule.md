---
title: 啟動專案前的Git版控規則
description: Git分支命名、分支合併流程與Commit Message格式的實用規範。
keywords: [angular]
---

# 啟動專案前的 Git 版控規則

## 分支說明

- **`main`**
  - 主要分支，功能開發完成並發布時使用
  - **禁止直接合併**到這個分支，請使用 PR 並至少一人審核
- **`develop`**
  - 開發分支，所有針對功能的開發都從此分支開出
  - 同樣**禁止直接合併**到這個分支，請使用 PR 並至少一人審核

---

## 分支命名規則範例（包含開發者名稱）

### 功能增加 (feat)

- **分支類型**：功能分支
- **命名格式**：`<開發者名稱>/feat/<功能名稱>`
- **範例**：
  - `alice/feat/api-integration`：Alice 負責 API 串接功能的開發
  - `tom/feat/layout-design`：Tom 負責新的頁面切版設計

### 錯誤修復 (fix)

- **分支類型**：修復分支
- **命名格式**：`<開發者名稱>/fix/<功能名稱>`
- **範例**：
  - `jane/fix/login-issue`：Jane 處理登入功能的錯誤
  - `carl/fix/database-connection`：Carl 修復資料庫連接問題

### 文檔更新 (docs)

- **分支類型**：文檔分支
- **命名格式**：`<開發者名稱>/docs/<功能名稱>`
- **範例**：
  - `susan/docs/update-readme`：Susan 更新 README 文件
  - `bob/docs/add-license-info`：Bob 添加授權信息到文檔中

### 代碼風格調整 (style)

- **分支類型**：風格調整分支
- **命名格式**：`<開發者名稱>/style/<功能名稱>`
- **範例**：
  - `mike/style/code-formatting`：Mike 改善代碼格式，包括調整空格
  - `lisa/style/fix-indentation`：Lisa 修正代碼的縮進問題

### 代碼重構 (refactor)

- **分支類型**：重構分支
- **命名格式**：`<開發者名稱>/refactor/<功能名稱>`
- **範例**：
  - `alex/refactor/optimize-search`：Alex 優化搜索算法
  - `nina/refactor/cleanup-functions`：Nina 清理過時或未使用的函數

### 常規任務更新 (chore)

- **分支類型**：常規任務分支
- **命名格式**：`<開發者名稱>/chore/<功能名稱>`
- **範例**：
  - `dave/chore/update-dependencies`：Dave 更新項目的依賴關係
  - `emma/chore/setup-linter`：Emma 設置代碼檢查工具

---

## 分支合併流程

1. **git fetch origin develop**
2. **git rebase develop**（在自己的分支上執行）
3. 處理 **git conflict**（若無衝突則可跳過）
4. **git push origin /<your_branch/>**（若 rebase 後線圖很亂，可以用 `git push origin /<your_branch/> -f` 強制推送，僅能在自己的分支上使用 `f`）
5. 發 PR 合併到 develop

---

## Commit Message 結構

```
(<type>): <subject>

<body>
```

- `type（必填）`：commit 的類別
- `subject（必填）`：commit 的簡短描述
- `BLANK LINE`：空白行
- `body（可選）`：針對本次調整的詳細描述（每行不要過長）

---

## Commit Message 範例

### 範例 1：增加新功能

```
(feat): 新增登入功能

- 實作 JWT 基礎的用戶認證
- 提供登入 API 端點
```

### 範例 2：修復錯誤

```
(fix): 修正購物車無法添加商品的錯誤

- 修正因資料庫查詢錯誤造成的問題
- 確保商品存在於庫存中才可添加
```

### 範例 3：文檔更改

```
(docs): 更新 README 文件

- 添加設置和安裝指南
- 說明新的功能如何配置和使用
```

### 範例 4：風格調整

```
(style): 格式化購物車相關的 JavaScript 代碼

- 統一使用雙引號
- 移除多餘的空格
```

### 範例 5：重構代碼

```
(refactor): 重構用戶管理模塊

- 將用戶認證和資料讀取分開處理
- 提高代碼的可讀性和可維護性
```

### 範例 6：雜項任務

```
(chore): 更新開發依賴的庫

- 升級 tailwindcss 到最新版本
- 移除不再使用的依賴項
```

---

## 紀錄訊息類別

- **`(feat)`**：增加新功能（API 串接／開發、切版…）
- **`(fix)`**：修復錯誤
- **`(docs)`**：僅文檔更改
- **`(style)`**：不影響代碼含義的更改（空格、格式、缺少分號等）
- **`(refactor)`**：重構代碼，既不修復錯誤也不添加功能
- **`(chore)`**：對構建過程或輔助工具和庫的更改，各種與開發或文件較無關的更新
