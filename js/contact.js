const form = document.querySelector(".contact-form");
const submitBtn = document.getElementById("submitbutton");
const modal = document.getElementById("messageModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.getElementById("closeModal");
let previousFocus = null;

function showModal(title, message){

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    previousFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : submitBtn;

    if (typeof modal.showModal === "function") {
        modal.showModal();
    } else {
        modal.setAttribute("open", "");
    }

    closeModal.focus();

}

function closeMessageModal() {
    if (modal.open && typeof modal.close === "function") {
        modal.close();
    } else {
        modal.removeAttribute("open");
    }
}

closeModal.addEventListener("click", closeMessageModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeMessageModal();
    }
});

modal.addEventListener("close", () => {
    const restoreTarget = previousFocus?.isConnected && !previousFocus.disabled ? previousFocus : submitBtn;
    requestAnimationFrame(() => restoreTarget?.focus());
});

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // simulate sending
    setTimeout(()=>{

        const success = true;

        if(success){

            showModal(
    "Message Was Sent",
    "Thank you for contacting Chef Kitchen. We'll get back to you as soon as possible."
);

            form.reset();

        }else{

            showModal(
    "Failed to Send Message",
    "Something went wrong while sending your message. Please try again later."
);
        }

        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";

    },1500);
});
