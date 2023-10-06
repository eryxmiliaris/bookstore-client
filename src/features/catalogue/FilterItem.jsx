import queryString from "query-string";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function FilterItem({ data, title, paramName }) {
  const [dataCheckedState, setDataCheckedState] = useState(
    Array(data.length).fill(false),
  );
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    function () {
      const stringParams = searchParams.toString();
      const params = queryString.parse(stringParams);

      let paramData = params[paramName];
      if (!Array.isArray(paramData)) {
        if (!paramData === undefined) {
          paramData = new Array();
        } else {
          paramData = new Array(paramData);
        }
      }
      setDataCheckedState(
        data.map((data) => {
          if (paramData.includes(data)) return true;
          return false;
        }),
      );
    },
    [data, paramName, searchParams],
  );

  const handleOnChange = function (type, position) {
    const stringParams = searchParams.toString();
    const params = queryString.parse(stringParams);
    let paramData = queryString.parse(stringParams)[paramName];
    if (!Array.isArray(paramData)) {
      if (!paramData === undefined) {
        paramData = new Array();
      } else {
        paramData = new Array(paramData);
      }
    }
    if (paramData.includes(type)) {
      paramData = paramData.filter((e) => e !== type);
    } else {
      paramData.push(type);
    }

    const updatedParams = { ...params, [paramName]: paramData };
    setSearchParams(queryString.stringify(updatedParams));

    const updatedCheckedState = dataCheckedState.map((item, index) =>
      index === position ? !item : item,
    );
    setDataCheckedState(updatedCheckedState);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-lg">
      <p className="mb-2 text-xl font-semibold">{title}</p>
      <ul>
        {data.map((el, index) => (
          <li key={index} className="mb-2">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                name={el}
                value={el}
                checked={dataCheckedState[index]}
                onChange={() => handleOnChange(el, index)}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span>{el}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilterItem;
