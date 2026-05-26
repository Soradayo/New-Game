import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadJson, downloadSave, readFile } from "./fileIo";

describe("ui file I/O helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("downloads JSON using the requested filename and releases the object URL", () => {
    const click = vi.fn();
    const link = {
      href: "",
      download: "",
      click,
    };
    const createObjectURL = vi.fn(() => "blob:download-url");
    const revokeObjectURL = vi.fn();

    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    vi.stubGlobal("document", {
      createElement: vi.fn(() => link),
    });

    downloadJson('{"ok":true}', "example.json");

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(link.href).toBe("blob:download-url");
    expect(link.download).toBe("example.json");
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:download-url");
  });

  it("uses the standard save filename for save export", () => {
    const link = {
      href: "",
      download: "",
      click: vi.fn(),
    };

    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:save-url"),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal("document", {
      createElement: vi.fn(() => link),
    });

    downloadSave('{"turn":1}');

    expect(link.download).toBe("new-game-save-ja.json");
  });

  it("reads text files and ignores an empty file selection", () => {
    const onRead = vi.fn();

    class TestFileReader {
      result: string | ArrayBuffer | null = null;
      private listener: (() => void) | undefined;

      addEventListener(type: string, listener: () => void) {
        if (type === "load") this.listener = listener;
      }

      readAsText() {
        this.result = '{"loaded":true}';
        this.listener?.();
      }
    }

    vi.stubGlobal("FileReader", TestFileReader);

    readFile(undefined, onRead);
    readFile({} as File, onRead);

    expect(onRead).toHaveBeenCalledTimes(1);
    expect(onRead).toHaveBeenCalledWith('{"loaded":true}');
  });
});
