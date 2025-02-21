import React from "react";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";

// 從 href 中擷取日期字串，格式為 YYYY-MM-DD
function extractDate(href) {
  const match = href.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[0] : null;
}

// 遞迴扁平化 Sidebar 項目，若項目為連結則加入，若為分類則傳入該分類名稱作為 parentCategory
function flattenSidebarItems(items, parentCategory = "未分類") {
  return items.reduce((acc, item) => {
    if (item.type === "link") {
      acc.push({
        label: item.label,
        href: item.href,
        docId: item.docId,
        category: parentCategory,
        date: extractDate(item.href),
      });
    } else if (item.type === "category") {
      acc = acc.concat(flattenSidebarItems(item.items, item.label));
    }
    return acc;
  }, []);
}

export default function AllPostsList() {
  const sidebar = useDocsSidebar();

  if (!sidebar?.items) {
    return (
      <div
        className="p-4 text-center"
        style={{ color: "var(--ifm-color-primary-dark)" }}
      >
        當前頁面沒有綁定 Docs Sidebar 或沒有可顯示的筆記。
      </div>
    );
  }

  // 扁平化 Sidebar 資料
  const notes = flattenSidebarItems(sidebar.items);

  // 根據日期排序：若有日期則日期越新排在前面，無日期的則置後
  notes.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (a.date) {
      return -1;
    } else if (b.date) {
      return 1;
    } else {
      return 0;
    }
  });

  // 過濾掉不需要顯示的類別，這裡排除 "Tutorial" 類別
  const excludedCategories = ["Tutorial"];
  const filteredNotes = notes.filter(
    (note) => !excludedCategories.includes(note.label),
  );

  return (
    <div className="p-4">
      <h2
        className="mb-4 text-2xl font-bold"
        style={{ color: "var(--ifm-color-primary-darkest)" }}
      >
        所有筆記列表
      </h2>
      {filteredNotes.map((note) => (
        <div
          key={note.href}
          className="mb-4 rounded-md bg-gray-600 p-4 shadow-md"
          style={{
            border: "2px solid var(--ifm-color-primary)", // 基底色邊框
          }}
        >
          <a
            href={note.href}
            className="text-xl font-semibold hover:underline"
            style={{ color: "var(--ifm-color-primary-darkest)" }} // 深色文字
          >
            {note.label}
          </a>
          <div className="mt-2 flex items-center">
            <span
              className="mr-2 rounded px-2 py-1 text-xs font-medium text-gray-700"
              style={{
                backgroundColor: "var(--ifm-color-primary)",
              }} // 分類徽章：基底色背景＋白色文字
            >
              {note.category}
            </span>
            {note.date ? (
              <span
                className="text-sm"
                style={{ color: "var(--ifm-color-primary-dark)" }}
              >
                {note.date}
              </span>
            ) : (
              <span
                className="text-sm"
                style={{ color: "var(--ifm-color-primary-dark)" }}
              >
                無日期
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
