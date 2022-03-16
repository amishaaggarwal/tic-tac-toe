import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import { readFireBase } from "utils/firebaseSetup/firebaseFunctions";

import "./UserList.scss";

function UserList() {
  const [activeUsers, setActiveUsers] = useState();

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  //-function to fetch isOnline
  const fetchActiveUsers = async () => {
    let active = [];
    readFireBase("UserList", "").then((data) => {
      let dataArray = Object.keys(data).map((key) => [key, data[key]]);
      dataArray.forEach((e) => {
        e[1].isOnline === true && active.push(e[1].name);
      });
      setActiveUsers(active);
    });
  };

  return (
    <List
      dense
      sx={{
        width: "100%",
        bgcolor: "#252d38",
        color: "#B9EFA4",
      }}
      className="userlist"
    >
      <ListItem disablePadding>
        <ListItemButton>
          <h3>Active Users</h3>
        </ListItemButton>
      </ListItem>
      {activeUsers &&
        activeUsers.map((value, i) => {
          const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem key={i} disablePadding>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={` ${value}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
}

export default UserList;
