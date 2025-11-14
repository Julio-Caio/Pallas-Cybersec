document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const repeatPasswordField = document.getElementById("repeatpassword");
    const mydomainField = document.getElementById("mydomain");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailError = document.getElementById("emailError");

    if (!emailRegex.test(emailField.value)) {
        if (!emailError) {
            emailError = document.createElement("div");
            emailError.id = "emailError";
            emailError.style.color = "red";
            emailError.textContent = "Por favor, insira um e-mail válido.";
            emailField.insertAdjacentElement("afterend", emailError);
        }
    } else {
        if (emailError) {
            emailError.remove();
        }
    }

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: emailField.value.split('@')[0],
                email: emailField.value,
                password: passwordField.value,
                repeatpassword: repeatPasswordField.value,
                mydomain: mydomainField.value,
            }),
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = { error: "Erro inesperado" };
        }

        if (response.ok) {
            alert("Cadastro bem-sucedido!");

            // Após 3 segundos, redireciona para a página de domínios
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } else {
            alert("Não foi possível cadastrar esse usuário!");
        }
    } catch (error) {
        // Exibe o toast em caso de erro ao processar a solicitação
        alert("Erro ao processar a solicitação.");
    }
});