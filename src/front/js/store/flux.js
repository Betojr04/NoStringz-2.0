import { Data } from "@react-google-maps/api";

const fetchWrapper = async (url, method, body, token = null) => {
  const config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  const response = await fetch(process.env.BACKEND_URL + url, config);

  if (!response.ok) {
    throw new Error("Request failed: " + response.statusText);
  }

  return await response.json();
};

const getState = ({ getStore, getActions, setStore }) => {
  let backEndURL = process.env.BACKEND_URL;
  return {
    store: {
      loggedInUser: null,
      users: [],
      openedProfile: null,
      filters: {
        gender: null,
        genderF: null,
        isOnline: true,
        isOnlineF: true,
        hasProfilePhoto: true,
        hasProfilePhotoF: true,
        chatHistory: true,
        chatHistoryF: true,
        isRegistered: true,
        isRegisteredF: true,
        isAnonymous: true,
        isAnonymousF: true,
        interests: ["orgy", "bukake", "exhibition", "gloryHoles", "BDSM"],
      },
      darkMode: false,
    },
    actions: {
      createAccount: async (email, password, gender) => {
        try {
          return await fetchWrapper("/api/createaccount", "POST", {
            email,
            password,
            gender,
          });
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      setDarkMode: (status) => {
        const store = getStore();
        setStore({ darkMode: status });
      },
      setFilter: (newFilterValues) => {
        const store = getStore();
        setStore({ filters: { ...store.filters, ...newFilterValues } });
      },
      handleLogin: async (email, password, setIsLoggedIn) => {
        try {
          const result = await fetchWrapper("/api/login", "POST", {
            email,
            password,
          });
          sessionStorage.setItem("token", result.token);
          setIsLoggedIn(true);
          return result;
        } catch (error) {
          alert("Invalid credentials");
          console.error(error);
        }
      },
      logout: async () => {
        const token = sessionStorage.getItem("token");
        try {
          await fetchWrapper("/api/anon-logout", "DELETE", null, token);
        } catch (error) {
          console.error(error);
        }
        sessionStorage.removeItem("token");
      },
      getCurrentLocation: () => {
        if (navigator.geolocation) {
          const token = sessionStorage.getItem("token");
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const path = sessionStorage.getItem("isAnonymous")
                ? "/api/anon-location"
                : "/api/current-location";
              try {
                await fetchWrapper(
                  path,
                  "PUT",
                  {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  },
                  token
                );
              } catch (error) {
                console.error(error);
              }
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      },
      getUsers: async () => {
        const token = sessionStorage.getItem("token");
        try {
          const users = await fetchWrapper("/api/users", "GET", null, token);
          setStore({ users });

          const anonUsers = await fetchWrapper(
            "/api/anon-users",
            "GET",
            null,
            token
          );
          setStore({ anonUsers });
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};

export default getState;

// import { Data } from "@react-google-maps/api";

// const getState = ({ getStore, getActions, setStore }) => {
//   let backEndURL = process.env.BACKEND_URL;
//   return {
//     store: {
//       // changed to users since we are no longer having sepasrate code for guys and girls
//       loggedInUser: null,
//       users: [],
//       openedProfile: null,
//       filters: {
//         gender: null,
//         genderF: null,
//         isOnline: true,
//         isOnlineF: true,
//         hasProfilePhoto: true,
//         hasProfilePhotoF: true,
//         chatHistory: true,
//         chatHistoryF: true,
//         isRegistered: true,
//         isRegisteredF: true,
//         isAnonymous: true,
//         isAnonymousF: true,
//         interests: ["orgy", "bukake", "exhibition", "gloryHoles", "BDSM"],
//       },
//       darkMode: false,
//     },
//     actions: {
//       // the below is the action for the sign up component
//       createAccount: async (email, password, gender) => {
//         try {
//           const response = await fetch(
//             process.env.BACKEND_URL + "/api/createaccount",
//             {
//               method: "POST",
//               body: JSON.stringify({ email, password, gender }),
//               headers: { "Content-Type": "application/json" },
//             }
//           );

//           if (!response.ok) {
//             throw new Error("Failed to create account");
//           }

//           return await response.json();
//         } catch (error) {
//           console.error(error);
//           throw error;
//         }
//       },
//       setDarkMode: (status) => {
//         const store = getStore();
//         setStore({ darkMode: status });
//       },
//       setFilter: (newFilterValues) => {
//         console.log("setting new filters", newFilterValues);
//         const store = getStore();
//         setStore({ filters: { ...store.filters, ...newFilterValues } });
//       },
//       handleLogin: (email, password, setIsLoggedIn) => {
//         localStorage.removeItem("isAnonymous");
//         return fetch(process.env.BACKEND_URL + "/api/login", {
//           method: "POST",
//           body: JSON.stringify({
//             email: email,
//             password: password,
//           }),
//           headers: { "Content-Type": "application/json" },
//         })
//           .then((Response) => {
//             if (Response.status === 400) {
//               setError("invalid credentials");
//             } else if (Response.status === 200) {
//               return Response.json();
//             } else {
//               throw new Error("I have a problem");
//             }
//           })
//           .then((result) => {
//             console.log(result);
//             localStorage.setItem("token", result.token);
//             // localStorage.setItem("isAnonymous", false);
//             setIsLoggedIn(true);
//             return result;
//           })
//           .catch((error) => {
//             alert("invalid credentials");
//             console.log("invalid credentials");
//           });
//       },
//       logout: () => {
//         if (JSON.parse(localStorage.getItem("isAnonymous"))) {
//           console.log("logout executed");
//           fetch(backEndURL + "/api/anon-logout", {
//             method: "DELETE",
//             headers: {
//               Authorization: "Bearer " + localStorage.getItem("token"),
//             },
//           })
//             .then((resp) => resp.json())
//             .then((result) => console.log("result success", result))
//             .catch((error) => console.log(error));
//         }
//       },
//       getCurrentLocation: () => {
//         if (navigator.geolocation && localStorage.getItem("isAnonymous")) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               fetch(backEndURL + "/api/anon-location", {
//                 method: "PUT",
//                 body: JSON.stringify({
//                   lat: position.coords.latitude,
//                   lng: position.coords.longitude,
//                 }),
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: "Bearer " + localStorage.getItem("token"),
//                 },
//               })
//                 .then(() => true)
//                 .catch((error) => {
//                   console.log(error);
//                 });
//             },
//             (error) => {
//               console.log(error);
//             }
//           );
//         } else if (navigator.geolocation && localStorage.getItem("token")) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               fetch(backEndURL + "/api/current-location", {
//                 method: "PUT",
//                 body: JSON.stringify({
//                   lat: position.coords.latitude,
//                   lng: position.coords.longitude,
//                 }),
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: "Bearer " + localStorage.getItem("token"),
//                 },
//               })
//                 .then((resp) => console.log(resp.json()))
//                 .catch((error) => {
//                   console.log(error);
//                 });
//             },
//             (error) => {
//               console.log(error);
//             }
//           );
//         } else {
//           console.log("something went wrong while retrieving your location");
//         }
//       },
//       getUsers: () => {
//         fetch(backEndURL + "/api/users", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         })
//           .then((resp) => resp.json())
//           .then((data) => {
//             setStore({ users: data });
//             return data;
//           })
//           .catch((error) => {
//             console.log(error);
//           });

//         fetch(backEndURL + "/api/anon-users", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         })
//           .then((resp) => resp.json())
//           .then((data) => {
//             setStore({ anonUsers: data });
//             return data;
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       },
//     },
//   };
// };

// export default getState;
