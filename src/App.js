import React, { useEffect, useState } from 'react';
import data from './table.json';
import './style.css'

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
            <button onClick={updateData}>Отправить</button>
        </div>
    )
}

function updateData() {

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
                <td>{row.index}</td>
                {row.indicatorList.map(indicator => {
                    return (<td>
                        {indicator.indicatorsClassifier == null ? (
                            ""
                        ) : (
                            <input type="text" key={indicator.id} placeholder={"Начните вводить"} value={indicator.value} onChange={value =>
                                console.log(indicator.id, " - ", value.target.value)
                            }/>
                        )}
                    </td>)
                })}
            </tr>
        ))}
        </tbody>
    )
}


export default App;