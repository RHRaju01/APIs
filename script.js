"use strict";
let data;
let capStr;
let nutrition;

const getFruitData = async function (food) {
  try {
    const message = document.getElementById("message");
    message.textContent =
      "Please wait. Getting nutrition value for your query...";
    message.style.color = "#4162fe";
    message.style.display = "block";

    // The API key used here for demonstration purposes
    // Don't use your API key in public interface
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=Wj57HkijBuH6LPYrBgKEIgSRtdeubULA8Hx6Gxd1&query=${food}`
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(`Error fetching data. status: ${response.status}`);
    }

    data = await response.json();
    console.log(data);
    const capitalizeFoodStr = function (string) {
      if (!string) return string;
      capStr = string.charAt(0).toUpperCase() + string.slice(1);
      return capStr;
    };

    const rawStr = `${capitalizeFoodStr(food)}, raw`;
    const rawFruitValidation = data.foods.find(
      (item) => item.description === rawStr
    );

    const rawFruit = rawFruitValidation ? rawFruitValidation : data.foods[0];

    const table = document.getElementById("tab");
    const tbody = table.querySelector("tbody");
    const nutritionDetails = document.getElementById("nutritionDetails");

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    const unitReplacements = {
      G: "g",
      KCAL: "kcal",
      MG: "mg",
      UG: "µg",
    };

    for (let i = 0; i < rawFruit.foodNutrients.length - 1; i++) {
      nutrition = rawFruit.foodNutrients[i];
      if (nutrition.value > 0) {
        const row = document.createElement("tr");
        const nutrientCell = document.createElement("td");
        nutrientCell.textContent = nutrition.nutrientName;
        const amountCell = document.createElement("td");
        amountCell.textContent = nutrition.value;
        const unitCell = document.createElement("td");
        const unit = unitReplacements[nutrition.unitName] || nutrition.unitName;
        unitCell.textContent = unit;

        row.appendChild(nutrientCell);
        row.appendChild(amountCell);
        row.appendChild(unitCell);
        tbody.appendChild(row);
      }
    }

    const dataTableContainer = document.querySelector(".data-table-container");
    dataTableContainer.style.visibility = "visible";
    nutritionDetails.textContent = `For 100 gram ${capitalizeFoodStr(food)}`;
    dataTableContainer.style.opacity = 0;

    setTimeout(() => {
      dataTableContainer.style.transition = "opacity 1s ease-in-out";
      dataTableContainer.style.opacity = 1;
      document.getElementById("message").style.display = "none";
    }, 500);
  } catch (error) {
    console.error(error);
    const message = document.getElementById("message");
    message.textContent = "There was an error fetching data. Please try again.";
    message.style.color = "#fe2400";
    message.style.display = "block";
  }
};

function fetchData() {
  const foodInput = document.getElementById("foodInput").value.trim();
  if (!foodInput) {
    const message = document.getElementById("message");
    message.textContent = "Please enter a valid food name.";
    message.style.color = "#fe2400";
    message.style.display = "block";
    return;
  }
  getFruitData(foodInput);
  document.getElementById("foodInput").value = "";
  document.getElementById("foodInput").blur();
}

document.getElementById("getDataButton").addEventListener("click", fetchData);
document
  .getElementById("foodInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchData();
    }
  });
