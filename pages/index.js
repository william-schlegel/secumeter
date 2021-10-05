import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactToPrint from "react-to-print";
import { RadioGroup } from "@headlessui/react";

import { SecumeterData } from "../lib/secumeter";
import ListDate from "../components/ListDate";
import Table from "../components/Table";

const secumeter = new SecumeterData();

const VISU = [
  {
    key: "step",
    Svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 transform -rotate-90"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: "table",
    Svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  const [fichier, setFichier] = useState({ url: "" });
  const [dates, setDates] = useState([]);
  const [ids, setIds] = useState([]);
  const [threshold, setThreshold] = useState(15);
  const [visu, setVisu] = useState("step");
  const compRef = useRef();

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
        const lines = text.replace(/\r\n/g, "\n").split("\n");
        secumeter.clear();
        for (const l of lines) {
          if (l) secumeter.addData(l);
        }
        setDates(Array.from(secumeter.dates).sort((a, b) => a[1] - b[1]));
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
        <div className="flex flex-col mb-auto gap-5">
          <div className="border border-gray-400 rounded-md">
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
          <div className="border border-gray-400 rounded-md">
            <h2 className="block text-xl p-3">Settings</h2>
            <div className="flex flex-col gap-4 m-4">
              <label htmlFor="threshold">Highlight threshold</label>
              <input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="border border-gray-400 rounded px-4 py-2 text-right"
              />
              <RadioGroup value={visu} onChange={setVisu}>
                <div className="flex flex-grow gap-2">
                  {VISU.map((v) => (
                    <RadioGroup.Option
                      className={({ active, checked }) =>
                        `p-3 border border-gray-300 rounded w-full flex justify-center ${
                          active ? "ring-2 ring-offset-2 ring-gray-300" : ""
                        } ${checked ? "bg-gray-300" : "bg-white"}`
                      }
                      key={v.key}
                      value={v.key}
                    >
                      {v.Svg}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
          {ids.length ? (
            <ReactToPrint
              trigger={() => (
                <button className="w-full p-4 bg-blue-600 text-white text-center font-bold text-xl block rounded-md hover:bg-blue-400">
                  Print
                </button>
              )}
              content={() => compRef.current}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-4">
          <ListDate
            dates={dates}
            handleChangeDate={handleChangeDate}
            secumeterData={secumeter}
          />
          {ids.length ? (
            <div className="border border-gray-400 rounded-md p-4">
              <h2 className="block text-xl p-3">
                Cumulative contact time (in minutes)
              </h2>
              <Table ids={ids} threshold={threshold} visu={visu} />
            </div>
          ) : null}
        </div>
        <div className="hidden">
          <CompToPrint
            myRef={compRef}
            date={secumeter.selectedDate}
            ids={ids}
            threshold={threshold}
            visu={visu}
          />
        </div>
      </div>
    </div>
  );
}

function CompToPrint({ myRef, ids, date, threshold, visu }) {
  if (!ids.length) return null;
  return (
    <div ref={myRef} className="m-10">
      <p className="mb-4 text-lg text-center pb-2 border-b border-gray-800">
        Secumeter data analysis for the {new Intl.DateTimeFormat().format(date)}
      </p>
      <Table ids={ids} threshold={threshold} visu={visu} />
    </div>
  );
}
