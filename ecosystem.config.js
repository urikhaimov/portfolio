module.exports = {
  apps: [
    {
      name: "DEBUG ENV",
      script: "$(which yarn) start:debug",
      args: "",
    },
    {
      name: "REACT DEVTOOLS",
      script: "react-devtools",
      args: "",
    }
  ]
};
