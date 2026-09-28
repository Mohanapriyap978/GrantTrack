/* =========================================================
   GRANTTRACK FRONTEND
   HTML + CSS + JavaScript
   Backend: Spring Boot REST API
   ========================================================= */

const API = "/api";

let faculties = [];
let applications = [];
let stages = [];
let expenditures = [];
let nearDeadlineApplications = [];


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();

    setupForms();

    setupSearch();

    updateCurrentDate();

    loadAllData();

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const section =
                item.dataset.section;

            showSection(section);

        });

    });

}


function showSection(sectionId) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    const selectedSection =
        document.getElementById(sectionId);


    if (selectedSection) {

        selectedSection.classList.add("active");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

            if (item.dataset.section === sectionId) {

                item.classList.add("active");

            }

        });


    updatePageHeader(sectionId);


    if (sectionId === "deadlines") {
        loadNearDeadline();
    }

    if (sectionId === "stages") {
        loadStages();
    }

    if (sectionId === "expenditures") {
        loadExpenditures();
    }

}


function updatePageHeader(sectionId) {

    const titles = {

        dashboard: [
            "Dashboard",
            "Research grant application overview"
        ],

        faculty: [
            "Faculty Management",
            "Manage faculty members"
        ],

        applications: [
            "Grant Applications",
            "Submit and monitor research grants"
        ],

        stages: [
            "Review Stages",
            "Track application review progress"
        ],

        expenditures: [
            "Expenditure Tracking",
            "Monitor grant budget utilization"
        ],

        deadlines: [
            "Near Deadline",
            "Monitor approaching grant deadlines"
        ]

    };


    const data = titles[sectionId];


    if (!data) {
        return;
    }


    document.getElementById(
        "pageTitle"
    ).textContent = data[0];


    document.getElementById(
        "pageSubtitle"
    ).textContent = data[1];

}


/* =========================================================
   INITIAL DATA
   ========================================================= */

async function loadAllData() {

    try {

        await Promise.all([

            loadFaculty(),

            loadApplications(),

            loadStages(),

            loadExpenditures(),

            loadNearDeadline()

        ]);

    } catch (error) {

        showToast(
            "Connection Error",
            "Unable to connect to the backend.",
            true
        );

    }

}


/* =========================================================
   API HELPER
   ========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const response = await fetch(
        API + url,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        }
    );


    let data;


    try {

        data = await response.json();

    } catch {

        data = {};

    }


    if (!response.ok) {

        const message =
            data.error ||
            data.message ||
            "Request failed.";

        throw new Error(message);

    }


    return data;

}


/* =========================================================
   FACULTY
   ========================================================= */

async function loadFaculty() {

    try {

        faculties =
            await apiRequest("/faculties");

        renderFaculty();

        populateFacultyDropdowns();

        updateDashboard();

    } catch (error) {

        renderError(
            "facultyTableBody",
            4,
            error.message
        );

    }

}


function renderFaculty() {

    const body =
        document.getElementById(
            "facultyTableBody"
        );


    if (!faculties.length) {

        body.innerHTML =
            emptyTableRow(
                4,
                "No faculty records found."
            );

        return;

    }


    body.innerHTML =
        faculties.map(faculty => `

            <tr>

                <td>
                    <strong>
                        #${faculty.id}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(faculty.name)}
                </td>

                <td>
                    ${escapeHtml(faculty.email)}
                </td>

                <td>
                    <span class="badge submitted">
                        ${escapeHtml(faculty.department)}
                    </span>
                </td>

            </tr>

        `).join("");

}


function populateFacultyDropdowns() {

    const select =
        document.getElementById(
            "applicationFaculty"
        );


    select.innerHTML =
        `<option value="">
            Select Faculty
        </option>`;


    faculties.forEach(faculty => {

        select.innerHTML += `
            <option value="${faculty.id}">
                ${escapeHtml(faculty.name)}
                - ${escapeHtml(faculty.department)}
            </option>
        `;

    });

}


/* =========================================================
   APPLICATIONS
   ========================================================= */

