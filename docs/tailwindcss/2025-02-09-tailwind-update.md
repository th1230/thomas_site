---
title: TailwindCss4.0的重點更動
description: 本文概述 Tailwind CSS 4.0 中的主要改變，包含配置方式的簡化、CSS 指令的變動（如 @layer 和 @apply 的使用方式調整）、主題與 utilities 的新寫法，以及 safelist 替代方案。
keywords: [tailwindcss, angular]
---

# TailwindCss4.0的重點更動

## 1. 不再以config配置檔作為核心

在 TailwindCSS 3.x 中，config 配置檔一直是整個套件的核心。在開發過程中，無論是覆蓋主題、設定插件，或是配置資源檔案路徑，都必須透過這個配置檔來處理。這種設計往往讓開發者把時間耗費在設定上，而非專注於 CSS 開發。

雖然 3.x 版本後來推出了 JIT 模式，讓我們能直接在 HTML 中定義新的 utilities，不需在配置檔裡預先設定，但整個架構仍然依賴於配置檔。即使有了 JIT 模式，config 配置檔依然不可或缺。

隨著瀏覽器原生 CSS 功能越來越強大，TailwindCSS 4.x 改變了他們的架構。在新版本中，我們可以直接使用 CSS 自訂屬性來實現多數功能，不再依賴配置檔。想要設定主題？只需在 CSS 檔案中使用 @theme 指令配合原生的 CSS Variable 即可。如果仍需要配置檔，也可透過 @config 進行設定。這樣一來，配置檔轉變為輔助工具，讓我們能專注於 CSS 開發。

新版本採用了幾個原生的 CSS 功能來優化開發體驗，這邊找出比重要的兩個：

首先是 **Container Queries**，它讓我們能根據容器(HTML element)大小來調整樣式，不再受限於視窗大小。這項功能大幅提升了響應式設計的靈活度，增加了元件的重用性，使 RWD 開發更加便利。

其次是 **Cascade Layers（@layer）**，這個功能讓我們能更精確地控制樣式的優先順序，更有效地管理樣式層級並避免樣式衝突。值得注意的是，在 3.x 版本中，@layer 是 TailwindCSS 官方自定義的指令（directive）需要進行編譯處理，而在 4.x 版本中則改採用原生的 CSS at-rule。

