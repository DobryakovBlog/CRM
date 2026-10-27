import { describe, expect, it } from "vitest";
import { normalizeSocial, socialLabel } from "./social";

describe("social links", () => {
  it("accepts handles, bare addresses and full links", () => {
    expect(normalizeSocial("instagram", "@studio.lumiere")).toBe("https://www.instagram.com/studio.lumiere");
    expect(normalizeSocial("instagram", "instagram.com/studio_lumiere/")).toBe("https://instagram.com/studio_lumiere/");
    expect(normalizeSocial("tiktok", "barbearia.alfaiate")).toBe("https://www.tiktok.com/@barbearia.alfaiate");
    expect(normalizeSocial("facebook", "https://m.facebook.com/tabernadolargo")).toBe("https://m.facebook.com/tabernadolargo");
    expect(normalizeSocial("website", "salaolumiere.pt")).toBe("https://salaolumiere.pt/");
    expect(normalizeSocial("whatsapp", "912 345 678")).toBe("https://wa.me/351912345678");
    expect(normalizeSocial("whatsapp", "+351 912 345 678")).toBe("https://wa.me/351912345678");
    expect(normalizeSocial("whatsapp", "612 345 678", "es")).toBe("https://wa.me/34612345678");
    expect(normalizeSocial("whatsapp", "+351 912 345 678", "es")).toBe("https://wa.me/351912345678");
    expect(normalizeSocial("instagram", "  ")).toBe("");
  });

  it("refuses links to other sites under a network's icon", () => {
    expect(normalizeSocial("instagram", "https://evil.example/instagram.com")).toBeNull();
    expect(normalizeSocial("instagram", "https://instagram.com.evil.example/x")).toBeNull();
    expect(normalizeSocial("facebook", "javascript:alert(1)")).toBeNull();
    expect(normalizeSocial("website", "not a site")).toBeNull();
    expect(normalizeSocial("whatsapp", "12")).toBeNull();
  });

  it("labels links for display", () => {
    expect(socialLabel("instagram", "https://www.instagram.com/studio/")).toBe("@studio");
    expect(socialLabel("tiktok", "https://www.tiktok.com/@barber")).toBe("@barber");
    expect(socialLabel("website", "https://www.salao.pt/")).toBe("salao.pt");
    expect(socialLabel("whatsapp", "https://wa.me/351912345678")).toBe("+351912345678");
  });
});