async function loadApplications() {

    try {

        applications =
            await apiRequest("/applications");

        renderApplications();

        populateApplicationDropdowns();

        updateDashboard();

    } catch (error) {

        renderError(
            "applicationTableBody",
            7,
            error.message
        );

    }

}


function renderApplications(
    filtered = applications
) {

    const body =
        document.getElementById(
            "applicationTableBody"
        );


    if (!filtered.length) {

        body.innerHTML =
            emptyTableRow(
                7,
                "No applications found."
            );

        return;

    }


    body.innerHTML =
        filtered.map(application => `

            <tr>

                <td>
                    <strong>
                        #${application.id}
                    </strong>
                </td>


                <td>
                    <strong>
                        ${escapeHtml(
            application.title
        )}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(
            application.faculty?.name ||
            "Not assigned"
        )}
                </td>


                <td>
                    ₹${formatNumber(
            application.requestedAmount
        )}
                </td>


                <td>
                    ${formatDate(
            application.deadline
        )}
                </td>


                <td>
                    ${statusBadge(
            application.status
        )}
                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-button edit"
                            onclick="editApplication(${application.id})"
                            title="Update Status"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>


                        <button
                            class="action-button delete"
                            onclick="deleteApplication(${application.id})"
                            title="Delete Application"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `).join("");

}


function populateApplicationDropdowns() {

    const stageSelect =
        document.getElementById(
            "stageApplication"
        );


    const expenditureSelect =
        document.getElementById(
            "expenditureApplication"
        );


    stageSelect.innerHTML =
        `<option value="">
            Select Application
        </option>`;


    expenditureSelect.innerHTML =
        `<option value="">
            Select Approved Application
        </option>`;


    applications.forEach(application => {

        stageSelect.innerHTML += `
            <option value="${application.id}">
                #${application.id} -
                ${escapeHtml(application.title)}
            </option>
        `;


        if (
            application.status &&
            application.status.toUpperCase() ===
            "APPROVED"
        ) {

            expenditureSelect.innerHTML += `
                <option value="${application.id}">
                    #${application.id} -
                    ${escapeHtml(application.title)}
                </option>
            `;

        }

    });

}


/* =========================================================
   CREATE APPLICATION
   ========================================================= */

async function createApplication(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "applicationTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "applicationDescription"
        ).value.trim();


    const requestedAmount =
        Number(
            document.getElementById(
                "requestedAmount"
            ).value
        );


    const deadline =
        document.getElementById(
            "applicationDeadline"
        ).value;


    const facultyId =
        Number(
            document.getElementById(
                "applicationFaculty"
            ).value
        );


    if (
        !title ||
        !description ||
        !requestedAmount ||
        !deadline ||
        !facultyId
    ) {

        showToast(
            "Validation Error",
            "Please fill all application fields.",
            true
        );

        return;

    }


    try {

        await apiRequest(
            "/applications",
            {

                method: "POST",

                body: JSON.stringify({

                    title: title,

                    description: description,

                    requestedAmount: requestedAmount,

                    status: "SUBMITTED",

                    deadline: deadline,

                    faculty: {
                        id: facultyId
                    }

                })

            }
        );


        showToast(
            "Application Submitted",
            "Grant application created successfully."
        );


        event.target.reset();


        await loadApplications();


        showSection("applications");

    } catch (error) {

        showToast(
            "Application Failed",
            error.message,
            true
        );

    }

}


/* =========================================================
   UPDATE APPLICATION STATUS
   ========================================================= */

async function editApplication(id) {

    const application =
        applications.find(
            app => app.id === id
        );


    if (!application) {

        showToast(
            "Error",
            "Application not found.",
            true
        );

        return;

    }


    const newStatus =
        prompt(

            `Update status for "${application.title}"\n\n` +
            `Enter one of:\n` +
            `SUBMITTED\n` +
            `UNDER_REVIEW\n` +
            `APPROVED\n` +
            `REJECTED`,

            application.status

        );


    if (newStatus === null) {
        return;
    }


    const status =
        newStatus.trim().toUpperCase();


    const validStatuses = [

        "SUBMITTED",

        "UNDER_REVIEW",

        "APPROVED",

        "REJECTED"

    ];


    if (!validStatuses.includes(status)) {

        showToast(
            "Invalid Status",
            "Please enter a valid application status.",
            true
        );

        return;

    }


    try {

        await apiRequest(

            `/applications/${id}/status?status=${encodeURIComponent(status)}`,

            {
                method: "PUT"
            }

        );


        showToast(
            "Application Updated",
            "Application status updated successfully."
        );


        await loadApplications();


        await loadExpenditures();


        updateDashboard();

    } catch (error) {

        showToast(
            "Update Failed",
            error.message,
            true
        );

    }

}