#### 參考資料
> 1.  [CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration)
> 2. [Container queries](https://tailwindcss.com/blog/tailwindcss-v4#container-queries)
> 3. [MDN @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
> 4. [TailwindCss3.x @layer directive](https://v3.tailwindcss.com/docs/functions-and-directives#layer)
> 5. [Migrating to the JIT engine](https://v3.tailwindcss.com/docs/upgrade-guide#migrating-to-the-jit-engine)

## 2. 不再能組件CSS檔案中直接使用 @apply

在 3.x 版本中，@apply 可直接在組件的 CSS 檔案中使用而不會出現編譯問題。但在新版本中，官方文件明確指出需要「Explicit context sharing」才能使用 @apply 和 @variant。要實現這點，我們需要使用 @reference 來導入全局樣式作為參考。

```css
@reference "../app.css";
button {
  @apply bg-blue-500;
}
```

初步測試發現，當使用 @source 調整預設檢索資源的位置時會出現編譯錯誤。這可能與參照路徑的解析有關，但目前尚未找到任何文獻討論或說明此問題。

```css
/* styles.css */
@import "tailwindcss" source("../app");

/* child.component.css */
@reference "../../styles.css";

:host {
  display: block;
}

.main{
  @apply p-1 bg-red-200;
}
```

如果改用以下配置，即關閉預設檢測並明確指定所有來源，則能正確運作。

```css
/* styles.css */
@import "tailwindcss" source(none);
@source "../app";

/* child.component.css */
@reference "../../styles.css";

:host {
  display: block;
}

.main{
  @apply p-1 bg-red-200;
}
```

#### 參考資料
> 1. [@reference](https://tailwindcss.com/docs/functions-and-directives#reference-directive)
> 2. [Vue, Svelte, and Astro](https://tailwindcss.com/docs/compatibility#vue-svelte-and-astro)
> 3. [Using @apply with Vue, Svelte, or CSS modules](https://tailwindcss.com/docs/upgrade-guide#using-apply-with-vue-svelte-or-css-modules)

## 3. Theme以及Utilites新寫法

### 3-1. 在新版本中如何配置Theme

在3.x版本中，主題配置需透過tailwind.config.js來設定。新版本改用 **Theme variables**，只需使用@theme directive 搭配 CSS variable 即可完成主題定義。需注意，在新版本定義這些樣式時，必須加上 --color-* 的前綴符號才能正確轉換成 utilities class。不過，即使沒有加上正確前綴，這些變數仍可作為一般的CSS variable使用。

```css
@import "tailwindcss";
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

```html
<div class="bg-mint-500">
  <!-- ... -->
</div>
```

#### 參考資料
> 1. [**Customizing your theme**](https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme)

### 3-2. 客製化Utilites的新方式

在自定義 utilities 方面，新版本的基本概念與舊版相似。不過值得特別關注的是新增的 Functional utilities 功能，它讓我們能根據參數進行動態的取值、運算和重組。

**範例一**

可以看到 tab-* 中的星號會傳遞給 --tab-size-* 使用。這表示當開發者在 HTML 中使用 tab-2 時，對應的配置就會是 tab-size: --value(--tab-size-2)，讓使用變得相當便利。

```css
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-github: 8;
}
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

**範例二**

參數可以通過 **`--value({type})`** 的方式進行類型轉換。以這個範例來說，假設使用 tab-8，實際設定的配置就會是 tab-size: 8，其中 class 名稱中的 8 會被轉換成數字型態

```css
@utility tab-* {
  tab-size: --value(integer);
}
```

#### 參考資料
> 1. [CSS data types](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types)
> 2. [Functional utilities](https://tailwindcss.com/docs/adding-custom-styles#functional-utilities)

## 4. **檢索方式的改變**

### 4-1. 舊版本檢核與配置

在 3.x 版本中，系統是透過 config 配置檔案的 content 屬性來定義來源檔案。Tailwind 會掃描 content 中設定的路徑，包含所有 HTML、JavaScript 組件和含有類別名稱的模板檔案，並據此生成對應的 CSS。

```jsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  // ...
}
```

#### 參考資料
> 1. [Configuring source paths](https://v3.tailwindcss.com/docs/content-configuration#configuring-source-paths)

### 4-2. 新版本檢核與配置

在 4.x 版本中，Tailwind CSS 大幅簡化了源碼檢索的機制。系統會自動掃描專案目錄下的所有檔案來尋找使用到的類別名稱，但為了提升效能和避免不必要的處理，以下檔案類型會被自動排除：

- 所有列在 `.gitignore` 中的檔案和目錄
- 二進制檔案（如圖片、影片、壓縮檔等）
- CSS 檔案
- 套件管理器的鎖定檔案（如 package-lock.json）

預設情況下，Tailwind 會以當前工作目錄作為掃描的起點。如果你需要指定不同的掃描路徑，可以在 CSS 檔案中使用 `source()` 函數來設定：

```css
@import "tailwindcss" source("../src");
```

這個功能特別適合 monorepo 專案，因為這類專案的建置指令通常在根目錄執行，而非在個別子專案目錄中執行。透過 source() 函數，你可以準確指定要掃描的目錄位置。

#### 參考資料
> 1. [Which files are scanned](https://tailwindcss.com/docs/detecting-classes-in-source-files#which-files-are-scanned)
> 2. [Setting your base path](https://tailwindcss.com/docs/detecting-classes-in-source-files#setting-your-base-path)

### 4-3. 完全禁止預設的檢所

如果你想要完全關閉自動檢索功能，並手動指定所有來源，可以使用 `source(none)`：

```css
@import "tailwindcss" source(none);
@source "../admin";
@source "../shared";
```

這個功能在擁有多個 Tailwind 樣式表的專案中特別有用，因為它能確保每個樣式表只包含該檔案所需的類別，避免不必要的 CSS 生成。

#### 參考資料
> 1. [Disabling automatic detection](https://tailwindcss.com/docs/detecting-classes-in-source-files#disabling-automatic-detection)

## 5. 新版本不支援 safelist 的解決方式

### 5-1. 過往在專案中處理動態Class的方式

在 Tailwind CSS 3.x 中，Tailwind 的檢索機制僅會掃描檔案中的靜態字串，而不會執行程式碼來計算或組合 class 名稱。換句話說，當你在定義共用組件或樣式配置時，如果透過字串組合來動態產生 utilities class，這些動態生成的 class 因為未以靜態形式出現在原始碼中，就不會被 Tailwind 檢測到。因此在編譯過程中，Tailwind 不會生成對應的 CSS Class，導致專案啟動後，這些 class 的樣式無法正確套用。

為了解決這個問題，官方提供了 safelist 配置。在 tailwind.config.js 檔案的 content 設定中，你可以手動列出那些會透過動態組合產生，但未以靜態字串出現的 utilities class。這樣，Tailwind 在編譯時就會強制生成這些 class，確保它們能正確運作。

例如，假設你有動態組合的 class 名可能包含「bg-red-500」或「text-xl」等，你可以在配置檔中這麼設定：

```jsx
module.exports = {
  content: {
    // 指定需要掃描的檔案路徑
    files: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    // safelist 中列出動態生成的 class 名
    safelist: [
      'bg-red-500',
      'text-xl',
      // 可根據需要加入其他動態組合的 class 名
    ],
  },
  // 其他配置項目
}
```

這種做法的好處在於，無論你如何動態組合字串，只要提前將可能出現的 class 名加入 safelist，Tailwind 都會確保這些樣式在編譯後存在於最終輸出的 CSS 中，從而避免因為檢測不到動態 class 而導致樣式缺失的問題。

#### 參考資料
> 1. [Safelisting classes](https://v3.tailwindcss.com/docs/content-configuration#safelisting-classes)

### 5-2. 新版本**safelist移除後的解決方式**

在 Tailwind CSS 4.0 中，官方明確表示「[The corePlugins, safelist and separator options from the JavaScript-based config are not supported in v4.0.](https://tailwindcss.com/docs/functions-and-directives#config-directive)」也就是說，舊版透過 JavaScript 配置檔直接設定 safelist 的方式已無法使用。

新版本採用了全新的檔案檢索機制：Tailwind 預設會掃描專案目錄下所有的靜態檔案，或可以透過 @source 指令來明確指定靜態檔案的路徑。利用這個機制，我們可以將需要保留的 class 寫進一個獨立的檔案中，確保它們能夠被編譯進最終的 CSS。

例如，你可以建立一個名為 safelist.txt 的檔案，內容如下：

```
# safelist.txt
'bg-red-500'
'bg-green-500'
'bg-blue-500'
```

接著，在你的 CSS 檔案中，先引入 Tailwind CSS，再透過 @source 指令指定 safelist.txt 的路徑：

```css
@import "tailwindcss";
@source "../safelist.txt";
```

這樣一來，編譯器在處理時會自動將 safelist.txt 中列舉的所有 class 加入編譯結果，確保這些動態生成的 class 不會因為沒有在靜態檔案中出現而被忽略。

此外，另一種解決方案是直接建立一個 TypeScript 檔案，定義一個包含 safelist class 的 array，例如：

```tsx
// safelist.ts
const safelist = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
]
```

這個陣列中的 class 也會被 Tailwind 編譯進最終的 CSS 中，同樣達到保留動態 class 的效果。

#### 參考資料
> 1. [@config](https://tailwindcss.com/docs/functions-and-directives#config-directive)
> 2. [Safelist in Tailwindcss 4. Is it possible? Pattern + Variants?](https://stackoverflow.com/questions/79323991/safelist-in-tailwindcss-4-is-it-possible-pattern-variants)