# Table 的 Header 與 Body 的同步移動

## 情境描述以及問題說明

在專案開發過程中，經常會遇到表格處理的需求。當資料欄位數量超出螢幕顯示範圍時，通常需要透過 overflow 設定來隱藏超出部分，並搭配 Scrollbar 來檢視完整內容。然而，這會導致一個使用者體驗的問題：滾動時 header 會隨之消失，使用者必須重新捲動到頂部才能確認欄位對應的內容。因此，我們需要讓 header 固定在頂部，不隨 Scrollbar 滾動而消失。此外，由於資料欄位眾多，希望能避免單純使用滑鼠拖曳 Scrollbar 來進行上下左右移動。在需要支援多種裝置和 RWD 的專案中，這些需求會產生以下問題：

1. 要以什麼結構才能做到滾動時 header 固定在上方
2. 要怎麼通過滑鼠拖曳的方式移動 scrollbar 的位置並且 header 跟 body 位置要同步
3. 如手機、平板上需要如何判斷它是否是觸控設備，同時又該如何自己控制觸控拖拉的效果
4. 部分筆電擁有觸控板是怎麼運作的如何控制
5. 瀏覽器開發者模式中有 device tool 操作頁面會以什麼方式運作

以上是在處理這個需求的問題整理，在解決之前需要先了解到需要搭配哪些 javascript event 來達成這個效果。

## 了解使用到的事件與基本原理

### 1. scroll 事件

- scroll 事件只在實際滾動發生時觸發
- 僅能用於監聽滾動位置，無法使用 preventDefault() 來阻止滾動

### 2. wheel 事件

- wheel 事件可透過滑鼠滾輪及筆電觸控板（trackpad）觸發
- 它與 scroll 事件是獨立的，因為 scroll 可由鍵盤、拖動滾動條或 JavaScript 觸發
- 可使用 preventDefault() 阻止事件觸發，進而防止後續的 scroll 事件，但需設置 \{ passive: false \}

### 3. touch move 事件

- touchmove 事件在觸控裝置上由用戶手指滑動觸發
- 為提升用戶體驗，觸發 touch 事件時也會觸發 mouse 事件，開發時可使用 preventDefault() 阻止此行為，需設置 \{ passive: false \}

### 4. mouse 事件

- 包含 mousedown、mousemove 與 mouseup，用於實現滑鼠拖曳操作，分別對應滑鼠按下、移動與放開三個階段

## 實際來解決問題

目前了解要搭配那些事件來處理，現在可以來看一下每個問題該怎麼組合這些事件來達成最終目的

### 問題一：要以什麼結構才能做到滾動時 header 固定在上方

要做到這樣一個效果通常會將 header 跟 body 的部分拆開成兩個區塊如下：

```html
<div class="table">
  <div class="table-header">
    <!-- 固定表頭：欄位名稱 -->
  </div>
  <div class="table-body">
    <!-- 可滾動內容：大量數據 -->
  </div>
</div>
```

為什麼要拆解成這樣的結構？主要原因是為了讓 header 固定在上方，這代表 body 需要有獨立的 scrollbar，而不是讓整個 table 共用同一個。

透過設定 CSS overflow，我們可以為 header 和 body 分別設定 scrollbar。如果想要隱藏 scrollbar 但保留滾動功能，可以使用特定的 CSS 設定。

```css
.no-scrollbar {
  overflow: auto; /* 允許滾動 */
  -ms-overflow-style: none; /* 隱藏 IE & Edge 的滾動條 */
  scrollbar-width: none; /* 隱藏 Firefox 的滾動條 */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* 隱藏 Chrome、Safari、Edge 的滾動條 */
}
```

### 問題二：要怎麼通過滑鼠拖曳的方式移動 scrollbar 的位置並且 header 跟 body 位置要同步

要實現這個功能，我們需要監聽三個滑鼠事件：mousedown、mousemove 和 mouseup。當使用者按下滑鼠時（mousedown），系統會記錄初始位置；滑鼠移動時（mousemove），計算位置差異並更新滾動位置；最後在放開滑鼠時（mouseup），結束拖曳操作。

為了讓 header 和 body 能同步移動，我們需要建立一個 function 來處理這些事件，如下所示：