/* =========================================================
   DELETE APPLICATION
   ========================================================= */

async function deleteApplication(id) {

    const application =
        applications.find(
            app => app.id === id
        );


    if (!application) {

        showToast(
            "Error",
            "Application not found.",
            true
        );

        return;

    }


    const confirmed =
        confirm(

            `Are you sure you want to delete this application?\n\n` +

            `${application.title}`

        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(

            `/applications/${id}`,

            {
                method: "DELETE"
            }

        );


        showToast(
            "Application Deleted",
            "Application deleted successfully."
        );


        await loadApplications();


        await loadStages();


        await loadExpenditures();


        await loadNearDeadline();


        updateDashboard();

    } catch (error) {

        showToast(
            "Delete Failed",
            error.message,
            true
        );

    }

}


/* =========================================================
   STAGES
   ========================================================= */

async function loadStages() {

    try {

        stages =
            await apiRequest("/stages");

        renderStages();

    } catch (error) {

        document.getElementById(
            "stageCards"
        ).innerHTML =
            emptyState(error.message);

    }

}


function renderStages() {

    const container =
        document.getElementById(
            "stageCards"
        );


    if (!stages.length) {

        container.innerHTML =
            emptyState(
                "No review stages available."
            );

        return;

    }


    container.innerHTML =
        stages.map(stage => `

            <div class="stage-card">

                <div class="stage-top">

                    <h4>
                        ${escapeHtml(
            stage.name
        )}
                    </h4>

                    ${statusBadge(
            stage.status
        )}

                </div>


                <p>

                    <strong>
                        Committee Remarks:
                    </strong>

                    <br>

                    ${escapeHtml(
            stage.remarks ||
            "No remarks recorded."
        )}

                </p>


                <div class="stage-meta">

                    Application:
                    #${stage.application?.id ?? "N/A"}

                </div>

            </div>

        `).join("");

}


/* =========================================================
   CREATE STAGE
   ========================================================= */

async function createStage(event) {

    event.preventDefault();


    const applicationId =
        Number(
            document.getElementById(
                "stageApplication"
            ).value
        );


    const name =
        document.getElementById(
            "stageName"
        ).value;


    const status =
        document.getElementById(
            "stageStatus"
        ).value;


    const remarks =
        document.getElementById(
            "stageRemarks"
        ).value.trim();


    if (
        !applicationId ||
        !name ||
        !status
    ) {

        showToast(
            "Validation Error",
            "Please fill all required stage fields.",
            true
        );

        return;

    }


    try {

        await apiRequest(
            "/stages",
            {

                method: "POST",

                body: JSON.stringify({

                    name: name,

                    status: status,

                    remarks: remarks,

                    application: {
                        id: applicationId
                    }

                })

            }
        );


        showToast(
            "Stage Added",
            "Review stage and committee remarks saved."
        );


        event.target.reset();


        await loadStages();

    } catch (error) {

        showToast(
            "Stage Failed",
            error.message,
            true
        );

    }

}


/* =========================================================
   EXPENDITURES
   ========================================================= */

async function loadExpenditures() {

    try {

        expenditures =
            await apiRequest(
                "/expenditures"
            );

        renderExpenditures();

    } catch (error) {

        renderError(
            "expenditureTableBody",
            4,
            error.message
        );

    }

}


