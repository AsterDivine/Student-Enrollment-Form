// Get the form and the elements that will be used many times.
const form = document.getElementById("enrollmentForm");
const courseSelect = document.getElementById("course");
const majorGroup = document.getElementById("majorGroup");
const majorSelect = document.getElementById("major");
const studentTableBody = document.getElementById("studentTableBody");
const successMessage = document.getElementById("successMessage");


const fields = {
    studentId: document.getElementById("studentId"),
    prefix: document.getElementById("prefix"),
    firstName: document.getElementById("firstName"),
    middleName: document.getElementById("middleName"),
    lastName: document.getElementById("lastName"),
    suffix: document.getElementById("suffix"),
    email: document.getElementById("email"),
    course: courseSelect,
    major: majorSelect,
    yearLevel: document.getElementById("yearLevel")
};

/*
    showError()
    Displays a red error message for a field and marks the input
    as invalid for both visual feedback and accessibility.
*/
function showError(field, message) {
    const errorElement = document.getElementById(`${field.id}Error`);

    errorElement.textContent = message;
    field.classList.add("input-error");
    field.setAttribute("aria-invalid", "true");
}

/*
    clearError()
    Removes the error message and the invalid state from one field.
*/
function clearError(field) {
    const errorElement = document.getElementById(`${field.id}Error`);

    errorElement.textContent = "";
    field.classList.remove("input-error");
    field.removeAttribute("aria-invalid");
}

/*
    clearAllErrors()
    Clears every validation message before checking the form again.
*/
function clearAllErrors() {
    Object.values(fields).forEach((field) => {
        clearError(field);
    });
}

/*
    updateMajorField()
    Shows the Major dropdown only when BSIT is selected.
    The field becomes required for BSIT and is cleared for other courses.
*/
function updateMajorField() {
    const isBSIT = courseSelect.value === "BSIT";

    majorGroup.hidden = !isBSIT;
    majorSelect.required = isBSIT;

    if (!isBSIT) {
        majorSelect.value = "";
        clearError(majorSelect);
    }
}

/*
    isValidEmail()
    Uses the browser's built-in email validation through the validity object.
*/
function isValidEmail(emailField) {
    return emailField.validity.valid;
}

/*
    validateForm()
    Checks all required fields and minimum lengths.
    Returns true when the form has no validation errors.
*/
function validateForm() {
    let isValid = true;

    clearAllErrors();

    // Student ID: required and at least 5 characters.
    if (fields.studentId.value.trim() === "") {
        showError(fields.studentId, "Student ID required.");
        isValid = false;
    } else if (fields.studentId.value.trim().length < 5) {
        showError(fields.studentId, "Min 5 characters.");
        isValid = false;
    }

    // Prefix: optional, but if entered it must have at least 2 characters.
    if (
        fields.prefix.value.trim() !== "" &&
        fields.prefix.value.trim().length < 2
    ) {
        showError(fields.prefix, "Min 2 characters.");
        isValid = false;
    }

    // First name: required and at least 3 characters.
    if (fields.firstName.value.trim() === "") {
        showError(fields.firstName, "First name required.");
        isValid = false;
    } else if (fields.firstName.value.trim().length < 3) {
        showError(fields.firstName, "Min 3 characters.");
        isValid = false;
    }

    // Middle name: optional, but if entered it must have at least 2 characters.
    if (
        fields.middleName.value.trim() !== "" &&
        fields.middleName.value.trim().length < 2
    ) {
        showError(fields.middleName, "Min 2 characters.");
        isValid = false;
    }

    // Last name: required and at least 2 characters.
    if (fields.lastName.value.trim() === "") {
        showError(fields.lastName, "Last name required.");
        isValid = false;
    } else if (fields.lastName.value.trim().length < 2) {
        showError(fields.lastName, "Min 2 characters.");
        isValid = false;
    }

    // Suffix: optional, but if entered it must have at least 2 characters.
    if (
        fields.suffix.value.trim() !== "" &&
        fields.suffix.value.trim().length < 2
    ) {
        showError(fields.suffix, "Min 2 characters.");
        isValid = false;
    }

    // Email: required and must match the email input format.
    if (fields.email.value.trim() === "") {
        showError(fields.email, "Email required.");
        isValid = false;
    } else if (!isValidEmail(fields.email)) {
        showError(fields.email, "Please enter a valid email address.");
        isValid = false;
    }

    // Course: required.
    if (fields.course.value === "") {
        showError(fields.course, "Please select a course.");
        isValid = false;
    }

    // Major: required only when BSIT is selected.
    if (fields.course.value === "BSIT" && fields.major.value === "") {
        showError(fields.major, "Please select a BSIT major.");
        isValid = false;
    }

    // Year level: required.
    if (fields.yearLevel.value === "") {
        showError(fields.yearLevel, "Please select a year level.");
        isValid = false;
    }

    return isValid;
}

/*
    buildFullName()
    Combines the optional prefix, first name, middle name,
    last name, and optional suffix into one readable name.
*/
function buildFullName() {
    const nameParts = [
        fields.prefix.value.trim(),
        fields.firstName.value.trim(),
        fields.middleName.value.trim(),
        fields.lastName.value.trim(),
        fields.suffix.value.trim()
    ];

    // Remove blank values before joining the name.
    return nameParts.filter((part) => part !== "").join(" ");
}

/*
    addStudentToTable()
    Creates a new table row using createElement and textContent.
    textContent is used so user-entered text is treated as plain text.
*/
function addStudentToTable() {
    const row = document.createElement("tr");

    const studentData = [
        fields.studentId.value.trim(),
        buildFullName(),
        fields.email.value.trim(),
        fields.course.value,
        fields.course.value === "BSIT" ? fields.major.value : "N/A",
        fields.yearLevel.value
    ];

    studentData.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    studentTableBody.appendChild(row);
}

/*
    resetFormState()
    Clears the form and returns the BSIT Major field to its hidden state.
*/
function resetFormState() {
    form.reset();
    updateMajorField();
    clearAllErrors();
}

/*
    clearSuccessMessage()
    Removes the success message when the user starts entering new data.
*/
function clearSuccessMessage() {
    successMessage.textContent = "";
}

// Update the Major field whenever the Course dropdown changes.
courseSelect.addEventListener("change", () => {
    updateMajorField();
    clearError(courseSelect);
    clearSuccessMessage();
});

// Clear a field's error message as soon as the user changes its value.
Object.values(fields).forEach((field) => {
    const eventName = field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventName, () => {
        clearError(field);
        clearSuccessMessage();
    });
});

/*
    Form submit event
    Prevents the default page reload, validates the data,
    adds valid data to the table, then shows a success message.
*/
form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        // Move keyboard focus to the first field that has an error.
        const firstInvalidField = form.querySelector(".input-error");

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;
    }

    addStudentToTable();
    resetFormState();

    successMessage.textContent = "Student enrollment is a success!";
});

// Set the correct Major field state when the page first loads.
updateMajorField();
