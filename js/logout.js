function logout() {
    sessionStorage.setItem("key", "logout");
    window.location.href = "index.html";
  }