export default function Table({ ids, threshold, myRef, visu }) {
  function getValue(id, i) {
    if (!id) return "-";
    const v = ids.find((item) => item.k1 === id);
    const v2 = v.k2.find((item) => item.k === ids[i].k1);
    if (v2) return v2.value;
    return "-";
  }

  if (visu === "step")
    return (
      <table ref={myRef} className="table-auto">
        <thead>
          <tr>
            <th>&nbsp;</th>
            {ids.map((id) => (
              <th
                key={`H-${id.k1}`}
                className="border border-gray-400 p-2 w-12 text-center"
              >
                {id.k1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ids.map((id, index) => (
            <tr key={`R-${id.k1}`}>
              <td className="border border-gray-400 font-bold p-2 w-12 text-center">
                {id.k1}
              </td>
              {new Array(index + 1).fill(1).map((a, i) => (
                <td key={`BLK-${i}`} className="bg-gray-200">
                  &nbsp;
                </td>
              ))}
              {new Array(ids.length - index - 1).fill(1).map((a, i) => {
                const v = getValue(id.k1, index + 1 + i);
                let bg = "";
                if (!isNaN(v)) bg = "bg-green-300";
                if (v >= threshold) bg = "bg-red-300";
                return (
                  <td
                    key={`V-${i}`}
                    className={`border border-gray-400 p-2 text-center ${bg}`}
                  >
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  if (visu === "table") {
    return (
      <div ref={myRef} className="flex gap-2 flex-wrap">
        {ids.map((id) => (
          <table className="table-auto mb-auto">
            <thead className="border border-gray-300">
              <tr>
                <th colSpan={2}>{id.k1}</th>
              </tr>
            </thead>
            <tbody>
              {id.k2.map((k2) => (
                <tr key={`${id.k1}-${k2.k}`}>
                  <td className="border border-gray-300 w-16 text-center font-bold p-2">
                    {k2.k}
                  </td>
                  <td
                    className={`border border-gray-300 w-16 text-right p-2 ${
                      k2.value > threshold ? "bg-red-300" : "bg-green-300"
                    }`}
                  >
                    {k2.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    );
  }
  return <div>Error</div>;
}
