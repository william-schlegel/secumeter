function formatDate(dt) {
  const y = dt.getFullYear() - 2000;
  const m = dt.getMonth();
  const d = dt.getDate();
  const s = `${y}-${m < 10 ? 0 : ""}${m}-${d < 10 ? "0" : ""}${d}`;
  return s;
}

const THRESHOLD = 20;
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

    function addSec(id, value, from) {
      if (id === -1) return;
      const l = ids.get(id) || new Map();
      const target = from ? value.to : value.from;
      const inter = l.get(target) || [];
      inter.push({
        dt: value.dt,
        hr: value.hr,
      });
      l.set(target, inter);
      ids.set(id, l);
    }

    this.interactions.forEach((i) => {
      if (i.dt == formatDate(dt)) {
        addSec(i.from, i, true);
        addSec(i.to, i, false);
      }
    });
    if (ids.size === 0) return;
    const inter = [];
    const minus1 = [];
    for (const id of ids.entries()) {
      const k1 = id[0];
      for (const v of id[1].entries()) {
        const k2 = v[0];
        const hrs = Array.from(v[1]).sort((a, b) => a.hr - b.hr);
        if (k2 === -1) {
          minus1.push({ k1, k2, hrs });
        } else {
          const item = inter.find((i) => i.k1 === k1);
          if (item) {
            item.k2.push({ k: k2, hrs, value: 1 });
          } else {
            inter.push({ k1, k2: [{ k: k2, hrs, value: 1 }] });
          }
        }
      }
    }
    console.log(`minus1`, minus1);
    // 1- incorporer les -1
    // 2- calculer les durées cumulées
    // Pour chaque k1 d'inter et chaque k2, checker les hrs
    for (const k1 of inter) {
      for (const k2 of k1.k2) {
        let v = 1;
        for (let h = 1; h < k2.hrs.length; h += 1) {
          const diff = k2.hrs[h].hr - k2.hrs[h - 1].hr;
          if (diff < THRESHOLD) {
            v += diff;
          } else {
            console.log(`diff`, diff);
          }
        }
        k2.value = v;
      }
    }
    console.log(`inter`, inter);
    this.selectedIds = inter.sort((a, b) => a.k1 - b.k1);
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
    const sHr = items[1].split(":");
    const hr = parseInt(sHr[0]) * 60 + parseInt(sHr[1]);
    const s1 = parseInt(items[2]);
    const s2 = parseInt(items[3]);
    if (s1 !== -1)
      this.interactions.push({ from: s1, to: s2, dt: items[0], hr });
    if (s2 !== -1)
      this.interactions.push({ from: s2, to: s1, dt: items[0], hr });
  }
}
