import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  Icon,
  Divider,
  Card,
} from "@material-ui/core";
import { SmartMUIDataTable } from "../../../components/SmartDataTable";
import SingleDelete from '../../../components/ToolBar/SingleDelete';
import bc from "../../../services/breathecode";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

export const Organizers = ({ className }) => {
  const [items, setItems] = useState([]);
  const [toDelete, setToDelete] = useState(null);

  const disconectOrg = (organizer) => {

    const pos = items.map((e) => { return e.id; }).indexOf(organizer.id);

    let itemsCopy = [...items]

    itemsCopy.splice(pos,1);
    setItems([...itemsCopy]);

    return bc.events()
              .deleteAcademyEventOrganizationOrganizer(organizer.id);
  }

  const columns = [
    {
      name: 'id', // field name in the row object
      label: '#', // column title that will be shown in table
      options: {
        filter: true,
      },
    },
    {
      name: 'organizer', // field name in the row object
      label: 'Organizer', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].organization.name,
      },
    },
    {
      name: 'name', // field name in the row object
      label: 'Academy', // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].name,
      },
    },
    {
      name: 'created_at',
      label: 'Created',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          const item = items[i];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.updated_at ? dayjs(item.created_at).fromNow(true) : '-'}
                </h5>
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
        customBodyRenderLite: (i) => {
          const organization = items[i];
          // if (['IGNORE', 'DONE'].includes(_review.status)) return _review.status;
          return (
            <>
              <div className="flex items-center">
                <div className="flex-grow" />
                <span>
                  <IconButton
                    onClick={() => {
                      setToDelete(organization);
                      // setOpenDialog(true);
                    }}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </span>
              </div>
            </>
          );
        },
      },
    },
  ]
  return (
    <Card container className={`p-4 ${className}`}>
      <Divider className="mb-2 flex" />
      <Grid item md={12}>
        The following organizers/academies are using your organization API
        credentials to publish and async events, you can click on the trash can
        icon on the ones you want to disconect
      </Grid>
      <Grid item md={12} className="mt-2">
        <SmartMUIDataTable
          title="Organization Organizers"
          columns={columns}
          items={items}
          tableOptions={{
            selectableRows: false,
          }}
          search={async (querys) => {
            const { data } = await bc
              .events()
              .getAcademyEventOrganizationOrganizer(querys);

            setItems(data);
            return data;
          }}
        />
        {toDelete && (
          <SingleDelete
            deleting={() => {
              disconectOrg(toDelete);
            }}
            onClose={setToDelete}
            message="Are you sure you want to disconnect this organizer"
          />
        )}
      </Grid>
    </Card>
  );
};

Organizers.propTypes = {
  className: PropTypes.string,
};

Organizers.defaultProps = {
  className: "",
};
