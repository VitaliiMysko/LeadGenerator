import {
    copyToFileBtnElement,
    emailElement,
    dataContainerElement,
  } from "../../helper/dom-helper.js";
  import { showAlert } from "../../output/alert.js";
  
  copyToFileBtnElement.addEventListener("click", () => {
    sendDataToLocalServer();
  });
  
  function sendDataToLocalServer() {
    console.log("here");
    emailElement.value = emailElement.value.toLocaleLowerCase();
  
    const inputs = dataContainerElement.querySelectorAll("input");
    const values = Array.from(inputs)
      .map((input) => input.value)
      .join("\t");

  
    const serverUrl = "http://localhost:3000/data";
  
    fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailElement.value,
        data: values,
      }),
    })
      .then((response) => {
        if (!response.ok) {
            console.log(response);
            showAlert("Failed to write data!", "error");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        showAlert("Data sent successfully!", "success");
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
        showAlert("Failed to send data to server!", "error");
      });
  }