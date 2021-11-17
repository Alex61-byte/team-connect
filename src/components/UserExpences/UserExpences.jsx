import React from 'react'
import './UserExpences.css'
import { CSVLink } from "react-csv";

export default function UserExpences({data,total,user,month,close}) {
   



    return (
        
        <div className="container-fluid table-container">
            <button onClick={close} className="close">X</button>
            <table className="table table-striped">
                <thead>
                    <tr className="table-dark">
                        <th>Date</th>
                        <th>Document Nr</th>
                        <th>Docoment Issuer</th>
                        <th>Project</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="table-info">
                        <td>{month}</td>
                        <td>{user}</td>
                        <td>{""}</td>

                        
                    </tr>

                    {data.map((data) => {
                        return <tr key={data.id} className="table-secondary">
                            <td>{data.date}</td>
                            <td>{data.docNr}</td>
                            <td>{data.issuer}</td>
                            <td>{data.project}</td>
                            <td>{data.value}</td>
                        </tr>
                    })}
                </tbody>
                <tfoot>
                    <tr className="table-secondary">
                        <td>Total Expences</td>

                        <td className="sum bg-secondary">{total}</td>
                    </tr>
                </tfoot>

            </table>
            
        </div>
    )
}
