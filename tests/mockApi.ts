import type { Page } from "@playwright/test";
import type { File, Folder } from "../src/types";

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    } else if (route.request().method() === "DELETE") {
      return route.fulfill({
        status: 204,
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
          url: "https://picsum.photos/1024/768",
          size: Math.round(Math.random() * 344189),
          folder: 1,
          thumbnail: "https://picsum.photos/100/100",
        }),
      });
    }
  });
  await page.route("**/api/files/*", (route) => {
    return route.fulfill({
      status: 204,
    });
  });
  await page.route("**/api/folders/*", (route) => {
    return route.fulfill({
      status: 204,
    });
  });
};

export const foldersResponse = (
  n: number,
  parent?: Folder["parent"]
): Folder[] => {
  return [
    ...Array.from({ length: n }, (_, i) => ({
      id: parent ? `${parent}_${i}` : i,
      name: parent ? `Child ${i}` : `Folder ${i}`,
      parent: parent,
    })),
    ...(parent === undefined ? foldersResponse(10, 2) : []),
    ...(parent === undefined
      ? [{ id: "empty", name: "Empty", parent: null }]
      : []),
  ];
};

export const filesResponse = (n: number, folder?: Folder["parent"]): File[] => {
  const seed = between(0, 500);
  return Array.from({ length: n }, (_, i) => {
    const url = `https://picsum.photos/id/${seed + i}`;
    return {
      id: i,
      name: `${folder ?? "root"}_${i}.jpg`,
      url: url + "/1024/768",
      size: Math.round(Math.random() * 344189),
      folder,
      thumbnail: url + "/100/100",
    };
  });
};
