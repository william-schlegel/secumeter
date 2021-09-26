import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SecumeterData } from "../lib/secumeter";
import { Listbox } from "@headlessui/react";

const secumeter = new SecumeterData();

export default function Home() {
  const [fichier, setFichier] = useState({ url: "" });
  const [dates, setDates] = useState([]);
  const [ids, setIds] = useState([]);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFichier(Object.assign(file, { url }));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
    multiple: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(fichier.url);
      if (data.ok) {
        const text = await data.text();
        const lines = text.split("\r\n");
        secumeter.clear();
        for (const l of lines) {
          if (l) secumeter.addData(l);
        }
        setDates(Array.from(secumeter.dates));
      }
    };
    if (fichier.url) fetchData();
  }, [fichier]);

  function handleChangeDate() {
    setIds(secumeter.selectedIds);
  }

  return (
    <div className="p-5">
      <Head>
        <title>Secumeter data analysis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="block mb-5 border-b border-gray-500 pb-5">
        <div className="flex items-center">
          <Image src="/stimshop.png" width={382} height={60} />
          <h1 className="text-5xl font-bold ml-12 text-gray-500">
            Secumeter data analysis
          </h1>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="border border-gray-400 rounded-md mb-auto">
          <h2 className="block text-xl p-3">Import your file here</h2>
          <div
            {...getRootProps({
              className:
                "flex items-center p-10 m-2 border-2 border-dashed border-gray-300 rounded-md",
            })}
          >
            import csv file
            <input {...getInputProps()} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ListDate dates={dates} handleChangeDate={handleChangeDate} />
          {ids.length ? (
            <div className="border border-gray-400 rounded-md p-4">
              <table className="table-auto">
                <thead>
                  <th>\</th>
                  {ids.map((id) => (
                    <th
                      key={`H-${id[0]}`}
                      className="border border-gray-400 p-2"
                    >
                      {id[0]}
                    </th>
                  ))}
                </thead>
                <tbody>
                  {ids.map((id) => (
                    <tr key={`R-${id[0]}`}>
                      <td className="border border-gray-400 font-bold p-2">
                        {id[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ListDate({ dates, handleChangeDate }) {
  const [selectedDate, setSelectedDate] = useState([]);

  useEffect(() => {
    if (Array.isArray(dates) && dates.length) setSelectedDate(dates[0]);
  }, [dates]);

  useEffect(() => {
    secumeter.selectDate(selectedDate[1]);
    handleChangeDate();
  }, [selectedDate]);

  if (!dates.length) return null;

  return (
    <div className="border border-gray-400 rounded-md p-4 mr-auto flex items-center">
      <h2 className="text-xl p-3 mr-4">Select the date</h2>
      <div className="relative">
        <Listbox value={selectedDate} onChange={setSelectedDate}>
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left border border-gray-400 rounded-md">
            <span>{selectedDate[0]}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Listbox.Options className="p-2 absolute left-0 top-12 w-40 h-auto bg-white border border-gray-400 rounded-md">
            {dates.map((dt) => {
              return (
                <Listbox.Option
                  key={dt[0]}
                  value={dt}
                  className="cursor-pointer bg-white hover:bg-gray-300"
                >
                  {dt[0]}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
}
