import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import "./UserList.scss";

function UserList() {
  return (
    <List
      dense
      sx={{
        width: "100%",
        // maxWidth: 300,
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
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem key={value} disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default UserList;
