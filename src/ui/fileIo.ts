export function downloadSave(json: string) {
  downloadJson(json, "new-game-save-ja.json");
}

export function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function readFile(file: File | undefined, onRead: (raw: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (typeof reader.result === "string") onRead(reader.result);
  });
  reader.readAsText(file);
}
