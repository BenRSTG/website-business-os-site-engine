import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }));

const SECRET = "s".repeat(40);

async function call(body: unknown, headers: Record<string, string> = {}) {
  const { POST } = await import("@/app/api/revalidate/route");
  return POST(
    new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    process.env.REVALIDATE_SECRET = SECRET;
  });

  it("ohne eingerichtetes Geheimnis: 503", async () => {
    delete process.env.REVALIDATE_SECRET;
    expect((await call({ keys: ["a"] }, { "x-revalidate-secret": SECRET })).status).toBe(503);
    process.env.REVALIDATE_SECRET = "zu-kurz";
    expect((await call({ keys: ["a"] }, { "x-revalidate-secret": "zu-kurz" })).status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("falsches oder fehlendes Geheimnis: 403, nichts wird geleert", async () => {
    expect((await call({ keys: ["a"] }, { "x-revalidate-secret": "falsch" })).status).toBe(403);
    expect((await call({ keys: ["a"] })).status).toBe(403);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("ungültige Anfragen: 400", async () => {
    const h = { "x-revalidate-secret": SECRET };
    for (const body of ["kein json", {}, { keys: [] }, { keys: ["A B"] }, { keys: ["../x"] }, { keys: Array(21).fill("a") }, { keys: [1] }]) {
      expect((await call(body, h)).status, JSON.stringify(body)).toBe(400);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("gültiger Aufruf leert jede Adresse sofort (expire 0)", async () => {
    const res = await call({ keys: ["weber-modern", "www.kunde.de"] }, { "x-revalidate-secret": SECRET });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revalidated: 2 });
    expect(revalidateTag).toHaveBeenCalledWith("site:weber-modern", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("site:www.kunde.de", { expire: 0 });
  });
});
