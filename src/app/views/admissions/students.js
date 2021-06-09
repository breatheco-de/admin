import React, { useState } from "react";
import { Breadcrumb } from "matx";
import { MatxLoading } from "matx";
import { Avatar, Icon, IconButton, Button, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import bc from "../../services/breathecode";
import { toast } from "react-toastify";
import { SmartMUIDataTable } from "app/components/SmartDataTable";

let relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const statusColors = {
  INVITED: "text-white bg-error",
  ACTIVE: "text-white bg-green",
};

const name = (user) => {
  if (user && user.first_name && user.first_name != "")
    return user.first_name + " " + user.last_name;
  else return "No name";
};

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const Students = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resendInvite = (user) => {
    bc.auth()
      .resendInvite(user)
      .then(({ data }) => console.log(data))
      .catch((error) => console.log(error));
  };
  const getMemberInvite = (user) => {
    bc.auth().getMemberInvite(user)
      .then((res) => {
        console.log(res.data.invite_url);
        if (res.data) {
          navigator.clipboard.writeText(res.data.invite_url);
          toast.success("Invite url copied successfuly", toastOption);
        }
      })
      .catch((error) => error);
  };

  const columns = [
    {
      name: "first_name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let { user, ...rest } = items[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.github?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{user !== null ? name(user) : rest.first_name + " " + rest.last_name}</h5>
                <small className="text-muted">{user?.email || rest.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className='flex items-center'>
            <div className='ml-3'>
              <h5 className='my-0 text-15'>
                {dayjs(items[i].created_at).format("MM-DD-YYYY")}
              </h5>
              <small className='text-muted'>
                {dayjs(items[i].created_at).fromNow()}
              </small>
            </div>
          </div>
        ),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let item = items[dataIndex];
          return (
            <div className='flex items-center'>
              <div className='ml-3'>
                <small
                  className={
                    "border-radius-4 px-2 pt-2px" + statusColors[item.status]
                  }
                >
                  {item.status.toUpperCase()}
                </small>
                {item.status == "INVITED" && (
                  <small className='text-muted d-block'>
                    Needs to accept invite
                  </small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          let item =
            items[dataIndex].user !== null
              ? items[dataIndex]
              : {
                  ...items[dataIndex],
                  user: { first_name: "", last_name: "", imgUrl: "", id: "" },
                };
          return item.status === "INVITED" ? (
            <div className='flex items-center'>
              <div className='flex-grow'></div>
              <Tooltip title='Copy invite link'>
                <IconButton onClick={() => getMemberInvite(item.id)}>
                  <Icon>assignment</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title='Resend Invite'>
                <IconButton onClick={() => resendInvite(item.id)}>
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <div className='flex items-center'>
              <div className='flex-grow'></div>
              <Link
                to={`/admissions/students/${
                  item.user !== null ? item.user.id : ""
                }`}
              >
                <Tooltip title='Edit'>
                  <IconButton>
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
              </Link>
            </div>
          );
        },
      },
    },
  ];

  return (
    <div className='m-sm-30'>
      <div className='mb-sm-30'>
        <div className='flex flex-wrap justify-between mb-6'>
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Admissions", path: "/" },
                { name: "Students" },
              ]}
            />
          </div>

          <div className=''>
            <Link to={`/admissions/students/new`}>
              <Button variant='contained' color='primary'>
                Add new student
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className='overflow-auto'>
        <div className='min-w-750'>
          {isLoading && <MatxLoading />}
          <SmartMUIDataTable
            title='All Students'
            columns={columns}
            data={items}
            search={async (querys) => {
              const { data } = await bc.auth().getAcademyStudents(querys);
              setItems(data.results);
              return data;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Students;
