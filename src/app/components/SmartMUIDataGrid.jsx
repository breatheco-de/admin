import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";


export default function DataTable({ rows, columns, ...props }) {
    // const hash = useHash();
    // const [hash, setHash] = useState({
    // limit: hash.get('limit') || 10,
    // offset: hash.get('offset') || 0,
    // });

    return (
        <div style={{ height: 800, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={12}
                rowsPerPageOptions={[12]}
                checkboxSelection
                onSelectionModelChange={(newSelectionModel) => {
                    if(props.setSelected) props.setSelected(newSelectionModel)
                    console.log(newSelectionModel);
                }}
            />
        </div>
    );
}
