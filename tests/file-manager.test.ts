import { test, expect } from "@playwright/test";
import { dropFile } from "./utils";
import { mockApi } from "./mockApi";

const hashes = {
  "with API calls": "",
  "with functions": "#function",
} as Record<string, string>;
Object.keys(hashes).forEach((key: keyof typeof hashes) => {
  test.describe(`FileManager ${key}`, () => {
    test.beforeEach(async ({ page }) => {
      await mockApi(page);
      return page.goto(`http://localhost:3000/index.html${hashes[key]}`);
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

      test("Create a new folder on click", async ({ page }) => {
        await page.locator(".fm-new-folder").nth(3).click();
        await page
          .locator(".fm-folder-form input")
          .waitFor({ state: "visible" });
        await page.keyboard.type("hello");
        await page.keyboard.press("Enter");
        await page.locator("text=Folder 2").first().click({ force: true });
        await expect(page.locator(".fm-folder-form")).not.toBeVisible();
        await expect(page.locator("text=hello").first()).toBeVisible();
      });

      test("Delete a folder", async ({ page }) => {
        await page.locator("text=Empty").first().click();
        await page.locator("text=Delete this folder").first().click();
        await expect(page.locator("text=Empty").first()).toBeHidden();
      });
    });

    test.describe("Files behaviour", () => {
      test("Load the file list when clicking on a specific folder", async ({
        page,
      }) => {
        await page.locator("text=Folder 2").first().click();
        await expect(page.locator("text=2_0.jpg").first()).toBeVisible();
      });
      test("Deleted file should be removed from the list", async ({ page }) => {
        page.on("dialog", (dialog) => dialog.accept());
        await page.locator("text=Folder 2").first().click();
        await expect(page.locator("text=2_0.jpg").first()).toBeVisible();
        await page
          .locator('.fm-file:has-text("2_0.jpg")')
          .locator(".fm-delete")
          .click();
        await expect(page.locator("text=2_0.jpg").first()).not.toBeVisible();
      });

      test("Drop file will upload it", async ({ page }) => {
        await page.locator("text=Folder 2").first().click();
        await dropFile(page, ".fm-dropzone");
        await expect(page.locator("text=new_file.png").first()).toBeVisible();
      });
    });
  });
});

test.describe(`FileManager readonly`, () => {
  test.beforeEach(async ({ page }) => {
    return page.goto(`http://localhost:3000/index.html#readonly`);
  });

  test.describe("Sidebar behaviour", () => {
    test("Hide the create folder button", async ({ page }) => {
      await expect(page.locator(".fm-new-folder")).toBeHidden();
    });

    test("Delete a folder", async ({ page }) => {
      await page.locator("text=Empty").first().click();
      await expect(
        page.locator("text=Delete this folder").first()
      ).toBeHidden();
    });
  });

  test.describe("Files behaviour", () => {
    test("Deleted file should be removed from the list", async ({ page }) => {
      page.on("dialog", (dialog) => dialog.accept());
      await page.locator("text=Folder 2").first().click();
      await expect(page.locator("text=2_0.jpg").first()).toBeVisible();
      await expect(
        page.locator('.fm-file:has-text("2_0.jpg")').locator(".fm-delete")
      ).toBeHidden();
    });

    test("Drop file will upload it", async ({ page }) => {
      await page.locator("text=Folder 2").first().click();
      await expect(page.locator(".fm-dropzone").first()).toBeHidden();
    });
  });
});
