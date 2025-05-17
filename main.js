// Funcionalidades principais do site
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth Scrolling para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fechar menu mobile se estiver aberto
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animações de scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Verificar elementos visíveis no carregamento inicial
    checkFade();
    
    // Verificar elementos visíveis durante o scroll
    window.addEventListener('scroll', checkFade);
    
    // Lightbox para galeria
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems.length > 0 && lightbox && lightboxContent) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightboxContent.src = item.src;
                lightboxContent.alt = item.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Lazy loading para imagens
    const lazyImages = document.querySelectorAll('img.lazy-load');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.add('loaded');
                    observer.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
});

// Validação do formulário de contato
function validateForm() {
    let isValid = true;
    const form = document.getElementById('contact-form');
    
    if (!form) return false;
    
    // Limpar mensagens de erro anteriores
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
    
    const formControls = form.querySelectorAll('.form-control');
    formControls.forEach(control => control.classList.remove('error'));
    
    // Validar nome
    const nameInput = document.getElementById('name');
    if (nameInput && nameInput.value.trim() === '') {
        showError(nameInput, 'Por favor, informe seu nome');
        isValid = false;
    }
    
    // Validar email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailValue === '') {
            showError(emailInput, 'Por favor, informe seu email');
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            showError(emailInput, 'Por favor, informe um email válido');
            isValid = false;
        }
    }
    
    // Validar telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        const phoneValue = phoneInput.value.trim();
        const phoneRegex = /^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/;
        
        if (phoneValue === '') {
            showError(phoneInput, 'Por favor, informe seu telefone');
            isValid = false;
        } else if (!phoneRegex.test(phoneValue)) {
            showError(phoneInput, 'Formato: (99) 99999-9999 ou 99999-9999');
            isValid = false;
        }
    }
    
    // Validar tipo de evento
    const eventTypeSelect = document.getElementById('event-type');
    if (eventTypeSelect && eventTypeSelect.value === '') {
        showError(eventTypeSelect, 'Por favor, selecione o tipo de evento');
        isValid = false;
    }
    
    // Validar mensagem
    const messageInput = document.getElementById('message');
    if (messageInput && messageInput.value.trim() === '') {
        showError(messageInput, 'Por favor, informe sua mensagem');
        isValid = false;
    }
    
    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerText = message;
    
    const parentElement = input.parentElement;
    parentElement.appendChild(errorElement);
}

// Máscara para telefone
function maskPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
        value = value.replace(/^(\d{0,2})/, '($1');
    }
    
    input.value = value;
}

// Envio do formulário
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Aqui seria a integração com o backend para envio real
                // Por enquanto, simulamos o envio
                
                // Mostrar mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4';
                successMessage.innerHTML = '<strong class="font-bold">Sucesso!</strong><span class="block sm:inline"> Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.</span>';
                
                contactForm.appendChild(successMessage);
                
                // Limpar formulário
                contactForm.reset();
                
                // Remover mensagem após 5 segundos
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
        
        // Adicionar máscara ao campo de telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                maskPhone(this);
            });
        }
    }
});
