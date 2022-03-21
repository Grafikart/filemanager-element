import { test, expect } from "@playwright/test";

const foldersResponse: any = (n: number, parent: number | null = null) => {
  return [
    ...Array.from({ length: n }, (_, i) => ({
      id: parent ? `${parent}_${i}` : i,
      name: parent ? `Child ${i}` : `Folder ${i}`,
      parent: parent,
    })),
    ...(parent === null ? foldersResponse(10, 2) : []),
  ];
};

const filesResponse = (n: number, prefix: string) => {
  const image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAAHRJREFUGFcBaQCW/wFwNYX/Afv3AALxGQAoXz8A9PzvAAFjMnH/BgkMAAcDCwDxAA8A7A4LAAFzOIr/B/oDAPb99gABAAQA7AYQAAGBOKH/+Pj8AP7/8wD89AoAByEcAAFkM3P/AfoCABQHEwDz7RIAJEkqAK2qJGVCd5kpAAAAAElFTkSuQmCC";
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    name: `${prefix}_${i}.jpg`,
    url: image,
    size: Math.round(Math.random() * 344189),
    folder: null,
    thumbnail: image,
  }));
};

test.describe("FileManager behaviour", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/folders*", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(foldersResponse(5)),
      })
    );
    await page.route("**/api/files*", (route) => {
      const url = new URL(route.request().url());
      route.fulfill({
        status: 200,
        body: JSON.stringify(
          filesResponse(15, url.searchParams.get("folder") ?? "root")
        ),
      });
    });
    return page.goto("http://localhost:3000/index.html");
  });

  test.describe("Sidebar behaviour", () => {
    test("Show the root folder", async ({ page }) => {
      await expect(page.locator(".fm-folder-name").first()).toHaveText("/");
    });

    test("Show the list of folders", async ({ page }) => {
      await expect(page.locator("text=Folder 0").first()).toBeVisible();
      await expect(page.locator("text=Folder 4").first()).toBeVisible();
      await expect(page.locator("text=Child 2").first()).not.toBeVisible();
    });

    test("Unfold a folder on click", async ({ page }) => {
      await page.locator("text=Folder 2").first().click();
      await expect(page.locator("text=Child 2").first()).toBeVisible();
    });

    test("Fold back the folder on click", async ({ page }) => {
      await page.locator("text=Folder 2").first().click();
      await expect(page.locator("text=Child 2").first()).toBeVisible();
      await page.locator("text=Folder 2").first().click({ force: true });
      await expect(page.locator("text=Child 2").first()).not.toBeVisible();
    });

    test.only("Create a new folder on click", async ({ page }) => {
      await page.locator(".fm-new-folder").nth(3).click();
      await page.waitForTimeout(10);
      await page.keyboard.type("hello");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(10);
    });
  });

  test.describe("Files behaviour", () => {
    test("Load the file list when clicking on a specific folder", async ({
      page,
    }) => {
      await page.locator("text=Folder 2").first().click();
      await expect(page.locator("text=2_0.jpg").first()).toBeVisible();
    });
  });
});
