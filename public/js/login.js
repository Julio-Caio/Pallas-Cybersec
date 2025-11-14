document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");

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
      const response = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailField.value,
          password: passwordField.value,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { error: "Erro inesperado" };
      }

      if (response.ok) {
        alert("Login bem-sucedido!");

        // Após 3 segundos, redireciona para a página de domínios
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        alert("Não foi possível fazer login com esse usuário!");
      }
    } catch (error) {
      // Exibe o toast em caso de erro ao processar a solicitação
      alert("Erro ao processar a solicitação.");
    }
  });