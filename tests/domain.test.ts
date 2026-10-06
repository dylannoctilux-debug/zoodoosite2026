import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calendarDays,
  slotTimes,
  zooInstant,
  validateVisit,
  bookingFields,
} from "../shared/booking";
import {
  positivePage,
  richText,
  imageUrl,
  richDocument,
} from "../src/lib/content";
const policy = {
  leadHours: 18,
  durationMinutes: 90,
  firstHour: 9,
  lastHour: 16,
};
test("Calendar contains each day exactly once, including Sunday starts, leap years and year transitions", () => {
  for (const [month, count] of [
    ["2026-11", 30],
    ["2026-08", 31],
    ["2024-02", 29],
    ["2026-12", 31],
    ["2027-01", 31],
  ] as const) {
    const dates = calendarDays(month).filter((d) => d.startsWith(month));
    assert.equal(dates.length, count);
    assert.equal(new Set(dates).size, count);
    assert.ok(dates.includes(`${month}-${count}`));
    assert.ok(dates.includes(`${month}-01`));
  }
});
test("Vietnam slot remains the same instant when device timezone changes", () => {
  const previous = process.env.TZ;
  try {
    for (const tz of [
      "Asia/Ho_Chi_Minh",
      "America/New_York",
      "Europe/London",
    ]) {
      process.env.TZ = tz;
      assert.equal(
        zooInstant("2026-11-01", "09:00").toISOString(),
        "2026-11-01T02:00:00.000Z",
      );
    }
  } finally {
    if (previous) process.env.TZ = previous;
    else delete process.env.TZ;
  }
});
test("Lead time is not rounded down and slots remain on the chosen date", () => {
  const now = new Date("2026-10-05T08:30:00Z");
  const slots = slotTimes("2026-10-06", policy, now);
  assert.equal(slots[0].start, "10:00");
  assert.equal(slotTimes("2026-10-05", policy, now).length, 0);
  assert.throws(() => slotTimes("2026-02-30", policy, now));
});
test("Server rejects negative people, invalid email and invalid visit range", () => {
  const start = zooInstant("2026-10-10", "09:00");
  assert.throws(() =>
    bookingFields.parse({
      name: "A",
      email: "wrong",
      phone: "0900000000",
      adults: -1,
      kids: 0,
      start_time: start,
      end_time: start,
    }),
  );
  assert.throws(() =>
    validateVisit(
      start,
      new Date(+start - 60000),
      policy,
      new Date("2026-10-01"),
    ),
  );
  assert.throws(() =>
    validateVisit(
      new Date(+start + 60000),
      new Date(+start + 91 * 60000),
      policy,
      new Date("2026-10-01"),
    ),
  );
});
test("Empty CMS content and invalid pagination values are safe", () => {
  for (const value of [
    undefined,
    "0",
    "-1",
    "1.2",
    "garbage",
    "9999999999999999999",
  ])
    assert.equal(positivePage(value), 1);
  assert.equal(positivePage("3"), 3);
  assert.deepEqual(
    richDocument({
      nodeType: "document",
      data: {},
      content: [{ nodeType: "paragraph" }],
    }).content,
    [],
  );
  assert.deepEqual(richDocument(undefined).content, []);
  assert.equal(richText({ content: [] }), "");
  assert.equal(richText(undefined), "");
  assert.equal(
    richText({ content: [{ content: [{ value: "Nội dung" }] }] }),
    "Nội dung",
  );
  assert.equal(
    imageUrl("//images.ctfassets.net/a"),
    "https://images.ctfassets.net/a",
  );
});
