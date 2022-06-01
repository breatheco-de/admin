import {
  Avatar,
  Button,
  Icon,
  IconButton,
  Tooltip,
  Card,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import { MatxLoading } from "matx";
import bc from 'app/services/breathecode';
import dayjs from 'dayjs';
import { Breadcrumb } from 'matx';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  INVITED: 'bg-secondary text-dark',
  ACTIVE: 'text-white bg-green',
  INNACTIVE: 'text-white bg-error',
};

const InvoiceDetail = () => {
  const { mentorID, invoiceID } = useParams();
  const history = useHistory();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(async ()=>{
    setLoading(true);
    const { data } = await bc.mentorship().getSingleAcademyMentorshipBill(invoiceID);
    if(data) setBill(data);
    setLoading(false);
  },[]);

  // const columns = [
  //   {
  //     name: 'first_name', // field name in the row object
  //     label: 'Name', // column title that will be shown in table
  //     options: {
  //       filter: true,
  //       customBodyRenderLite: (dataIndex) => {
  //         const mentor = mentorList[dataIndex];
  //         return (
  //           <div className="flex items-center">
  //             <Avatar className="w-48 h-48" src={mentor.user?.profile?.avatar_url} />
  //             <div className="ml-3">
  //               <h5 className="my-0 text-15">{name(mentor.user)}</h5>
  //               <small className="text-muted">{mentor?.service.name}</small>
  //             </div>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   {
  //     name: 'status',
  //     label: 'Status',
  //     options: {
  //       filter: true,
  //       customBodyRenderLite: (dataIndex) => {
  //         const item = mentorList[dataIndex];
  //         return (
  //           <div className="flex items-center">
  //             <div className="ml-3">
  //               <small className={`border-radius-4 px-2 pt-2px ${statusColors[item.status]}`}>
  //                 {item.status.toUpperCase()}
  //               </small>
  //               {item.status === 'INVITED' && (
  //                 <small className="text-muted d-block">Needs to accept invite</small>
  //               )}
  //             </div>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   {
  //     name: 'booking_url',
  //     label: 'Book & Meet links',
  //     options: {
  //       filter: true,
  //       customHeadRender: ({ index, ...column }) => {
  //         return (
  //           <TableCell key={index} style={{ width: "300px" }}>
  //             {column.label}
  //           </TableCell>
  //         )
  //       },
  //       customBodyRenderLite: (dataIndex) => {
  //         const _mentor = mentorList[dataIndex];
  //         const book = `https://s.4geeks.com/mentor/${_mentor.slug}`
  //         const meet = `https://s.4geeks.com/mentor/meet/${_mentor.slug}`
  //         return (
  //           <>
  //             <Tooltip title={book}>
  //               <small
  //                 className='underline pointer'
  //                 onClick={() => {
  //                   navigator.clipboard.writeText(book);
  //                   toast.success('Copied to the clipboard', toastOption);
  //                 }}
  //               >
  //                 Book: {book.substring(0, 40)}
  //                 {book.length > 40 && "..."}
  //               </small>
  //             </Tooltip>
  //             <br></br>
  //             <Tooltip title={meet}>
  //               <small
  //                 className='underline pointer'
  //                 onClick={() => {
  //                   navigator.clipboard.writeText(meet);
  //                   toast.success('Copied to the clipboard', toastOption);
  //                 }}
  //               >
  //                 Meet: {meet.substring(0, 40)}
  //                 {meet.length > 40 && "..."}
  //               </small>
  //             </Tooltip>
  //           </>
  //         )
  //       }
  //     },
  //   },
  //   {
  //     name: 'action',
  //     label: ' ',
  //     options: {
  //       filter: false,
  //       customHeadRender: ({ index, ...column }) => {
  //         return (
  //           <TableCell key={index} style={{ width: "100px" }}>
  //             {column.label}
  //           </TableCell>
  //         )
  //       },
  //       customBodyRenderLite: (dataIndex) => {
  //         const item = mentorList[dataIndex];
  //         //! TODO REVERT THIS BEFORE PUSHING
  //         return (
  //           <div className="flex items-center">
  //             <div className="flex-grow" />
  //             <Link to={`/mentors/${item.id}`}>
  //               <Tooltip title="Edit">
  //                 <IconButton>
  //                   <Icon>edit</Icon>
  //                 </IconButton>
  //               </Tooltip>
  //             </Link>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  // ];

  if(loading) return <MatxLoading />

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb routeSegments={[{ name: 'Mentorship', path: '/mentors' }, { name: 'Mentor' }]} />
          </div>
        </div>
      </div>
      <Card>
        <div className="p-5">
          <div className="flex justify-between mb-4">
            <IconButton>
              <ArrowBack
                onClick={() => {
                  history.goBack();
                }}
              />
            </IconButton>
            <Button variant="contained" color="primary">
              Print Invoice
            </Button>
          </div>
          <div className="flex justify-between">
            <div className="" id="order-info">
              <h5 className="mb-2" >Order Info</h5>
              <p>Order Number</p>
              <p>{`#${bill?.id}`}</p>
            </div>
            <div className="" id="order-status">
              <h5 className="font-normal mb-4 capitalize" ><strong>Order Status: </strong>{bill?.status}</h5>
              <h5 className="font-normal mb-4 capitalize" ><strong>Order Date: </strong>{dayjs(bill?.created_at).format('MMMM D, YYYY')}</h5>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex justify-between p-5" id="bill-detail">
          <div id="bill-from">
            <h5 className="mb-2" >Bill From</h5>
            <p>UI LIB</p>
            <p className="m-0" >sales@ui-lib.com</p>
            <p className="m-0" >8254 S. Garfield Street. Villa Rica,</p>
            <p className="m-0" >GA 30180.</p>
          </div>
          <div id="bill-to">
            <h5 className="mb-2" >Bill To</h5>
            <p>Hane PLC</p>
            <p className="m-0" >sales@ui-lib.com</p>
            <p className="m-0" >8254 S. Garfield Street. Villa Rica,</p>
            <p className="m-0" >GA 30180.</p>
          </div>
        </div>
				<div id="table" className='p-4'>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell className="px-0">Item</TableCell>
								<TableCell className="px-0">Notes</TableCell>
								<TableCell className="px-0">Billed</TableCell>
                {/* <TableCell className="px-0">Unit Price</TableCell> */}
								{/* <TableCell className="px-0">Unit</TableCell> */}
								{/* <TableCell className="px-0">Cost</TableCell> */}
							</TableRow>
						</TableHead>
						<TableBody>
              {bill?.sessions.map(session => {
                console.log(session.started_at);
                return(
                <TableRow>
                  <TableCell className="pl-0 capitalize" align="left">
                    {`${dayjs(session?.started_at).format('MMMM D, YYYY, h:mm a')} with ${session.mentee.first_name} ${session.mentee.last_name}`}
                  </TableCell>
                  <TableCell className="pl-0">4000</TableCell>
                  <TableCell className="pl-0">4</TableCell>
                </TableRow>
              )})}
							
						</TableBody>
					</Table>
				</div>
      </Card>
    </div>
  );
};

export default InvoiceDetail;