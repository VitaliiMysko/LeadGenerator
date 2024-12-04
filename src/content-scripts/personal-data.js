if (!window.leadGenerator.personalDataInit) {
  window.leadGenerator.personalData = window.leadGenerator.personalData || {};
  (() => {
    const getFirstName = (fullName) => {
      let [firstName] = fullName.includes(" ") ? fullName.split(" ") : "";
      console.log("<< getFirstName >>");
      return firstName;
    };

    console.log("<< ooOoo >>");
    window.leadGenerator.personalData.getFirstName = getFirstName;
  })();

  window.leadGenerator.personalDataInit = true;
}
