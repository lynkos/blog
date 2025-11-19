function initTabs() {
  const tabContainers = document.querySelectorAll(".tab-container");

  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll(".tablinks");
    const contents = container.querySelectorAll(".tabcontent");

    tabs.forEach(tab => {
      tab.addEventListener("click", function (e) {
        // Hide all tab content in this container
        contents.forEach(content => {
          content.style.display = "none";
        });

        // Remove 'active' class from all tabs in this container
        tabs.forEach(t => t.classList.remove("active"));

        // Show the current tab's content and mark as active
        const target = this.dataset.target;
        container.querySelector(`#${target}`).style.display = "block";
        this.classList.add("active");
      });
    });

    // Auto-click the first tab by default
    const defaultOpen = container.querySelector(".tablinks");
    if (defaultOpen) {
      defaultOpen.click();
    }
  });
}

export { initTabs };