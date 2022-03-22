import type { Page } from "@playwright/test";
import { request } from "@playwright/test";

export const mockApi = async (page: Page) => {
  // Mock the folders API
  await page.route("**/api/folders*", (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        body: JSON.stringify(foldersResponse(5)),
      });
    } else if (route.request().method() === "POST") {
      const data = route.request().postDataJSON();
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: Date.now(),
          name: data.name,
          parent: data.parent,
        }),
      });
    }
  });
  // Mock the file API
  await page.route("**/api/files*", (route) => {
    if (route.request().method() === "GET") {
      const url = new URL(route.request().url());
      const folder = url.searchParams.get("folder");
      return route.fulfill({
        status: 200,
        body: JSON.stringify(
          folder === "empty"
            ? []
            : filesResponse(15, url.searchParams.get("folder"))
        ),
      });
    } else {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: Date.now(),
          name: `new_file.png`,
          url: image,
          size: Math.round(Math.random() * 344189),
          folder: 1,
          thumbnail: image,
        }),
      });
    }
  });
  await page.route("**/api/files/*", (route) => {
    return route.fulfill({
      status: 204,
    });
  });
};

const image =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAAHRJREFUGFcBaQCW/wFwNYX/Afv3AALxGQAoXz8A9PzvAAFjMnH/BgkMAAcDCwDxAA8A7A4LAAFzOIr/B/oDAPb99gABAAQA7AYQAAGBOKH/+Pj8AP7/8wD89AoAByEcAAFkM3P/AfoCABQHEwDz7RIAJEkqAK2qJGVCd5kpAAAAAElFTkSuQmCC";

const foldersResponse: any = (n: number, parent: number | null = null) => {
  return [
    ...Array.from({ length: n }, (_, i) => ({
      id: parent ? `${parent}_${i}` : i,
      name: parent ? `Child ${i}` : `Folder ${i}`,
      parent: parent,
    })),
    ...(parent === null ? foldersResponse(10, 2) : []),
    ...(parent === null ? [{ id: "empty", name: "Empty", parent: null }] : []),
  ];
};

const filesResponse = (n: number, folder: number | string | null = null) => {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    name: `${folder}_${i}.jpg`,
    url: image,
    size: Math.round(Math.random() * 344189),
    folder,
    thumbnail: image,
  }));
};
