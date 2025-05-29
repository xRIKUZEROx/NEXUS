// Funcionalidad del modal de cámara
const openCameraBtn = document.getElementById('open-camera');
const mobileOpenCameraBtn = document.getElementById('mobile-open-camera');
const closeCameraBtn = document.getElementById('close-camera');
const cameraModal = document.getElementById('camera-modal');

openCameraBtn.addEventListener('click', () => {
    cameraModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

mobileOpenCameraBtn.addEventListener('click', () => {
    cameraModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeCameraBtn.addEventListener('click', () => {
    cameraModal.style.display = 'none';
    document.body.style.overflow = '';
});

// Cerrar modal al hacer clic fuera
cameraModal.addEventListener('click', (e) => {
    if (e.target === cameraModal) {
        cameraModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Funcionalidad del modal de chat
const openChatBtn = document.getElementById('open-chat');
const closeChatBtn = document.getElementById('close-chat');
const chatModal = document.getElementById('chat-modal');

openChatBtn.addEventListener('click', () => {
    chatModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeChatBtn.addEventListener('click', () => {
    chatModal.style.display = 'none';
    document.body.style.overflow = '';
});

// Cerrar modal al hacer clic fuera
chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) {
        chatModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Funcionalidad de like
const likeButtons = document.querySelectorAll('.post-action.fa-heart, .post-action.fa-heart');

likeButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('far')) {
            this.classList.remove('far');
            this.classList.add('fas');
            this.style.color = '#ed4956';
        } else {
            this.classList.remove('fas');
            this.classList.add('far');
            this.style.color = '';
        }
    });
});

// Funcionalidad de guardar
const saveButtons = document.querySelectorAll('.post-action.fa-bookmark');

saveButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('far')) {
            this.classList.remove('far');
            this.classList.add('fas');
        } else {
            this.classList.remove('fas');
            this.classList.add('far');
        }
    });
});

// Habilitar botón de comentario cuando hay texto
const commentInputs = document.querySelectorAll('.comment-input');
const postButtons = document.querySelectorAll('.post-button');

commentInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            postButtons[index].classList.add('active');
        } else {
            postButtons[index].classList.remove('active');
        }
    });
});

// Animación al pasar el ratón sobre las historias
const stories = document.querySelectorAll('.story');

stories.forEach(story => {
    story.addEventListener('mouseenter', function() {
        this.querySelector('.story-avatar').style.transform = 'scale(1.1)';
    });
    
    story.addEventListener('mouseleave', function() {
        this.querySelector('.story-avatar').style.transform = '';
    });
});

// Efecto de hover en botones de seguir
const followButtons = document.querySelectorAll('.follow-button');

followButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.color = '#7b1fa2';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.color = '#e91e63';
    });
});

// Efecto de hover en los iconos de navegación móvil
const mobileNavIcons = document.querySelectorAll('.mobile-nav-icon');

mobileNavIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.color = '#e91e63';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.color = '#e0e0e0';
    });
});

// Cargar más contenido al hacer scroll
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        // Aquí iría la lógica para cargar más contenido
        console.log('Cargar más publicaciones...');
    }
});

// Mostrar tooltips al pasar el ratón
const tooltipElements = document.querySelectorAll('[data-tooltip]');

tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
    });
    
    el.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});