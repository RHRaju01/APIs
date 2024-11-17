document.addEventListener("DOMContentLoaded", function () {
  // Calendar functionality
  const dateInput = document.getElementById("departureDate");
  const calendarDropdown = document.getElementById("calendarDropdown");
  const calendarGrid = document.getElementById("calendarGrid");
  const currentMonthElement = document.getElementById("currentMonth");
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

  let currentDate = new Date();
  let selectedDate = new Date(currentDate);
  selectedDate.setDate(selectedDate.getDate() + 1); // Set to tomorrow by default

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function updateDateInput() {
    dateInput.value = formatDate(selectedDate);
  }

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthElement.textContent = new Date(year, month, 1).toLocaleString(
      "default",
      { month: "long", year: "numeric" }
    );

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Clear previous calendar
    calendarGrid.innerHTML = "";

    // Add weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach((day) => {
      const dayElement = document.createElement("div");
      dayElement.className = "weekday-header";
      dayElement.textContent = day;
      calendarGrid.appendChild(dayElement);
    });

    // Add empty cells for days before first day of month
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day";
      calendarGrid.appendChild(emptyDay);
    }

    // Add days of month
    for (let day = 1; day <= totalDays; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = day;

      const currentDay = new Date(year, month, day);

      // Disable past dates
      if (currentDay < new Date().setHours(0, 0, 0, 0)) {
        dayElement.classList.add("disabled");
      } else {
        dayElement.addEventListener("click", () => {
          selectedDate = new Date(year, month, day);
          updateDateInput();
          calendarDropdown.classList.remove("active");
          const selected = document.querySelector(".calendar-day.selected");
          if (selected) selected.classList.remove("selected");
          dayElement.classList.add("selected");
        });

        // Highlight selected date
        if (
          selectedDate.getDate() === day &&
          selectedDate.getMonth() === month &&
          selectedDate.getFullYear() === year
        ) {
          dayElement.classList.add("selected");
        }
      }

      calendarGrid.appendChild(dayElement);
    }
  }

  // Initialize calendar
  renderCalendar(selectedDate);
  updateDateInput();

  // Calendar navigation
  prevMonthButton.addEventListener("click", () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    renderCalendar(selectedDate);
  });

  nextMonthButton.addEventListener("click", () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    renderCalendar(selectedDate);
  });

  // Show/hide calendar
  dateInput.addEventListener("click", () => {
    calendarDropdown.classList.toggle("active");
  });

  // Set default values
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("departureDate").value =
    tomorrow.toLocaleDateString();

  // Location input handling
  const fromLocation = document.getElementById("fromLocation");
  const toLocation = document.getElementById("toLocation");
  let activeLocationInput = null;

  fromLocation.addEventListener("click", function () {
    this.readOnly = false;
    this.focus();
    activeLocationInput = this;
  });

  toLocation.addEventListener("click", function () {
    this.readOnly = false;
    this.focus();
    activeLocationInput = this;
  });

  // Swap locations
  document
    .getElementById("swapLocations")
    .addEventListener("click", function () {
      const temp = fromLocation.value;
      fromLocation.value = toLocation.value;
      toLocation.value = temp;
    });

  // Traveller selector
  const travellerButton = document.getElementById("travellerButton");
  const travellerDropdown = document.getElementById("travellerDropdown");
  const decreaseButtons = travellerDropdown.querySelectorAll(".decrease");
  const increaseButtons = travellerDropdown.querySelectorAll(".increase");
  const travellerCounts =
    travellerDropdown.querySelectorAll(".traveller-count");
  const travellerDoneButton = document.getElementById("travellerDoneButton");

  travellerButton.addEventListener("click", function () {
    travellerDropdown.classList.toggle("active");
  });

  travellerDoneButton.addEventListener("click", () => {
    travellerDropdown.classList.remove("active");
  });

  decreaseButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      let count = parseInt(travellerCounts[index].textContent);
      if (index === 0 && count <= 1) return; // Minimum 1 adult
      if (count > 0) {
        count--;
        travellerCounts[index].textContent = count;
        updateTravellerCount();
      }
    });
  });

  increaseButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      let count = parseInt(travellerCounts[index].textContent);
      count++;
      travellerCounts[index].textContent = count;
      updateTravellerCount();
    });
  });

  function updateTravellerCount() {
    const total = Array.from(travellerCounts).reduce(
      (sum, element) => sum + parseInt(element.textContent),
      0
    );
    travellerButton.textContent = `${total} Traveller${total > 1 ? "s" : ""}`;
  }

  // Cabin selector functionality
  const cabinButton = document.getElementById("cabinButton");
  const cabinDropdown = document.getElementById("cabinDropdown");
  const cabinItems = document.querySelectorAll(".cabin-item");
  const cabinDoneButton = document.getElementById("cabinDoneButton");

  cabinButton.addEventListener("click", () => {
    cabinDropdown.classList.toggle("active");
  });

  cabinItems.forEach((item) => {
    item.addEventListener("click", () => {
      const radio = item.querySelector('input[type="radio"]');
      const cabinTitle = item.querySelector(".cabin-title").textContent;

      // Uncheck all radios
      document
        .querySelectorAll('input[name="cabinClass"]')
        .forEach((r) => (r.checked = false));

      // Check selected radio
      radio.checked = true;
      // Update button text
      cabinButton.textContent = cabinTitle;
    });
  });

  cabinDoneButton.addEventListener("click", () => {
    cabinDropdown.classList.remove("active");
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#travellerSelector")) {
      travellerDropdown.classList.remove("active");
    }
    if (!event.target.closest("#cabinSelector")) {
      cabinDropdown.classList.remove("active");
    }
    if (!event.target.closest("#departureDate")) {
      calendarDropdown.classList.remove("active");
    }
  });

  // Form submission
  document
    .getElementById("flightSearchForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const selectedCabin = document.querySelector(
        'input[name="cabinClass"]:checked'
      );

      // Get individual traveler counts
      const [adults, children, infants] = Array.from(travellerCounts).map(
        (count) => parseInt(count.textContent)
      );

      const searchData = {
        originLocationCode: fromLocation.value,
        destinationLocationCode: toLocation.value,
        departureDate: document.getElementById("departureDate").value,
        adults, // Using object shorthand for adults: adults
        children, // Using object shorthand for children: children
        infants, // Using object shorthand for infants: infants
        travelClass: selectedCabin ? selectedCabin.value : "ECONOMY",
      };
      console.log("Search Data:", searchData);
    });
});