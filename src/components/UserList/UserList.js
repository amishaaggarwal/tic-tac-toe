import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import "./UserList.scss";

function UserList() {
  const [activeUsers, setActiveUsers] = useState();
  const myUser = JSON.parse(getSessionStorage());

  useEffect(() => {
    let active = [];
    onValue(ref(db, `UserList/`), (data) => {
      console.log(data.val());
      let dataArray = Object.keys(data.val()).map((key) => [
        key,
        data.val()[key],
      ]);
      dataArray.forEach((e) => {
        e[1].isOnline === true &&
          e[1].email !== myUser &&
          active.push(e[1].name);
      });
      setActiveUsers(active);
    });
  }, [myUser]);

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