function renderExpenditures() {

    const body =
        document.getElementById(
            "expenditureTableBody"
        );


    if (!expenditures.length) {

        body.innerHTML =
            emptyTableRow(
                4,
                "No expenditure records found."
            );

        return;

    }


    body.innerHTML =
        expenditures.map(expenditure => `

            <tr>

                <td>
                    <strong>
                        #${expenditure.id}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
            expenditure.description
        )}
                </td>

                <td>
                    <strong>
                        ₹${formatNumber(
            expenditure.amount
        )}
                    </strong>
                </td>

                <td>
                    #${expenditure.application?.id ?? "N/A"}
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   CREATE EXPENDITURE
   ========================================================= */

async function createExpenditure(event) {

    event.preventDefault();


    const applicationId =
        Number(
            document.getElementById(
                "expenditureApplication"
            ).value
        );


    const description =
        document.getElementById(
            "expenditureDescription"
        ).value.trim();


    const amount =
        Number(
            document.getElementById(
                "expenditureAmount"
            ).value
        );


    if (
        !applicationId ||
        !description ||
        !amount
    ) {

        showToast(
            "Validation Error",
            "Please fill all expenditure fields.",
            true
        );

        return;

    }


    try {

        await apiRequest(
            "/expenditures",
            {

                method: "POST",

                body: JSON.stringify({

                    description: description,

                    amount: amount,

                    application: {
                        id: applicationId
                    }

                })

            }
        );


        showToast(
            "Expenditure Recorded",
            "Expense saved successfully."
        );


        event.target.reset();


        await loadExpenditures();

    } catch (error) {

        showToast(
            "Expenditure Failed",
            error.message,
            true
        );

    }

}


/* =========================================================
   NEAR DEADLINE
   ========================================================= */

async function loadNearDeadline() {

    try {

        nearDeadlineApplications =
            await apiRequest(
                "/applications/near-deadline"
            );


        renderDeadlineCards();

        renderDashboardDeadlines();

        updateDashboard();

    } catch (error) {

        document.getElementById(
            "deadlineCards"
        ).innerHTML =
            emptyState(error.message);

    }

}


function renderDeadlineCards() {

    const container =
        document.getElementById(
            "deadlineCards"
        );


    if (!nearDeadlineApplications.length) {

        container.innerHTML =
            emptyState(
                "No grants are nearing their deadline."
            );

        return;

    }


    container.innerHTML =
        nearDeadlineApplications
            .map(application => `

                <div class="deadline-card">

                    <div class="deadline-icon">

                        <i class="fa-solid fa-clock"></i>

                    </div>


                    <h3>
                        ${escapeHtml(
                application.title
            )}
                    </h3>


                    <p>
                        Faculty:
                        ${escapeHtml(
                application.faculty?.name ||
                "Not assigned"
            )}
                    </p>


                    <p>
                        Requested:
                        ₹${formatNumber(
                application.requestedAmount
            )}
                    </p>


                    <div class="deadline-date">

                        <i class="fa-solid fa-calendar"></i>

                        Deadline:
                        ${formatDate(
                application.deadline
            )}

                    </div>

                </div>

            `)
            .join("");

}


function renderDashboardDeadlines() {

    const container =
        document.getElementById(
            "dashboardDeadlines"
        );


    if (!nearDeadlineApplications.length) {

        container.innerHTML =
            emptyState(
                "No approaching deadlines."
            );

        return;

    }


    container.innerHTML =
        nearDeadlineApplications
            .slice(0, 4)
            .map(application => `

                <div class="deadline-item">

                    <strong>
                        ${escapeHtml(
                application.title
            )}
                    </strong>

                    <span>
                        Deadline:
                        ${formatDate(
                application.deadline
            )}
                    </span>

                </div>

            `)
            .join("");

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    document.getElementById(
        "facultyCount"
    ).textContent =
        faculties.length;


    document.getElementById(
        "applicationCount"
    ).textContent =
        applications.length;


    document.getElementById(
        "approvedCount"
    ).textContent =
        applications.filter(
            application =>
                application.status &&
                application.status.toUpperCase() ===
                "APPROVED"
        ).length;


    document.getElementById(
        "deadlineCount"
    ).textContent =
        nearDeadlineApplications.length;


    renderRecentApplications();

}


function renderRecentApplications() {

    const body =
        document.getElementById(
            "recentApplicationsBody"
        );


    const recent =
        [...applications]
            .reverse()
            .slice(0, 5);


    if (!recent.length) {

        body.innerHTML =
            emptyTableRow(
                4,
                "No applications available."
            );

        return;

    }


    body.innerHTML =
        recent.map(application => `

            <tr>

                <td>
                    <strong>
                        ${escapeHtml(
            application.title
        )}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(
            application.faculty?.name ||
            "N/A"
        )}
                </td>


                <td>
                    ₹${formatNumber(
            application.requestedAmount
        )}
                </td>


                <td>
                    ${statusBadge(
            application.status
        )}
                </td>

            </tr>

        `).join("");

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const search =
        document.getElementById(
            "applicationSearch"
        );


    search.addEventListener(
        "input",
        () => {

            const value =
                search.value
                    .trim()
                    .toLowerCase();


            const filtered =
                applications.filter(
                    application =>

                        (
                            application.title ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        (
                            application.faculty?.name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                        ||

                        (
                            application.status ||
                            ""
                        )
                            .toLowerCase()
                            .includes(value)

                );


            renderApplications(filtered);

        }
    );

}


/* =========================================================
   FORMS
   ========================================================= */

function setupForms() {

    document
        .getElementById("facultyForm")
        .addEventListener(
            "submit",
            createFaculty
        );


    document
        .getElementById("applicationForm")
        .addEventListener(
            "submit",
            createApplication
        );


    document
        .getElementById("stageForm")
        .addEventListener(
            "submit",
            createStage
        );


    document
        .getElementById("expenditureForm")
        .addEventListener(
            "submit",
            createExpenditure
        );

}


/* =========================================================
   CREATE FACULTY
   ========================================================= */

async function createFaculty(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "facultyName"
        ).value.trim();


    const email =
        document.getElementById(
            "facultyEmail"
        ).value.trim();


    const department =
        document.getElementById(
            "facultyDepartment"
        ).value.trim();


    try {

        await apiRequest(
            "/faculties",
            {

                method: "POST",

                body: JSON.stringify({

                    name: name,

                    email: email,

                    department: department

                })

            }
        );


        showToast(
            "Faculty Added",
            "Faculty member created successfully."
        );


        event.target.reset();


        await loadFaculty();

    } catch (error) {

        showToast(
            "Faculty Creation Failed",
            error.message,
            true
        );

    }

}


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function statusBadge(status) {

    if (!status) {

        return `
            <span class="badge">
                UNKNOWN
            </span>
        `;

    }


    const normalized =
        status.toUpperCase();


    const className =
        normalized
            .toLowerCase()
            .replace("_", "-");


    return `
        <span class="badge ${className}">
            ${normalized.replace("_", " ")}
        </span>
    `;

}


function formatNumber(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "0";

    }


    return Number(value)
        .toLocaleString("en-IN");

}


function formatDate(date) {

    if (!date) {
        return "Not set";
    }


    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function updateCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    element.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


function emptyTableRow(
    columns,
    message
) {

    return `
        <tr>

            <td colspan="${columns}">

                <div class="empty-state">

                    <i class="fa-regular fa-folder-open"></i>

                    <p>
                        ${escapeHtml(message)}
                    </p>

                </div>

            </td>

        </tr>
    `;

}


function emptyState(message) {

    return `
        <div class="empty-state">

            <i class="fa-regular fa-folder-open"></i>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>
    `;

}


function renderError(
    elementId,
    columns,
    message
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.innerHTML =
        emptyTableRow(
            columns,
            message
        );

}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(
    title,
    message,
    isError = false
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastTitle =
        document.getElementById(
            "toastTitle"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    const icon =
        toast.querySelector(
            ".toast-icon"
        );


    toastTitle.textContent =
        title;


    toastMessage.textContent =
        message;


    if (isError) {

        icon.style.background =
            "#fef2f2";

        icon.style.color =
            "#dc2626";

        icon.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

    } else {

        icon.style.background =
            "#f0fdf4";

        icon.style.color =
            "#16a34a";

        icon.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

}