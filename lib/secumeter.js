export class SecumeterData {
  constructor() {
    this.interactions = [];
    this.dates = new Map();
    this.selectedDate = "";
    this.selectedIds = [];
  }

  clear() {
    this.interactions = [];
    this.dates.clear();
    this.selectedDate = "";
    this.selectedIds = [];
  }

  selectDate(dt) {
    const ids = new Map();
    this.interactions.forEach((i) => {
      if (i.dt.toISOString() == dt.toISOString()) {
        console.log(`i`, i);
        if (i.from > -1) ids.set(i.from, i);
        if (i.to > -1) ids.set(i.to, i);
      }
    });

    this.selectedIds = Array.from(ids);
    console.log(`this.selectedIds`, this.selectedIds);
  }

  addData(data) {
    if (!typeof data == "string")
      throw new Error("Data must be type of string");
    const items = data.split(",");
    if (items.length < 4) throw new Error(`data format incorrect\n${data}`);
    const sdt = items[0].split("-");
    if (sdt.length !== 3) throw new Error(`date format incorrect ${items[0]}`);
    const dt = new Date(
      2000 + parseInt(sdt[0]),
      parseInt(sdt[1]),
      parseInt(sdt[2]),
      0,
      0,
      0,
      0
    );
    this.dates.set(items[0], dt);
    const shr = items[1].split(":");
    if (shr.length !== 2) throw new Error(`date format incorrect ${items[0]}`);
    const hr = new Date(0, 0, 0, parseInt(shr[0]), parseInt(shr[1]), 0, 0);
    const s1 = parseInt(items[2]);
    const s2 = parseInt(items[3]);
    if (s1 !== -1) this.interactions.push({ from: s1, to: s2, dt, hr });
    if (s2 !== -1) this.interactions.push({ from: s2, to: s1, dt, hr });
  }
}