```jsx
// 初始化拖曳功能
function initDrag(tableHeader, tableBody) {
  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;

  // 監聽滑鼠按下事件
  function handleMouseDown(e) {
    isDragging = true;
    startX = e.pageX - tableBody.offsetLeft;
    startY = e.pageY - tableBody.offsetTop;
    scrollLeft = tableBody.scrollLeft;
    scrollTop = tableBody.scrollTop;
  }

  // 監聽滑鼠移動事件
  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    // 計算位置差異
    const x = e.pageX - tableBody.offsetLeft;
    const y = e.pageY - tableBody.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;

    // 更新滾動位置
    tableBody.scrollLeft = scrollLeft - walkX;
    tableHeader.scrollLeft = scrollLeft - walkX;
    tableBody.scrollTop = scrollTop - walkY;
  }

  // 監聽滑鼠放開事件
  function handleMouseUp() {
    isDragging = false;
  }

  // 綁定事件監聽器
  tableBody.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // 監聽滾動事件，同步 header 和 body
  tableBody.addEventListener("scroll", () => {
    tableHeader.scrollLeft = tableBody.scrollLeft;
  });
}

// 使用範例
const tableHeader = document.querySelector(".table-header");
const tableBody = document.querySelector(".table-body");
initDrag(tableHeader, tableBody);
```

這個範例實現了以下功能：

- 當使用者按下滑鼠時，系統會記錄初始位置和滾動位置
- 滑鼠移動過程中，即時計算移動距離並更新滾動位置
- 確保 header 和 body 的水平滾動保持同步
- 當滑鼠放開時，清除相關事件以避免不必要的監聽

### 問題三：在觸控螢幕如手機、平板上的拖曳如何處理

在觸控設備的時候，需要先判斷當前設備是不是，可以通過下面的方式來判斷

```jsx
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
  );
}
```

檢測完如果是觸控設備的話就如果希望自主控制 touch 事件的變化可以使用 preventDefault() + \{ passive: false \} 來禁止調原生得事件處理，可以參考如下：

```jsx
function initTouchDrag(tableHeader, tableBody) {
  let startX, startY, scrollLeft, scrollTop;

  // 觸控開始事件
  function handleTouchStart(e) {
    const touch = e.touches[0];
    startX = touch.pageX - tableBody.offsetLeft;
    startY = touch.pageY - tableBody.offsetTop;
    scrollLeft = tableBody.scrollLeft;
    scrollTop = tableBody.scrollTop;
  }

  // 觸控移動事件
  function handleTouchMove(e) {
    if (startX == null || startY == null) return;
    e.preventDefault();

    const touch = e.touches[0];
    const x = touch.pageX - tableBody.offsetLeft;
    const y = touch.pageY - tableBody.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;

    tableHeader.scrollLeft = scrollLeft - walkX;
    tableBody.scrollLeft = scrollLeft - walkX;
    tableBody.scrollTop = scrollTop - walkY;
  }

  // 觸控結束事件
  function handleTouchEnd() {
    startX = null;
    startY = null;
  }

  // 綁定觸控事件
  tableBody.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  tableBody.addEventListener("touchmove", handleTouchMove, { passive: false });
  tableBody.addEventListener("touchend", handleTouchEnd);

  // 同步滾動
  tableBody.addEventListener("scroll", () => {
    tableHeader.scrollLeft = tableBody.scrollLeft;
  });
}
```

這個範例主要處理幾個部分：

- 使用 touchstart 事件記錄初始觸控位置
- 在 touchmove 事件中計算移動距離並更新滾動位置
- touchend 事件清除記錄的位置
- 設置 passive: false 來允許在觸控事件中使用 preventDefault()

現在可以根據設備類型來決定使用哪種拖曳方式：

```jsx
if (isTouchDevice()) {
  initTouchDrag(tableHeader, tableBody);
} else {
  initDrag(tableHeader, tableBody);
}
```

### 問題四：部分筆電擁有觸控板是怎麼運作的如何控制

觸控板（trackpad）的操作主要是透過 wheel 事件來處理，這是因為大多數觸控板的滾動行為都會轉換成 wheel 事件。我們可以擴充問題二的 function，加入對 wheel 事件邏輯的處理，如下所示：

```jsx
// ...接續加入到 問題二 initDrag 的最後

// 同步 header 捲動：讓 header 的水平捲動跟隨 body
const syncScroll = () => {
  requestAnimationFrame(() => {
    tableHeader.scrollLeft = tableBody.scrollLeft;
  });
};

tableBody.addEventListener("scroll", syncScroll, { passive: false });

// 定義 wheel 事件處理函式，避免 header 獨立捲動
const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  tableBody.scrollLeft += e.deltaX + e.deltaY;
};

tableHeader.addEventListener("wheel", onWheel, { passive: false });
```

上面的邏輯會禁止 header 的 wheel 事件。當 header 觸發 wheel 事件時，系統會攔截該事件並將變動設定到 body 的 scroll 上。當 body scroll 發生變動時，會再去更新 header 的位置，使整個變更流程為：header wheel callback ⇒ update body scroll ⇒ body scroll callback ⇒ sync header scroll。

