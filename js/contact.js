const form = document.querySelector(".contact-form");
const submitBtn = document.getElementById("submitbutton");
const modal = document.getElementById("messageModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.getElementById("closeModal");
const fields = document.querySelectorAll(".form-group input, .form-group textarea");

function showModal(title, message){

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.classList.add("show");

}

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

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
