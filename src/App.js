import React, { useEffect, useState } from 'react';
import data from './table.json';
import './style.css'

let result = new Map();

function App() {
    const [tableData, setData] = useState({partitionList: []});
    useEffect(() => {
        setData(data);
    }, []);

    return (
        <div>
            {tableData.partitionList.map(partition => (
                <table>
                    {createHeader(partition)}
                    {createBody(partition)}
                </table>
            ))}
            <button onClick={sendData}>Отправить</button>
        </div>
    )
}

function createHeader(partitionList) {
    const details = partitionList.detailsSet;
    let neoHeaderList = [];
    details.forEach((item) => {
        neoHeaderList.push(item.neoHeaderList);
    });
    neoHeaderList = neoHeaderList.flat();
    const maxHeaderRow = neoHeaderList.reduce((max, item) => {
        return item.headerRow > max ? item.headerRow : max;
    }, 0);
    const iterator = Array.from({ length: maxHeaderRow + 1 }, (_, i) => i);

    return (
        <thead>
        {iterator.map(i => (
            <tr key={i}>
                {neoHeaderList.map(header => {
                    if (header.headerRow === i) {
                        return <th colSpan={header.colSpan} rowSpan={header.rowSpan}>{header.value}</th>;
                    }
                    return null;
                })}
            </tr>
        ))}
        </thead>
    );
}

function createBody(partitionList) {
    const details = partitionList.detailsSet;
    let rowList = []
    details.forEach((item) => {
        rowList.push(item.rowList)
    })
    rowList = rowList.flat()
    return (
        <tbody>
            {rowList.map(row => (
                <tr>
                    <td>{row.name}</td>
                    <td>{row.rowNumber}</td>
                    {row.indicatorList.map(indicator => {
                        return (<td>
                            {indicator.indicatorsClassifier == null ? (
                                ""
                            ) : (
                                <input type="text" key={indicator.id} placeholder={"Начните вводить"}
                                       value={indicator.value} onChange={e => {
                                        result.set(indicator.id, e.target.value)
                                }
                                }
                                />
                            )}
                        </td>)
                    })}
                </tr>
            ))}
        </tbody>
    )
}

const sendData = async () => {
    const resultArray = Array.from(result.entries());

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(resultArray))
        })
        if (response.ok) {
            console.log('OK');
        } else {
            console.error('Failed to send data');
        }
    } catch (error) {
        console.error(error);
    }
}

export default App;