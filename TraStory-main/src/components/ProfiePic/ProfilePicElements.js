// import React, { useState, forwardRef, useRef, useImperativeHandle } from "react";
// import { makeStyles } from "@material-ui/core/styles";

// import Avatar from "@material-ui/core/Avatar";
// import firebase,{ storage } from "../../Firebase";

// // designing the main container//
// const useStyles = makeStyles((theme) => ({
//     avatar: {
//         margin: theme.spacing(1),
//         backgroundColor: theme.palette.secondary.main,
//         width: "150px",
//         height: "150px"
//       },
//     media:{
//     //   width: "250px",
//     //   height: "250px"
//     }
//   }));
// let imgUplodPath;
// let imgPathURL;

// export function getURL(){
//   alert(imgPathURL + " 123");
//   return imgPathURL;
// };

// export async function handleUpload1()
// {
//   // const uploadTask = storage.ref(`images/${imgUplodPath.name}`).put(imgUplodPath);
//   //     uploadTask.on(
//   //       "state_changed",
//   //       error => {
//   //         console.log(error);
//   //       },
//   //       () => {
//   //         storage
//   //           .ref("images")
//   //           .child(imgUplodPath.name)
//   //           .getDownloadURL()
//   //           .then(url => {
//   //             // setUrl(url);
//   //             alert(url);
//   //           });
//   //       }
//   //     );
// };

// function ProfiePicEditor(props) {
//     const classes = useStyles();

//     const [image, setImage] = useState(null);
//     const [url, setUrl] = useState("");

//     // forwardRef((props, ref) => {

//     //   // The component instance will be extended
//     //   // with whatever you return from the callback passed
//     //   // as the second argument
//     //   useImperativeHandle(ref, () => ({

//     //   }));

//     // });

//     const handleChange = e => {
//         if (e.target.files[0]) {
//           imgUplodPath= e.target.files[0];
//           imgPathURL=URL.createObjectURL(e.target.files[0]);
//           console.log("image: ", imgUplodPath);
//         }
//         setImage(URL.createObjectURL(e.target.files[0]));
//         setUrl(URL.createObjectURL(e.target.files[0]));
//       };

//       const handleUpload = () =>
//       {
//         const uploadTask = storage.ref(`images/${imgUplodPath.name}`).put(imgUplodPath);

//         uploadTask.on(
//           "state_changed",
//           error => {
//             console.log(error);
//           },
//           () => {
//             storage
//               .ref("images")
//               .child(imgUplodPath.name)
//               .getDownloadURL()
//               .then(url => {
//                 setUrl(url);
//                 console.log("image1: ", imgUplodPath);

//               });
//           }
//         );
//         // .then(()=>{
//         //   imgPathURL=URL.createObjectURL(url);
//         //   alert(imgPathURL);
//         // })

//         // console.log("image134: ", imgUplodPath)
//         // console.log("url: ", url);
//         // console.log("image1: ", imgUplodPath);
//       };

//       // const upload = ()=>{
//       //   if(image == null)
//       //     return;
//       //   storage.ref(`/images/${image.name}`).put(image)
//       //   .on("state_changed" , alert("success") , alert);
//       // }

//     //   console.log("image: ", imgUplodPath);

//     // function handleUpload()
//     // {
//     //   const uploadTask = storage.ref(`images/${imgUplodPath.name}`).put(imgUplodPath);
//     //   uploadTask.on(
//     //     "state_changed",
//     //     error => {
//     //       console.log(error);
//     //     },
//     //     () => {
//     //       storage
//     //         .ref("images")
//     //         .child(imgUplodPath.name)
//     //         .getDownloadURL()
//     //         .then(url => {
//     //           setUrl(url);
//     //           alert(url);
//     //         });
//     //     }
//     //   );
//     // };

//     return (
//         <div>
//             <Avatar id="pic1Sub" className={classes.avatar} src={url || "http://via.placeholder.com/250"} alt="The current file" />
//             <input type="file" id="imputImage" onChange={handleChange} />
//             <button onClick={handleUpload}>cilck</button>
//         </div>
//     )
// }

// export default ProfiePicEditor