### 問題五：瀏覽器開發者模式中有 device tool 操作頁面會以什麼方式運作

由於瀏覽器開發者模式會依據不同設定將滑鼠點擊轉換為觸控事件，為了確保在這種情況下 header 和 body 能保持同步，我們需要加入觸控事件的處理邏輯。以下是整合前面 initDrag 的完整版本：

```jsx
function initDrag(tableHeader, tableBody) {
  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;

  function handleMouseDown(e) {
    isDragging = true;
    startX = e.pageX - tableBody.offsetLeft;
    startY = e.pageY - tableBody.offsetTop;
    scrollLeft = tableBody.scrollLeft;
    scrollTop = tableBody.scrollTop;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - tableBody.offsetLeft;
    const y = e.pageY - tableBody.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;

    tableBody.scrollLeft = scrollLeft - walkX;
    tableHeader.scrollLeft = scrollLeft - walkX;
    tableBody.scrollTop = scrollTop - walkY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // 新增觸控事件的監聽（以因應 Device Tool 下會觸發 touch 事件的情況）
  let touchStartX, touchStartY, touchScrollLeft, touchScrollTop;

  function handleTouchStart(e) {
    // 只抓第一隻手指的座標
    const touch = e.touches[0];
    touchStartX = touch.pageX - tableBody.offsetLeft;
    touchStartY = touch.pageY - tableBody.offsetTop;
    touchScrollLeft = tableBody.scrollLeft;
    touchScrollTop = tableBody.scrollTop;
  }

  function handleTouchMove(e) {
    // 不要使用預設的滾動行為，改用自訂
    e.preventDefault();

    const touch = e.touches[0];
    const x = touch.pageX - tableBody.offsetLeft;
    const y = touch.pageY - tableBody.offsetTop;
    const walkX = x - touchStartX;
    const walkY = y - touchStartY;

    tableBody.scrollLeft = touchScrollLeft - walkX;
    tableHeader.scrollLeft = touchScrollLeft - walkX;
    tableBody.scrollTop = touchScrollTop - walkY;
  }

  function handleTouchEnd() {
    // 若需要在結束時做其他處理，可在這裡補充
    touchStartX = null;
    touchStartY = null;
  }

  // 同步 header、body
  function handleScroll() {
    tableHeader.scrollLeft = tableBody.scrollLeft;
  }

  // 若要攔截 header 上的 wheel 並交由 body 處理，可依需求加上
  function handleHeaderWheel(e) {
    e.preventDefault();
    tableBody.scrollLeft += e.deltaX + e.deltaY;
  }

  // 綁定滑鼠事件
  tableBody.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // 綁定觸控事件（包含 tableHeader 與 tableBody）
  tableBody.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  tableBody.addEventListener("touchmove", handleTouchMove, { passive: false });
  tableBody.addEventListener("touchend", handleTouchEnd);

  tableHeader.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  tableHeader.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  tableHeader.addEventListener("touchend", handleTouchEnd);

  // 綁定捲動事件（同步 header scrollLeft）
  tableBody.addEventListener("scroll", handleScroll, { passive: true });

  // 需要攔截 header 區域的 wheel 時
  tableHeader.addEventListener("wheel", handleHeaderWheel, { passive: false });
}

// 使用範例
const tableHeader = document.querySelector(".table-header");
const tableBody = document.querySelector(".table-body");
initDrag(tableHeader, tableBody);
```

現在這個版本同時支援滑鼠和觸控事件，在瀏覽器開發者模式（Device Toolbar）中，即使模擬裝置將滑鼠點擊轉換為觸控事件，仍能維持與桌面版一致的拖曳效果。

## 總結

在處理表格 Header 與 Body 同步移動的需求時，需要考慮多個面向的問題，包括：

- DOM 結構的設計：確保能實現 Header 固定且與 Body 同步滾動
- 事件處理的完整性：同時處理 mouse、wheel、touch 等多種輸入方式
- 跨設備支援：針對不同設備特性（觸控、觸控板、滑鼠）提供適當的互動方式
- 效能優化：使用 requestAnimationFrame 確保滾動同步的流暢度

通過合理的的事件處理，可以實現一個在各種設備和使用情境下都能正常運作的表格同步滾動功能，也保證了在不同平台上的一致性表現。

#### 參考資料

> 1. [MDN – scroll 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event)
> 2. [MDN – WheelEvent](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)
> 3. [MDN – Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
> 4. [MDN – passive 事件監聽器](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#optionspassive)
> 5. [MDN – requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
> 6. [MDN – Element: scrollLeft property](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft)
