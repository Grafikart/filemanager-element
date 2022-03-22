import type { Page } from "@playwright/test";

export async function dropFile(page: Page, selector: string) {
  // Create the DataTransfer and File
  const dataTransfer = await page.evaluateHandle(() => {
    const dt = new DataTransfer();
    // Convert the buffer to a hex array
    const file = new File([""], "img.jpg", { type: "image/png" });
    dt.items.add(file);
    return dt;
  });

  // Now dispatch
  await page.dispatchEvent(selector, "drop", { dataTransfer });
}
