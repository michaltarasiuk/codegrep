import { describe, expect, it, vi } from "vitest";

import { ContentDisposition } from "./content-disposition.js";

describe("ContentDisposition", () => {
  it("initializes with an empty string", () => {
    let header = new ContentDisposition("");
    expect(header.type).toBeUndefined();
    expect(header.filename).toBeUndefined();
  });

  it("initializes with a string", () => {
    let header = new ContentDisposition('attachment; filename="example.txt"');
    expect(header.type).toBe("attachment");
    expect(header.filename).toBe("example.txt");
  });

  it("initializes with an object", () => {
    let header = new ContentDisposition({
      type: "attachment",
      filename: "example.txt",
    });
    expect(header.type).toBe("attachment");
    expect(header.filename).toBe("example.txt");
  });

  it("initializes with another ContentDisposition", () => {
    let header = new ContentDisposition(
      new ContentDisposition('attachment; filename="example.txt"')
    );
    expect(header.type).toBe("attachment");
    expect(header.filename).toBe("example.txt");
  });

  it("handles whitespace in initial value", () => {
    let header = new ContentDisposition(
      ' inline ;  filename = "document.pdf" '
    );
    expect(header.type).toBe("inline");
    expect(header.filename).toBe("document.pdf");
  });

  it("sets and gets type", () => {
    let header = new ContentDisposition("attachment");
    header.type = "inline";
    expect(header.type).toBe("inline");
  });

  it("sets and gets filename", () => {
    let header = new ContentDisposition("attachment");
    header.filename = "example.txt";
    expect(header.filename).toBe("example.txt");
  });

  it("sets and gets name", () => {
    let header = new ContentDisposition("form-data");
    header.name = "field1";
    expect(header.name).toBe("field1");
  });

  it("sets and gets filenameSplat", () => {
    let header = new ContentDisposition("attachment");
    header.filenameSplat = "UTF-8''%E6%96%87%E4%BB%B6.txt";
    expect(header.filenameSplat).toBe("UTF-8''%E6%96%87%E4%BB%B6.txt");
  });

  it("handles quoted attribute values", () => {
    let header = new ContentDisposition(
      'attachment; filename="file with spaces.txt"'
    );
    expect(header.filename).toBe("file with spaces.txt");
  });

  it("converts to string correctly", () => {
    let header = new ContentDisposition('attachment; filename="example.txt"');
    expect(header.toString()).toBe("attachment; filename=example.txt");
  });

  it("converts to an empty string when type is not set", () => {
    let header = new ContentDisposition();
    header.filename = "example.txt";
    expect(header.toString()).toBe("");
  });

  it("handles multiple attributes", () => {
    let header = new ContentDisposition(
      'form-data; name="field1"; filename="example.txt"'
    );
    expect(header.type).toBe("form-data");
    expect(header.name).toBe("field1");
    expect(header.filename).toBe("example.txt");
  });

  it("preserves case for type", () => {
    let header = new ContentDisposition("Attachment");
    expect(header.type).toBe("Attachment");
  });

  it("handles attribute values with special characters", () => {
    let header = new ContentDisposition(
      'attachment; filename="file with spaces and (parentheses).txt"'
    );
    expect(header.filename).toBe("file with spaces and (parentheses).txt");
  });

  it("correctly quotes attribute values in toString()", () => {
    let header = new ContentDisposition("attachment");
    header.filename = 'file "with" quotes.txt';
    expect(header.toString()).toBe(
      'attachment; filename="file \\"with\\" quotes.txt"'
    );
  });

  it("handles empty attribute values", () => {
    let header = new ContentDisposition("form-data; name=");
    expect(header.name).toBe("");
  });

  it("ignores attributes without values", () => {
    let header = new ContentDisposition("attachment; filename");
    expect(header.filename).toBeUndefined();
  });

  it("preserves order of attributes in toString()", () => {
    let header = new ContentDisposition(
      'form-data; name="field1"; filename="example.txt"'
    );
    expect(header.toString()).toBe(
      "form-data; name=field1; filename=example.txt"
    );
  });

  it("handles filename* (RFC 5987) correctly", () => {
    let header = new ContentDisposition(
      "attachment; filename*=UTF-8''%E6%96%87%E4%BB%B6.txt"
    );
    expect(header.filenameSplat).toBe("UTF-8''%E6%96%87%E4%BB%B6.txt");
  });

  it("prioritizes filename* over filename when both are present", () => {
    let header = new ContentDisposition(
      "attachment; filename=\"fallback.txt\"; filename*=UTF-8''%E6%96%87%E4%BB%B6.txt"
    );
    expect(header.filename).toBe("fallback.txt");
    expect(header.filenameSplat).toBe("UTF-8''%E6%96%87%E4%BB%B6.txt");
  });

  it("handles form-data disposition type correctly", () => {
    let header = new ContentDisposition(
      'form-data; name="uploadedfile"; filename="example.txt"'
    );
    expect(header.type).toBe("form-data");
    expect(header.name).toBe("uploadedfile");
    expect(header.filename).toBe("example.txt");
  });

  describe("preferredFilename", () => {
    it("returns filename* when both filename and filename* are present", () => {
      let header = new ContentDisposition(
        "attachment; filename=\"old.txt\"; filename*=UTF-8''new.txt"
      );
      expect(header.preferredFilename).toBe("new.txt");
    });

    it("returns filename when only filename is present", () => {
      let header = new ContentDisposition(
        'attachment; filename="document.pdf"'
      );
      expect(header.preferredFilename).toBe("document.pdf");
    });

    it("returns filename* when only filename* is present", () => {
      let header = new ContentDisposition(
        "attachment; filename*=UTF-8''special%20file.txt"
      );
      expect(header.preferredFilename).toBe("special file.txt");
    });

    it("handles UTF-8 encoded filename* with special characters", () => {
      let header = new ContentDisposition(
        "attachment; filename*=UTF-8''%E6%96%87%E4%BB%B6.txt"
      );
      expect(header.preferredFilename).toBe("文件.txt");
    });

    it("handles ISO-8859-1 encoded filename* with special characters", () => {
      let header = new ContentDisposition(
        "attachment; filename*=ISO-8859-1''f%F6o.txt"
      );
      expect(header.preferredFilename).toBe("föo.txt");
    });

    it("handles filename* with spaces and other special characters", () => {
      let header = new ContentDisposition(
        "attachment; filename*=UTF-8''hello%20world%21%20%26%20goodbye.txt"
      );
      expect(header.preferredFilename).toBe("hello world! & goodbye.txt");
    });

    it("returns undefined when no filename or filename* is present", () => {
      let header = new ContentDisposition("attachment");
      expect(header.preferredFilename).toBeUndefined();
    });

    it("falls back to filename when filename* is invalid", () => {
      let header = new ContentDisposition(
        'attachment; filename="fallback.txt"; filename*=invalid'
      );
      expect(header.preferredFilename).toBe("fallback.txt");
    });

    it("correctly decodes ISO-8859-1 encoded filename", () => {
      let header = new ContentDisposition(
        "attachment; filename*=ISO-8859-1''f%F6o.txt"
      );
      expect(header.preferredFilename).toBe("föo.txt");
    });

    it("correctly decodes ISO-8859-15 encoded filename", () => {
      let header = new ContentDisposition(
        "attachment; filename*=ISO-8859-15''file%A4.txt"
      );
      expect(header.preferredFilename).toBe("file€.txt");
    });

    it("correctly decodes windows-1252 encoded filename", () => {
      let header = new ContentDisposition(
        "attachment; filename*=windows-1252''file%80.txt"
      );
      expect(header.preferredFilename).toBe("file\x80.txt");
    });

    it("handles UTF-8 encoded filename correctly", () => {
      let header = new ContentDisposition(
        "attachment; filename*=UTF-8''%E6%96%87%E4%BB%B6.txt"
      );
      expect(header.preferredFilename).toBe("文件.txt");
    });

    it("falls back gracefully with a warning for unknown charsets", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      let header = new ContentDisposition(
        "attachment; filename*=unknown-charset''file%FF.txt"
      );

      expect(header.preferredFilename).toBe("fileÿ.txt");
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });
});
