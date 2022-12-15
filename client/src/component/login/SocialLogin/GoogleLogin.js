


// import React, { useState, useEffect } from "react";
// import qs from "qs";

// const CLIENT_ID =
//   "987187194367-r0gmdo25lcbmdotgmcnlgtjae02c3d62.apps.googleusercontent.com";
// const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
// const PEOPLE_URI = "https://people.googleapis.com/v1/contactGroups";

// const queryStr = qs.stringify({
//   client_id: CLIENT_ID,
//   redirect_uri: "http://localhost:3000",
//   response_type: "token",
//   scope: "https://www.googleapis.com/auth/contacts.readonly"
// });

// const loginUrl = AUTHORIZE_URI + "?" + queryStr;

// export default () => {
//   const { access_token } = qs.parse(window.location.hash.substr(1));

//   if (!access_token) {
//     window.location.assign(loginUrl);
//     return null;
//   }

//   const [contactGroups, setContactGroups] = useState([]);

//   useEffect(() => {
//     fetch(PEOPLE_URI, {
//       headers: { Authorization: "Bearer " + access_token }
//     })
//       .then(response => response.json())
//       .then(data => setContactGroups(data.contactGroups));
//   }, [access_token]);

//   return (
//     <>
//       <h2>Contact Groups</h2>
//       <ul>
//         {contactGroups &&
//           contactGroups.map(({ resourceName, name, memberCount }) => (
//             <li key={resourceName}>
//               {name} ({memberCount})
//             </li>
//           ))}
//       </ul>
//     </>
//   );
// };


