import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

function populatePaymentTable(paymentArr, rows) {
    console.log('Payment arr', paymentArr)
    paymentArr.map((_payment) => {
        let paymentMonth = dayjs(_payment.started_at).format("MMMM");
        let monthIndex = dayjs(_payment.started_at).get("month");
        console.log(rows[monthIndex].id == monthIndex)

        if (rows[monthIndex].id === monthIndex) {
            if (
                _payment.status === "DUE" &&
                paymentMonth === rows[monthIndex].month
            ) {
                rows[monthIndex].amount_due += _payment.total_price;
            }
            if (_payment.status === "APPROVED" &&
                paymentMonth === rows[monthIndex].month) {
                let monthIndex = dayjs(_payment.started_at).get("month");
                if (
                    rows[monthIndex].id === monthIndex &&
                    paymentMonth === rows[monthIndex].month
                ) {
                    rows[monthIndex].amount_due -= _payment.total_price;
                    rows[monthIndex].total_amount_paid += _payment.total_price;
                }
            }
            if (_payment.status === "PAID" &&
                paymentMonth === rows[monthIndex].month) {
                let monthIndex = dayjs(_payment.started_at).get("month");
                if (
                    rows[monthIndex].id === monthIndex &&
                    paymentMonth === rows[monthIndex].month
                ) {
                    rows[monthIndex].amount_due -= _payment.total_price;
                    rows[monthIndex].total_amount_paid += _payment.total_price;
                }
            }
        }
    });
}
export default function DataTable({ data, rows, columns }) {
    populatePaymentTable(data, rows);
    return (
        <div style={{ height: 800, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={12}
                rowsPerPageOptions={[12]}
                checkboxSelection
            />
        </div>
    );
}
