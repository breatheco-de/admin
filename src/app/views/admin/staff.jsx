import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import {
  Avatar, Grow, Icon, IconButton, TextField, Button, Tooltip,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from '../../services/breathecode';
import InviteDetails from '../../components/InviteDetails';
import { Breadcrumb, MatxLoading } from '../../../matx';
import { useQuery } from '../../hooks/useQuery';
import { DownloadCsv } from '../../components/DownloadCsv';
import CustomToolbar from '../../components/CustomToolbar';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'text-white bg-error',
  ACTIVE: 'text-white bg-green',
};
const roleColors = {
  admin: 'text-black bg-gray',
};

const name = (user) => {
  if (user && user.first_name && user.first_name !== '') return `${user.first_name} ${user.last_name}`;
  return 'No name';
};

const Staff = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [table, setTable] = useState({
    count: 100,
    page: 0,
  });
  const query = useQuery();
  const history = useHistory();
  const [_roles, setRoles] = useState(null);
  const [queryLimit, setQueryLimit] = useState(query.get('limit') || 10);
  const [queryOffset, setQueryOffset] = useState(query.get('offset') || 0);

  const getAcademyMembers = () => {
    bc.auth()
      .getRoles()
      .then((res) => {
        if (res.status === 200) {
          const r = res.data
            .filter((response) => response.slug !== 'student')
            .map((resData) => resData.slug);
          setRole(r);
          setRoles(r.join(','));
          bc.auth()
            .getAcademyMembers({
              roles: r.join(','),
              limit: query.get('limit') !== null ? query.get('limit') : 10,
              offset: query.get('offset') !== null ? query.get('offset') : 0,
            })
            .then(({ data }) => {
              console.log(data);
              setIsLoading(false);
              if (isAlive) {
                const filterUserNull = data.results.filter((item) => item.user !== null);
                setUserList(filterUserNull);
                setTable({ count: data.count });
              }
            })
            .catch(() => {
              setIsLoading(false);
            });
        }
      })
      .catch((error) => console.log(error));
  };

  const handleLoadingData = () => {
    setIsLoading(true);
    getAcademyMembers();
    return () => setIsAlive(false);
  };

  const handlePageChange = (page, rowsPerPage) => {
    setIsLoading(true);
    setQueryLimit(rowsPerPage);
    setQueryOffset(rowsPerPage * page);
    console.log('page: ', rowsPerPage);
    bc.auth()
      .getAcademyMembers({
        roles: role.join(','),
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      })
      .then(({ data }) => {
        setIsLoading(false);
        const filterUserNull = data.results.filter((item) => item.user !== null);
        setUserList(filterUserNull);
        setTable({ count: data.count, page });
        history.replace(`/admin/staff?limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const resendInvite = (user) => {
    bc.auth()
      .resendInvite(user)
      .then(({ data }) => console.log(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setIsLoading(true);
    getAcademyMembers();
    return () => setIsAlive(false);
  }, [isAlive]);

  const columns = [
    {
      name: 'first_name', // field name in the row object
      label: 'Name', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const { user } = userList[dataIndex];
          return (
            <div className="flex items-center">
              <Avatar className="w-48 h-48" src={user?.github?.avatar_url} />
              <div className="ml-3">
                <h5 className="my-0 text-15">{name(user)}</h5>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'created_at',
      label: 'Created At',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <div className="flex items-center">
            <div className="ml-3">
              <h5 className="my-0 text-15">{dayjs(userList[i].created_at).format('MM-DD-YYYY')}</h5>
              <small className="text-muted">{dayjs(userList[i].created_at).fromNow()}</small>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'role',
      label: 'Role',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = userList[dataIndex];
          return (
            <small
              className={`border-radius-4 px-2 pt-2px ${roleColors[item.role.slug] || 'bg-light'}`}
            >
              {item.role.name.toUpperCase()}
            </small>
          );
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const item = userList[dataIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <small className={`border-radius-4 px-2 pt-2px${statusColors[item.status]}`}>
                  {item.status.toUpperCase()}
                </small>
                {item.status === 'INVITED' && (
                  <small className="text-muted d-block">Needs to accept invite</small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'action',
      label: ' ',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => {
          const item = userList[dataIndex].user !== null
            ? userList[dataIndex]
            : {
              ...userList[dataIndex],
              user: {
                first_name: '',
                last_name: '',
                imgUrl: '',
                id: '',
              },
            };
          return item.status === 'INVITED' ? (
            <div className="flex items-center">
              <div className="flex-grow" />
              <InviteDetails user={item.id} />
              <Tooltip title="Resend Invite">
                <IconButton onClick={() => resendInvite(item.id)}>
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex-grow" />
              <Link to={`/admin/staff/${item.user.id}`}>
                <Tooltip title="Edit">
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
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Admin', path: '/' }, { name: 'Staff' }]} />
          </div>

          <div className="">
            <Link to="/admin/staff/new">
              <Button variant="contained" color="primary">
                Add new staff member
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <MUIDataTable
            title="Staff Members"
            data={userList}
            columns={columns}
            options={{
              customToolbar: () => {
                const singlePageTableCsv = `/v1/auth/academy/member?roles=${_roles}&limit=${queryLimit}&offset=${queryOffset}`;
                const allPagesTableCsv = `/v1/auth/academy/member?roles=${_roles}`;
                return (
                  <DownloadCsv
                    singlePageTableCsv={singlePageTableCsv}
                    allPagesTableCsv={allPagesTableCsv}
                  />
                );
              },
              download: false,
              filterType: 'textField',
              responsive: 'standard',
              serverSide: true,
              elevation: 0,
              count: table.count,
              page: table.page,
              rowsPerPage: parseInt(query.get('limit'), 10) || 10,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                <CustomToolbar
                  selectedRows={selectedRows}
                  displayData={displayData}
                  setSelectedRows={setSelectedRows}
                  items={userList}
                  key={userList}
                  history={history}
                  id="staff"
                  deleting={async (querys) => {
                    const { status } = await bc.admissions().deleteStaffBulk(querys);
                    return status;
                  }}
                  onBulkDelete={handleLoadingData}
                />
              ),
              onTableChange: (action, tableState) => {
                console.log(action, tableState);
                switch (action) {
                  case 'changePage':
                    console.log(tableState.page, tableState.rowsPerPage);
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  case 'changeRowsPerPage':
                    handlePageChange(tableState.page, tableState.rowsPerPage);
                    break;
                  default:
                    console.log(tableState.page, tableState.rowsPerPage);
                }
              },
              customSearchRender: (
                // searchText,
                handleSearch,
                hideSearch,
                // options,
              ) => (
                <Grow appear in timeout={300}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={({ target: { value } }) => handleSearch(value)}
                    InputProps={{
                      style: {
                        paddingRight: 0,
                      },
                      startAdornment: (
                        <Icon className="mr-2" fontSize="small">
                          search
                        </Icon>
                      ),
                      endAdornment: (
                        <IconButton onClick={hideSearch}>
                          <Icon fontSize="small">clear</Icon>
                        </IconButton>
                      ),
                    }}
                  />
                </Grow>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Staff;
