export function showToast(message, type = "danger") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // Remove as classes antigas para garantir que o novo tipo de toast seja aplicado
//toast.classList.remove("text-bg-success", "text-bg-success-emphasis", "text-bg-danger", "text-bg-warning", "text-bg-info", "text-bg-primary");
  toast.classList.add(`text-bg-${type}`);

  // Define a mensagem do toast
  toastMessage.textContent = message;

  // Cria uma instância do toast do Bootstrap e exibe
  const bootstrapToast = bootstrap.Toast.getOrCreateInstance(toast);
  bootstrapToast.show();

  // Esconde o toast depois de 3 segundos
  setTimeout(() => {
    bootstrapToast.hide();
  }, 3000);
}