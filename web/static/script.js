const ui = new UI();
const adam = new Adam('smiker');

document.querySelector('.footer').focus();
document.querySelector('.footer').addEventListener('keydown', async function(event) {
    // 1. Detectar si se pulsa Enter y asegurar que el texto no esté vacío ni sean solo espacios
    if (event.key === 'Enter' && this.value.trim() !== '') {
        const prompt = this.value.trim();
        ui.lock();
        ui.print(prompt, 'user');
        try {
            const reply = await adam.think( prompt ); 
            await adam.say( reply );
        } catch (error) {
            console.error('Error durante el proceso:', error);
            ui.print(`Hubo un error al procesar tu solicitud: ${error}`, 'error');
        } finally {
            adam.idle();
            ui.unlock();
        }
    }
});

// Función auxiliar necesaria en Django para obtener el token CSRF desde las cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
