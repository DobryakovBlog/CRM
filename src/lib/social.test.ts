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
    expect(normalizeSocial("whatsapp", "06 12 34 56 78", "fr")).toBe("https://wa.me/33612345678");
    expect(normalizeSocial("whatsapp", "+33 6 12 34 56 78", "fr")).toBe("https://wa.me/33612345678");
    expect(normalizeSocial("whatsapp", "312 345 6789", "it")).toBe("https://wa.me/393123456789");
    expect(normalizeSocial("whatsapp", "0151 23456789", "de")).toBe("https://wa.me/4915123456789");
    expect(normalizeSocial("whatsapp", "06 12345678", "nl")).toBe("https://wa.me/31612345678");
    expect(normalizeSocial("whatsapp", "0470 12 34 56", "be")).toBe("https://wa.me/32470123456");
    expect(normalizeSocial("whatsapp", "087 123 4567", "ie")).toBe("https://wa.me/353871234567");
    expect(normalizeSocial("whatsapp", "621 123 456", "lu")).toBe("https://wa.me/352621123456");
    expect(normalizeSocial("whatsapp", "0664 1234567", "at")).toBe("https://wa.me/436641234567");
    expect(normalizeSocial("whatsapp", "079 123 45 67", "ch")).toBe("https://wa.me/41791234567");
    expect(normalizeSocial("whatsapp", "512 345 678", "pl")).toBe("https://wa.me/48512345678");
    expect(normalizeSocial("whatsapp", "601 234 567", "cz")).toBe("https://wa.me/420601234567");
    expect(normalizeSocial("whatsapp", "0901 234 567", "sk")).toBe("https://wa.me/421901234567");
    expect(normalizeSocial("whatsapp", "06 30 123 4567", "hu")).toBe("https://wa.me/36301234567");
    expect(normalizeSocial("whatsapp", "30 123 4567", "hu")).toBe("https://wa.me/36301234567");
    expect(normalizeSocial("whatsapp", "041 123 456", "si")).toBe("https://wa.me/38641123456");
    expect(normalizeSocial("whatsapp", "091 234 5678", "hr")).toBe("https://wa.me/385912345678");
    expect(normalizeSocial("whatsapp", "0712 345 678", "ro")).toBe("https://wa.me/40712345678");
    expect(normalizeSocial("whatsapp", "088 123 4567", "bg")).toBe("https://wa.me/359881234567");
    expect(normalizeSocial("whatsapp", "20 12 34 56", "dk")).toBe("https://wa.me/4520123456");
    expect(normalizeSocial("whatsapp", "070-123 45 67", "se")).toBe("https://wa.me/46701234567");
    expect(normalizeSocial("whatsapp", "412 34 567", "no")).toBe("https://wa.me/4741234567");
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
