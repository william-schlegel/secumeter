import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function ListDate({ dates, handleChangeDate, secumeterData }) {
  const [selectedDate, setSelectedDate] = useState([]);
  const [idDate, setIdDate] = useState(0);

  useEffect(() => {
    if (Array.isArray(dates) && dates.length) setSelectedDate(dates[0]);
  }, [dates]);

  useEffect(() => {
    secumeterData.selectDate(selectedDate[1]);
    handleChangeDate();
  }, [selectedDate]);

  if (!dates.length) return null;

  function handleChange(value) {
    const id = dates.findIndex((d) => d[0] === value[0]);
    setIdDate(id);
    setSelectedDate(value);
  }

  function datePrec() {
    if (idDate > 0) {
      handleChange(dates[idDate - 1]);
    }
  }

  function dateSuiv() {
    if (idDate < dates.length - 1) {
      handleChange(dates[idDate + 1]);
    }
  }

  return (
    <div className="border border-gray-400 rounded-md p-4 mr-auto flex items-center">
      <h2 className="text-xl p-3 mr-4">Select the date</h2>
      <div className="relative flex gap-1 items-center">
        <button
          className="border border-gray-400 rounded-md p-2 text-gray-500 hover:bg-gray-200"
          onClick={() => datePrec()}
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <Listbox value={selectedDate} onChange={handleChange}>
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left border border-gray-400 rounded-md">
            <span>{new Intl.DateTimeFormat().format(selectedDate[1])}</span>
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
                  {new Intl.DateTimeFormat().format(dt[1])}
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Listbox>
        <button
          className="border border-gray-400 rounded-md p-2 text-gray-500  hover:bg-gray-200"
          onClick={() => dateSuiv()}
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
