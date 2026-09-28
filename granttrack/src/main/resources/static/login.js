const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginError =
    document.getElementById("loginError");

const errorMessage =
    document.getElementById("errorMessage");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginIcon =
    document.getElementById("loginIcon");


/* =========================================================
   SHOW / HIDE PASSWORD
   ========================================================= */

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});


/* =========================================================
   LOGIN FORM
   ========================================================= */

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideError();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showError("Please enter your email and password.");

        return;
    }


    setLoading(true);


    try {

        /*
         * Backend login endpoint will be connected here.
         *
         * For now we are only testing the login page UI.
         */

        await new Promise(resolve =>
            setTimeout(resolve, 800)
        );


        /*
         * TEMPORARY TEST LOGIN
         *
         * We will REMOVE this after
         * connecting Spring Boot authentication.
         */

        if (
            email === "admin@granttrack.com" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "granttrackLoggedIn",
                "true"
            );

            window.location.href = "/index.html";

        } else {

            showError(
                "Invalid email or password."
            );

        }

    } catch (error) {

        showError(
            "Unable to connect to the server."
        );

    } finally {

        setLoading(false);

    }

});


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

    errorMessage.textContent = message;

    loginError.classList.add("show");

}


function hideError() {

    loginError.classList.remove("show");

}


/* =========================================================
   LOADING
   ========================================================= */

function setLoading(loading) {

    loginButton.disabled = loading;

    if (loading) {

        loginButtonText.textContent =
            "Signing In...";

        loginIcon.className =
            "fa-solid fa-spinner fa-spin";

    } else {

        loginButtonText.textContent =
            "Sign In";

        loginIcon.className =
            "fa-solid fa-arrow-right";

    }

}